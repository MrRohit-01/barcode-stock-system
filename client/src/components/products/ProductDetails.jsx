import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../stores/authStore';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || id === 'undefined' || !token) {
      return;
    }
    fetchProductDetails();
  }, [id, token]);

  const fetchProductDetails = async () => {
    try {
      if (!id || id.trim() === '') {
        toast.error('Invalid product ID');
        navigate('/dashboard/products');
        return;
      }
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product details', error);
      navigate('/dashboard/products');
    }
  };

  if (loading || !product) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Details</h2>
        <button
          onClick={() => navigate('/dashboard/products')}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Back to Products
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Info Card */}
        <div className="col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start gap-6">
            {product.image ? (
              <img
                src={`http://localhost:5000${product.image}`}
                alt={product.name}
                className="w-32 h-32 object-cover rounded-lg"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                No Image
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">SKU</p>
                  <p className="font-medium">{product.sku}</p>
                </div>
                <div>
                  <p className="text-gray-600">Category</p>
                  <p className="font-medium">{product.category}</p>
                </div>
                <div>
                  <p className="text-gray-600">Price</p>
                  <p className="font-medium">${product.price}</p>
                </div>
                <div>
                  <p className="text-gray-600">Stock</p>
                  <p className={`font-medium ${
                    product.stockQuantity <= product.minStockLevel
                      ? 'text-red-600'
                      : 'text-green-600'
                  }`}>
                    {product.stockQuantity} units
                  </p>
                </div>
              </div>
              <p className="mt-4 text-gray-600">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
