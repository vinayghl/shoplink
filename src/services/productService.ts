import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  increment,
  getDocs
} from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError, ADMIN_EMAIL } from '../firebase';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const LOCAL_STORAGE_KEY = 'shoplink_v2_products_cache';

// Helper to get cached products from localStorage or fallback
export function getLocalCachedProducts(): Product[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse local cached products', e);
  }
  return INITIAL_PRODUCTS;
}

// Helper to save products locally
export function saveLocalCachedProducts(products: Product[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.warn('Failed to save to local cache (possibly quota)', e);
  }
}

/**
 * Subscribes to products from Firestore with seamless local cache fallback.
 */
export function subscribeToProducts(
  onProducts: (products: Product[]) => void,
  onError?: (err: unknown) => void
): () => void {
  const collectionRef = collection(db, 'products');

  try {
    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: Product[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            items.push({
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

          // Sort by featured first, then newest
          items.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
          });

          saveLocalCachedProducts(items);
          onProducts(items);
        } else {
          // If remote collection is completely empty, provide initial products
          const local = getLocalCachedProducts();
          onProducts(local);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'products');
        if (onError) onError(error);
        // Fallback to local storage
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
 * Creates a new product in Firestore (and syncs local cache).
 */
export async function createProduct(product: Omit<Product, 'id'>): Promise<string> {
  const id = 'prod_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();
  
  const newProduct: Product = {
    ...product,
    id,
    clicks: 0,
    createdAt: now,
    updatedAt: now,
    creatorEmail: auth.currentUser?.email || ADMIN_EMAIL
  };

  try {
    const docRef = doc(db, 'products', id);
    await setDoc(docRef, newProduct);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `products/${id}`);
    console.warn('Falling back to local cache write for created product.');
  }

  // Always update local cache
  const existing = getLocalCachedProducts();
  const updated = [newProduct, ...existing];
  saveLocalCachedProducts(updated);

  return id;
}

/**
 * Updates an existing product in Firestore.
 */
export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  const now = new Date().toISOString();
  const payload = {
    ...updates,
    updatedAt: now
  };

  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, payload);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
    console.warn('Falling back to local cache write for updated product.');
  }

  // Update local cache
  const existing = getLocalCachedProducts();
  const updated = existing.map((p) => (p.id === id ? { ...p, ...payload } : p));
  saveLocalCachedProducts(updated);
}

/**
 * Deletes a product from Firestore.
 */
export async function deleteProduct(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    console.warn('Falling back to local cache deletion.');
  }

  // Update local cache
  const existing = getLocalCachedProducts();
  const updated = existing.filter((p) => p.id !== id);
  saveLocalCachedProducts(updated);
}

/**
 * Tracks an affiliate link click.
 */
export async function recordProductClick(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, {
      clicks: increment(1)
    });
  } catch (err) {
    // Non-blocking for client
    console.debug('Click counter update error or client-side mode', err);
  }

  // Update local cache clicks
  const existing = getLocalCachedProducts();
  const updated = existing.map((p) =>
    p.id === id ? { ...p, clicks: (p.clicks || 0) + 1 } : p
  );
  saveLocalCachedProducts(updated);
}
