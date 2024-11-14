import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Star, TruckIcon, Shield, ArrowLeft } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useStore } from '../store/useStore';

export function ProductPage() {
  const { productId } = useParams();
  const [product, setProduct] = React.useState<any>(null);
  const closeSidebar = useStore(state => state.closeSidebar);

  React.useEffect(() => {
    closeSidebar();
    
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        const productDoc = await getDoc(doc(db, 'products', productId));
        if (productDoc.exists()) {
          setProduct({ id: productDoc.id, ...productDoc.data() });
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    
    fetchProduct();
  }, [productId, closeSidebar]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 mb-6">
          <ArrowLeft size={20} />
          <span>Back to Feed</span>
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-white">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  alt={`${product.name} view ${i + 1}`}
                  className="aspect-square rounded-lg object-cover cursor-pointer hover:opacity-75"
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            <div className="text-3xl font-bold text-gray-900">${product.price}</div>

            <div className="prose prose-sm text-gray-600">
              <h3 className="text-lg font-semibold text-gray-900">Description</h3>
              <p>{product.description}</p>
              {product.features && (
                <>
                  <h3 className="text-lg font-semibold text-gray-900">Features</h3>
                  <ul>
                    {product.features.map((feature: string, i: number) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {product.sizes && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Select Size</h3>
                <div className="flex gap-2">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      className="px-4 py-2 border rounded-md bg-gray-800 text-white hover:bg-gray-700"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Select Color</h3>
                <div className="flex gap-2">
                  {product.colors.map((color: string) => (
                    <button
                      key={color}
                      className="px-4 py-2 border rounded-md bg-gray-800 text-white hover:bg-gray-700"
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button className="w-full bg-black text-white py-4 rounded-lg font-medium hover:bg-gray-800 flex items-center justify-center gap-2">
              <ShoppingCart size={20} />
              Add to Cart
            </button>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex flex-col items-center text-center">
                <TruckIcon size={24} className="text-gray-600" />
                <span className="text-sm mt-1">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield size={24} className="text-gray-600" />
                <span className="text-sm mt-1">1 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Star size={24} className="text-gray-600" />
                <span className="text-sm mt-1">Top Rated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}