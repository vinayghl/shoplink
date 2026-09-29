import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { testConnection } from './firebase';
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
import { ErrorModal, ErrorType } from './components/ErrorModal';
import { Footer } from './components/Footer';
import { Plus, WifiOff, X } from 'lucide-react';

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
  const [activeError, setActiveError] = useState<ErrorType | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    testConnection();
  }, []);

  // Graceful offline detection: Never blocks the screen with an aggressive modal
  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
    };
    const handleOnline = () => {
      setIsOffline(false);
      showToast('Internet connection restored.');
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
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

  // Featured and non-featured collections
  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.featured);
  }, [products]);

  const nonFeaturedProducts = useMemo(() => {
    return products.filter((p) => !p.featured);
  }, [products]);

  // Check if we are on default unfiltered homepage view
  const isDefaultHomepage = !searchQuery && selectedCategory === 'All' && selectedPlatform === 'All';

  // Prevent duplicate rendering
  const areAllProductsFeatured = isDefaultHomepage && featuredProducts.length > 0 && nonFeaturedProducts.length === 0;

  // Secondary catalog grid
  const secondaryProducts = useMemo(() => {
    if (isDefaultHomepage && featuredProducts.length > 0) {
      return nonFeaturedProducts;
    }
    return displayProducts;
  }, [isDefaultHomepage, featuredProducts.length, nonFeaturedProducts, displayProducts]);

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-900 dark:text-slate-100 transition-colors duration-200 w-full max-w-full overflow-x-hidden">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl shadow-xl text-xs font-sweetpea font-bold flex items-center gap-2 animate-in fade-in duration-150">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Non-intrusive offline status banner: Never blocks the screen */}
      {isOffline && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 rounded-full bg-slate-900/95 dark:bg-slate-800/95 text-white text-xs font-sweetpea font-bold flex items-center gap-2 shadow-2xl backdrop-blur-md border border-cyan-500/40 animate-in fade-in slide-in-from-top-2">
          <WifiOff className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Offline mode · Showing cached products</span>
          <button 
            onClick={() => setIsOffline(false)} 
            className="ml-1 p-0.5 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white"
            aria-label="Dismiss offline notice"
          >
            <X className="w-3 h-3" />
          </button>
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

      {/* ADMIN WORKSPACE: Dedicated management screen when Admin Mode is open */}
      {isAdmin && isAdminDashboardOpen ? (
        <main className="flex-1 w-full max-w-full min-w-0">
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
        </main>
      ) : (
        /* PUBLIC STOREFRONT: Products, Hero, and Category Browsing */
        <main className="flex-1 w-full max-w-full min-w-0">
          
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

          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-10 min-w-0">

            {/* FEATURED PRODUCTS SECTION */}
            {isDefaultHomepage && featuredProducts.length > 0 && (
              <section className="space-y-3.5 sm:space-y-4 min-w-0">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
                  <div className="flex items-baseline gap-2">
                    <h2 className="font-sweetpea text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
                      Featured Products
                    </h2>
                    <span className="font-sweetpea text-xs text-cyan-600 dark:text-cyan-400 font-bold">
                      Recommended picks ({featuredProducts.length})
                    </span>
                  </div>
                </div>

                {/* RESPONSIVE GRID: 1 column on mobile (< 640px), 2 on tablet, 3 on desktop, 4 on wide desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 min-w-0">
                  {featuredProducts.map((product) => (
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

            {/* SECONDARY CATALOG SECTION */}
            {!areAllProductsFeatured && (
              <section className="space-y-3.5 sm:space-y-4 min-w-0">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
                  <div className="flex items-baseline gap-2 min-w-0">
                    <h2 className="font-sweetpea text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-tight truncate">
                      {isDefaultHomepage 
                        ? (featuredProducts.length > 0 ? 'More Products' : 'All Products') 
                        : (searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory)
                      }
                    </h2>
                    {selectedPlatform !== 'All' && (
                      <span className="font-sweetpea text-xs text-cyan-600 dark:text-cyan-400 font-bold shrink-0">
                        on {selectedPlatform}
                      </span>
                    )}
                  </div>
                  
                  <span className="font-sweetpea tabular-numbers text-xs text-slate-500 dark:text-slate-400 font-bold shrink-0">
                    {secondaryProducts.length} {secondaryProducts.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {loading ? (
                  <div className="py-20 flex flex-col items-center justify-center space-y-2">
                    <div className="w-8 h-8 border-2 border-cyan-500 dark:border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <p className="font-sweetpea text-xs text-slate-500 dark:text-slate-400 font-bold">Loading products...</p>
                  </div>
                ) : products.length === 0 ? (
                  /* Empty state when database has 0 products */
                  <div className="py-12 sm:py-16 text-center space-y-4 bg-white/90 dark:bg-[#0c121e]/90 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-cyan-500/25 p-6 sm:p-8 shadow-xl max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                      <Plus className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-sweetpea text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                        Showcase Catalog is Ready
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                        Ready to showcase your affiliate deals. Upload your products to go live.
                      </p>
                    </div>
                    <div className="pt-2">
                      {isAdmin ? (
                        <button
                          onClick={() => {
                            setEditingProduct(null);
                            setIsAddModalOpen(true);
                          }}
                          className="font-sweetpea inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 dark:from-cyan-400 dark:to-teal-300 text-white dark:text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all touch-manipulation min-h-[44px]"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Upload First Product</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsAuthModalOpen(true)}
                          className="font-sweetpea inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 dark:from-cyan-400 dark:to-teal-300 text-white dark:text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all touch-manipulation min-h-[44px]"
                        >
                          <span>Admin Sign In</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : secondaryProducts.length === 0 ? (
                  /* No filter matches state */
                  <div className="py-12 sm:py-16 text-center space-y-4 bg-white/90 dark:bg-[#0c121e]/90 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-cyan-500/25 p-6 sm:p-8 max-w-md mx-auto shadow-xl">
                    <div className="space-y-1">
                      <h3 className="font-sweetpea text-base font-extrabold text-slate-900 dark:text-white">
                        No matching products found
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                        Try checking your search keywords or clearing your platform and category filters.
                      </p>
                    </div>
                    <div className="pt-1">
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('All');
                          setSelectedPlatform('All');
                        }}
                        className="font-sweetpea px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-teal-600 dark:from-cyan-400 dark:to-teal-300 dark:text-slate-950 rounded-xl shadow-sm hover:brightness-105 transition-all touch-manipulation min-h-[40px]"
                      >
                        Reset filters
                      </button>
                    </div>
                  </div>
                ) : (
                  /* RESPONSIVE GRID: 1 column on mobile (< 640px), 2 on tablet, 3 on desktop, 4 on wide desktop */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 min-w-0">
                    {secondaryProducts.map((product) => (
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
            )}

          </div>
        </main>
      )}

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

      {/* Custom Error Modal: displayed only when explicitly triggered (e.g. from footer test button) */}
      <ErrorModal
        type={activeError}
        onClose={() => setActiveError(null)}
        onRetry={() => window.location.reload()}
      />

      {/* Footer */}
      <Footer
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
        onOpenErrorModal={(err) => setActiveError(err)}
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
