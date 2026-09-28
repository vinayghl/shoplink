import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { testConnection, ADMIN_EMAIL } from './firebase';
import { Product } from './types';
import { 
  subscribeToProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  recordProductClick,
  deduplicateProducts
} from './services/productService';
import { Navbar } from './components/Navbar';
import { HeroCreatorBanner } from './components/HeroCreatorBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AdminProductModal } from './components/AdminProductModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AffiliateRedirectModal } from './components/AffiliateRedirectModal';
import { Footer } from './components/Footer';
import { Search, Plus, ShoppingBag } from 'lucide-react';

function ShowcaseContent() {
  const { isAdmin } = useAuth();

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  // Modals & Panels
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [redirectingProduct, setRedirectingProduct] = useState<Product | null>(null);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    testConnection();
  }, []);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToProducts((loadedProducts) => {
      setProducts(deduplicateProducts(loadedProducts));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSaveProduct = async (productData: Omit<Product, 'id'>, id?: string) => {
    if (id) {
      await updateProduct(id, productData);
      setProducts((prev) => 
        prev.map((p) => (p.id === id ? { ...p, ...productData, updatedAt: new Date().toISOString() } : p))
      );
      showToast('Product updated successfully.');
    } else {
      const newProduct = await createProduct(productData);
      setProducts((prev) => deduplicateProducts([newProduct, ...prev]));
      showToast('New product added to catalog.');
    }
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed from catalog.');
  };

  const handleBuyClick = (product: Product) => {
    recordProductClick(product.id);
    setRedirectingProduct(product);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsAddModalOpen(true);
  };

  const displayProducts = useMemo(() => {
    let result = products.filter((p) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        p.title.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.platform.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.tags?.some((t) => t.toLowerCase().includes(query));

      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesPlat = selectedPlatform === 'All' || p.platform === selectedPlatform;

      return matchesSearch && matchesCat && matchesPlat;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.clicks || 0) - (a.clicks || 0);
      }
      if (sortBy === 'popular') {
        return (b.clicks || 0) - (a.clicks || 0);
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      }
      if (sortBy === 'price-low') {
        return a.price - b.price;
      }
      if (sortBy === 'price-high') {
        return b.price - a.price;
      }
      return 0;
    });

    return deduplicateProducts(result);
  }, [products, searchQuery, selectedCategory, selectedPlatform, sortBy]);

  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.featured);
  }, [products]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onOpenAddModal={() => {
          setEditingProduct(null);
          setIsAddModalOpen(true);
        }}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(!isAdminDashboardOpen)}
        isAdminDashboardOpen={isAdminDashboardOpen}
        totalProductsCount={products.length}
      />

      {/* Admin Panel */}
      {isAdmin && isAdminDashboardOpen && (
        <AdminDashboard
          products={products}
          onOpenAddModal={() => {
            setEditingProduct(null);
            setIsAddModalOpen(true);
          }}
          onEditProduct={handleEditClick}
          onDeleteProduct={handleDeleteProduct}
          onCloseDashboard={() => setIsAdminDashboardOpen(false)}
        />
      )}

      {/* Main Showcase */}
      <main className="flex-1">
        
        {/* Banner with filters */}
        <HeroCreatorBanner
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedPlatform={selectedPlatform}
          setSelectedPlatform={setSelectedPlatform}
          sortBy={sortBy}
          setSortBy={setSortBy}
          totalProducts={displayProducts.length}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

          {/* Featured Section */}
          {!searchQuery && selectedCategory === 'All' && selectedPlatform === 'All' && featuredProducts.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                    Featured Products
                  </h2>
                  <span className="text-xs text-slate-400 dark:text-slate-500">Recommended picks</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {featuredProducts.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetail={setSelectedProductDetail}
                    onBuyClick={handleBuyClick}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteProduct}
                  />
                ))}
              </div>
            </section>
          )}

          {/* All Catalog Products */}
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-baseline gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                  {!searchQuery && selectedCategory === 'All' && selectedPlatform === 'All' && featuredProducts.length > 0 ? 'All Products' : selectedCategory}
                </h2>
                {selectedPlatform !== 'All' && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    on {selectedPlatform}
                  </span>
                )}
              </div>
              
              <span className="tabular-numbers text-xs text-slate-500 dark:text-slate-400 font-medium">
                {displayProducts.length} items
              </span>
            </div>

            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center space-y-2">
                <div className="w-8 h-8 border-2 border-slate-900 dark:border-white border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-500 dark:text-slate-400">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center space-y-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-2xs max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Showcase Catalog is Empty
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                    All fake preset items have been cleared. Upload your genuine affiliate products directly to your database.
                  </p>
                </div>
                <div>
                  {isAdmin ? (
                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setIsAddModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Upload First Product</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                    >
                      <span>Admin Sign In</span>
                    </button>
                  )}
                </div>
              </div>
            ) : displayProducts.length === 0 ? (
              <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">
                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  No matching products found
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Try checking your search keywords or clearing your platform filter.
                </p>
                <div className="pt-1">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setSelectedPlatform('All');
                    }}
                    className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Reset filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {displayProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetail={setSelectedProductDetail}
                    onBuyClick={handleBuyClick}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteProduct}
                  />
                ))}
              </div>
            )}
          </section>

        </div>
      </main>

      {/* Modals */}
      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        onBuyClick={handleBuyClick}
        onEdit={handleEditClick}
      />

      <AdminProductModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        editProduct={editingProduct}
      />

      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <AffiliateRedirectModal
        product={redirectingProduct}
        onClose={() => setRedirectingProduct(null)}
      />

      {/* Footer */}
      <Footer
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ShowcaseContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
