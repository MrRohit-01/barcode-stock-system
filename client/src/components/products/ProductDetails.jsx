import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  PencilIcon, 
  TrashIcon, 
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';
import { productService } from '../../services/api';

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (location.state?.product) {
      setProduct(location.state.product);
    }
  }, [location]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.delete(product._id);
        toast.success('Product deleted successfully');
        navigate('/dashboard/products');
      } catch (error) {
        toast.error('Error deleting product');
        console.error('Delete error:', error);
      }
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate('/dashboard/products')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Products
        </button>
        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/dashboard/products/edit/${product._id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <PencilIcon className="h-5 w-5" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <TrashIcon className="h-5 w-5" />
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div>
            {product.image ? (
              <div className="relative group">
                <img 
                  src={`${import.meta.env.VITE_APP_URL}${product.image}`}
                  alt={product.name}
                  className="w-full h-auto rounded-lg shadow-md"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg"></div>
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold">SKU:</span> {product.sku}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Barcode:</span> {product.barcode}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Category:</span> {product.category}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Brand:</span> {product.brand || 'N/A'}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Cost Price:</span> ${product.price?.cost?.toFixed(2)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Retail Price:</span> ${product.price?.retail?.toFixed(2)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Stock:</span> {product.stockQuantity}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Min Stock:</span> {product.minStockLevel}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{product.description || 'No description available'}</p>
              </div>

              {/* Stock Status Indicator */}
              <div className="mt-4">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                  product.stockQuantity <= product.minStockLevel
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  <span className="font-medium">
                    {product.stockQuantity <= product.minStockLevel
                      ? 'Low Stock'
                      : 'In Stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
