import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  AlertCircle, 
  Link as LinkIcon, 
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { Product, MarketplacePlatform, PLATFORMS, DEFAULT_CATEGORIES } from '../types';
import { compressImageToBase64, CompressedImageResult } from '../utils/imageCompressor';

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id'>, id?: string) => Promise<void>;
  editProduct?: Product | null;
}

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editProduct
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<string>('');
  const [originalPrice, setOriginalPrice] = useState<string>('');
  const [currency, setCurrency] = useState('₹');
  const [platform, setPlatform] = useState<MarketplacePlatform>('Amazon');
  const [customPlatform, setCustomPlatform] = useState('');
  const [affiliateLink, setAffiliateLink] = useState('');
  const [category, setCategory] = useState('Fashion & Apparel');
  const [featured, setFeatured] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // Image processing state
  const [imageBase64, setImageBase64] = useState<string>('');
  const [imageMetadata, setImageMetadata] = useState<{
    sizeFormatted: string;
    width: number;
    height: number;
    format: string;
    isSafe: boolean;
  } | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (editProduct) {
      setTitle(editProduct.title || '');
      setDescription(editProduct.description || '');
      setPrice(editProduct.price !== undefined ? String(editProduct.price) : '');
      setOriginalPrice(editProduct.originalPrice !== undefined ? String(editProduct.originalPrice) : '');
      setCurrency(editProduct.currency || '₹');
      
      if (PLATFORMS[editProduct.platform]) {
        setPlatform(editProduct.platform as MarketplacePlatform);
      } else {
        setPlatform('Other');
        setCustomPlatform(editProduct.platform || '');
      }

      setAffiliateLink(editProduct.affiliateLink || '');
      setCategory(editProduct.category || 'Fashion & Apparel');
      setFeatured(!!editProduct.featured);
      setTagInput(editProduct.tags ? editProduct.tags.join(', ') : '');
      setImageBase64(editProduct.imageBase64 || '');
      
      if (editProduct.imageBase64) {
        const estBytes = Math.floor(editProduct.imageBase64.length * 0.75);
        setImageMetadata({
          sizeFormatted: `${(estBytes / 1024).toFixed(1)} KB`,
          width: 0,
          height: 0,
          format: 'Saved',
          isSafe: estBytes < 850 * 1024
        });
      }
    } else {
      setTitle('');
      setDescription('');
      setPrice('');
      setOriginalPrice('');
      setCurrency('₹');
      setPlatform('Amazon');
      setCustomPlatform('');
      setAffiliateLink('');
      setCategory('Fashion & Apparel');
      setFeatured(false);
      setTagInput('');
      setImageBase64('');
      setImageMetadata(null);
      setImageUrlInput('');
      setShowUrlInput(false);
      setFormError(null);
      setImageError(null);
    }
  }, [editProduct, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    setIsCompressing(true);
    setImageError(null);

    try {
      const result: CompressedImageResult = await compressImageToBase64(file, 1200, 0.88);
      setImageBase64(result.base64);
      setImageMetadata({
        sizeFormatted: result.sizeFormatted,
        width: result.width,
        height: result.height,
        format: result.format,
        isSafe: result.isSafeForFirestore
      });
    } catch (err: any) {
      console.error('Image compression error:', err);
      setImageError(err.message || 'Failed to process image.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleLoadFromUrl = async () => {
    if (!imageUrlInput.trim()) return;
    setIsCompressing(true);
    setImageError(null);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.naturalWidth || 800;
          let height = img.naturalHeight || 800;
          const maxDim = 1200;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);
            const b64 = canvas.toDataURL('image/webp', 0.88);
            const size = Math.floor(b64.length * 0.75);
            setImageBase64(b64);
            setImageMetadata({
              sizeFormatted: `${(size / 1024).toFixed(1)} KB`,
              width,
              height,
              format: 'WEBP',
              isSafe: size < 850 * 1024
            });
            setShowUrlInput(false);
            setImageUrlInput('');
          }
        } catch {
          setImageBase64(imageUrlInput.trim());
          setImageMetadata({
            sizeFormatted: 'External CDN',
            width: 0,
            height: 0,
            format: 'URL',
            isSafe: true
          });
          setShowUrlInput(false);
        }
        setIsCompressing(false);
      };
      img.onerror = () => {
        setImageError('Unable to load image from URL.');
        setIsCompressing(false);
      };
      img.src = imageUrlInput.trim();
    } catch {
      setImageError('Failed to load image from URL.');
      setIsCompressing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('Product title is required.');
      return;
    }

    if (!imageBase64) {
      setFormError('Please upload a product image.');
      return;
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      setFormError('Please enter a valid price.');
      return;
    }

    if (!affiliateLink.trim()) {
      setFormError('Affiliate link is required.');
      return;
    }

    const finalPlatform = platform === 'Other' && customPlatform.trim()
      ? customPlatform.trim()
      : platform;

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .slice(0, 8);

    const productPayload: Omit<Product, 'id'> = {
      title: title.trim(),
      description: description.trim(),
      price: numPrice,
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      currency,
      platform: finalPlatform,
      affiliateLink: affiliateLink.trim(),
      imageBase64,
      category,
      featured,
      tags
    };

    setIsSubmitting(true);
    try {
      await onSave(productPayload, editProduct?.id);
      onClose();
    } catch (err: any) {
      console.error('Error saving product:', err);
      setFormError(err.message || 'Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 my-8 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-zinc-900 dark:text-white">
              {editProduct ? 'Edit Showcase Product' : 'Add New Affiliate Product'}
            </h2>
            <p className="text-xs text-zinc-500">
              High-definition Base64 image encoding for Firestore
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {formError && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Image Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Product Photography (Base64) <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-[11px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 flex items-center gap-1"
              >
                <LinkIcon className="w-3 h-3" />
                <span>{showUrlInput ? 'Upload file' : 'Load from URL'}</span>
              </button>
            </div>

            {showUrlInput && (
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/item.jpg"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleLoadFromUrl}
                  disabled={!imageUrlInput.trim() || isCompressing}
                  className="px-3 py-1.5 text-xs font-semibold bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 disabled:opacity-50"
                >
                  Load
                </button>
              </div>
            )}

            {imageBase64 ? (
              <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 flex items-center gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-zinc-200 shrink-0 border border-zinc-300 dark:border-zinc-600">
                  <img
                    src={imageBase64}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Optimized Base64 Ready
                    </span>
                    {imageMetadata && (
                      <span className="font-mono-num text-[11px] text-zinc-400">
                        {imageMetadata.format} · {imageMetadata.sizeFormatted}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    High sharpness preserved on mobile and retina screens.
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:underline"
                    >
                      Replace photo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageBase64('');
                        setImageMetadata(null);
                      }}
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-6 text-center cursor-pointer hover:border-zinc-500 transition-colors"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                    {isCompressing ? (
                      <div className="w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5" />
                    )}
                  </div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">
                    {isCompressing ? 'Encoding high-quality image...' : 'Click to choose image or drag & drop'}
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Auto-optimized to fit safely inside Firestore 1MB limits
                  </p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {imageError && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{imageError}</span>
              </p>
            )}
          </div>

          {/* Product Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:border-zinc-400 outline-hidden text-zinc-900 dark:text-white"
            />
          </div>

          {/* Marketplace Platform */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">
              Marketplace Platform <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(PLATFORMS) as MarketplacePlatform[]).map((plat) => {
                const isSelected = platform === plat;
                return (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => setPlatform(plat)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900'
                        : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
                    }`}
                  >
                    <span>{PLATFORMS[plat].label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>

            {platform === 'Other' && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Specify marketplace name"
                  value={customPlatform}
                  onChange={(e) => setCustomPlatform(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white"
                />
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg outline-hidden text-zinc-900 dark:text-white"
              >
                <option value="₹">₹ (INR)</option>
                <option value="$">$ (USD)</option>
                <option value="€">€ (EUR)</option>
                <option value="£">£ (GBP)</option>
                <option value="AED">AED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                Deal Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                placeholder="1299"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs font-mono-num font-semibold bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg outline-hidden text-zinc-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                Original MRP
              </label>
              <input
                type="number"
                step="any"
                placeholder="2499"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono-num bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg outline-hidden text-zinc-900 dark:text-white"
              />
            </div>
          </div>

          {/* Affiliate Link */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
              Affiliate Redirect URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              placeholder="https://amazon.in/dp/...?tag=yourtag"
              value={affiliateLink}
              onChange={(e) => setAffiliateLink(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg outline-hidden text-zinc-900 dark:text-white"
            />
          </div>

          {/* Category & Featured */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg outline-hidden text-zinc-900 dark:text-white"
              >
                {DEFAULT_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 sm:pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded-xs text-zinc-900 focus:ring-zinc-900"
                />
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Feature in Curator Spotlight
                </span>
              </label>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
              Keywords (comma separated)
            </label>
            <input
              type="text"
              placeholder="Outfit reel, Streetwear, Amazon find"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg outline-hidden text-zinc-900 dark:text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
              Description &amp; Curator Notes
            </label>
            <textarea
              rows={3}
              placeholder="Sizing recommendations, styling notes, fabric quality, why you like it..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg outline-hidden text-zinc-900 dark:text-white"
            />
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isCompressing}
              className="px-5 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : editProduct ? 'Update Product' : 'Publish Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
