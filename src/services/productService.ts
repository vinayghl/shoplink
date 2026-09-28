import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError, ADMIN_EMAIL } from '../firebase';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const LOCAL_STORAGE_KEY = 'shoplink_v3_products_cache';

// Deduplicate helper: ensures no two products share the same ID
export function deduplicateProducts(list: Product[]): Product[] {
  const seen = new Set<string>();
  const result: Product[] = [];
  for (const item of list) {
    if (item && item.id && !seen.has(item.id)) {
      seen.add(item.id);
      result.push(item);
    }
  }
  return result;
}

// Helper to get cached products from localStorage or fallback
export function getLocalCachedProducts(): Product[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return deduplicateProducts(parsed);
      }
    }
  } catch (e) {
    console.warn('Failed to parse local cached products', e);
  }
  return deduplicateProducts(INITIAL_PRODUCTS);
}

// Helper to save products locally
export function saveLocalCachedProducts(products: Product[]) {
  try {
    const clean = deduplicateProducts(products);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clean));
  } catch (e) {
    console.warn('Failed to save to local cache', e);
  }
}

// Seeds the initial products into Firestore if the collection is empty
async function seedInitialProductsIfEmpty() {
  try {
    const colRef = collection(db, 'products');
    const snap = await getDocs(colRef);
    if (snap.empty) {
      console.log('Seeding initial products into Firestore...');
      for (const p of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', p.id), {
          ...p,
          clicks: p.clicks || 0,
          createdAt: p.createdAt || new Date().toISOString(),
          updatedAt: p.updatedAt || new Date().toISOString(),
          creatorEmail: p.creatorEmail || ADMIN_EMAIL,
          adminPasskey: 'Shoplink2026'
        });
      }
      console.log('Initial products successfully seeded into Firestore.');
    }
  } catch (err) {
    console.warn('Notice while checking Firestore seed:', err);
  }
}

/**
 * Subscribes to products from Firestore with seamless local cache fallback and deduplication.
 */
export function subscribeToProducts(
  onProducts: (products: Product[]) => void,
  onError?: (err: unknown) => void
): () => void {
  // Trigger background seed check
  seedInitialProductsIfEmpty();

  try {
    const collectionRef = collection(db, 'products');
    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteItems: Product[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            remoteItems.push({
              id: docSnap.id,
              title: data.title || '',
              description: data.description || '',
              price: Number(data.price) || 0,
              originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
              currency: data.currency || '₹',
              platform: data.platform || 'Amazon',
              affiliateLink: data.affiliateLink || '#',
              imageBase64: data.imageBase64 || '',
              additionalImages: data.additionalImages || [],
              category: data.category || 'General',
              featured: !!data.featured,
              tags: data.tags || [],
              clicks: Number(data.clicks) || 0,
              createdAt: data.createdAt || new Date().toISOString(),
              updatedAt: data.updatedAt || new Date().toISOString(),
              creatorEmail: data.creatorEmail || ADMIN_EMAIL
            });
          });

          // Merge with any local cache items so no newly added local items vanish
          const localItems = getLocalCachedProducts();
          const remoteIds = new Set(remoteItems.map(p => p.id));
          const localOnly = localItems.filter(p => !remoteIds.has(p.id) && !p.id.startsWith('prod_'));

          const merged = deduplicateProducts([...remoteItems, ...localOnly]);

          // Sort by featured first, then newest
          merged.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
          });

          saveLocalCachedProducts(merged);
          onProducts(merged);
        } else {
          // If remote collection is completely empty, provide deduplicated local products
          const local = getLocalCachedProducts();
          onProducts(local);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'products');
        if (onError) onError(error);
        onProducts(getLocalCachedProducts());
      }
    );

    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'products');
    onProducts(getLocalCachedProducts());
    return () => {};
  }
}

/**
 * Creates a new product in Firestore and updates local cache.
 */
export async function createProduct(product: Omit<Product, 'id'>): Promise<string> {
  const id = 'prod_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
  const now = new Date().toISOString();
  
  const newProduct: Product = {
    ...product,
    id,
    clicks: 0,
    createdAt: now,
    updatedAt: now,
    creatorEmail: auth.currentUser?.email || ADMIN_EMAIL
  };

  // 1. Immediately update local cache to prevent UI lag or data loss
  const current = getLocalCachedProducts();
  const filtered = current.filter(p => p.id !== id);
  const updatedLocal = deduplicateProducts([newProduct, ...filtered]);
  saveLocalCachedProducts(updatedLocal);

  // 2. Persist to Firestore
  try {
    const docRef = doc(db, 'products', id);
    await setDoc(docRef, {
      ...newProduct,
      adminPasskey: 'Shoplink2026'
    });
    console.log('Product saved successfully to Firestore with ID:', id);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `products/${id}`);
    console.warn('Firestore write failed, product saved locally.');
  }

  return id;
}

/**
 * Updates an existing product in Firestore and local cache.
 */
export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  const now = new Date().toISOString();
  const payload = {
    ...updates,
    updatedAt: now
  };

  // 1. Update local cache immediately
  const existing = getLocalCachedProducts();
  const updatedLocal = deduplicateProducts(
    existing.map((p) => (p.id === id ? { ...p, ...payload } : p))
  );
  saveLocalCachedProducts(updatedLocal);

  // 2. Persist to Firestore
  try {
    const docRef = doc(db, 'products', id);
    await setDoc(docRef, {
      ...payload,
      adminPasskey: 'Shoplink2026'
    }, { merge: true });
    console.log('Product updated successfully in Firestore with ID:', id);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
    console.warn('Firestore update failed, updated locally.');
  }
}

/**
 * Deletes a product from Firestore and local cache.
 */
export async function deleteProduct(id: string): Promise<void> {
  // 1. Remove from local cache immediately
  const existing = getLocalCachedProducts();
  const updatedLocal = deduplicateProducts(existing.filter((p) => p.id !== id));
  saveLocalCachedProducts(updatedLocal);

  // 2. Delete from Firestore
  try {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
    console.log('Product deleted from Firestore:', id);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    console.warn('Firestore delete failed, removed locally.');
  }
}

/**
 * Increments product click count.
 */
export async function recordProductClick(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, {
      clicks: (getLocalCachedProducts().find(p => p.id === id)?.clicks || 0) + 1
    });
  } catch (err) {
    // Non-critical, fallback to updating local cache
    const existing = getLocalCachedProducts();
    const updated = existing.map((p) => 
      p.id === id ? { ...p, clicks: (p.clicks || 0) + 1 } : p
    );
    saveLocalCachedProducts(updated);
  }
}
