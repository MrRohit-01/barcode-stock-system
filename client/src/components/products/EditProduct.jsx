import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../stores/authStore';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({
    name: '',
    sku: '',
    price: '',
    category: '',
    description: '',
    stockQuantity: '',
    minStockLevel: '',
    image: null
  });

  const categories = [
    'Electronics',
    'Clothing',
    'Food',
    'Beverages',
    'Household',
    'Furniture',
    'Automotive',
    'Beauty',
    'Health',
    'Sports',
    'Toys',
    'Other'
  ];

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_URL}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const productData = response.data;
      setProduct(productData);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching product');
      navigate('/dashboard/products');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setProduct(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      Object.keys(product).forEach(key => {
        if (product[key] !== null && key !== 'image') {
          formData.append(key, product[key]);
        }
      });

      if (product.image instanceof File) {
        formData.append('image', product.image);
      }

      await axios.put(
        `${import.meta.env.VITE_APP_URL}/products/${id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast.success('Product updated successfully!');
      navigate('/dashboard/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating product');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Edit Product</h2>
        <button
          onClick={() => navigate('/dashboard/products')}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Back to Products
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* SKU - Read Only */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKU
            </label>
            <input
              type="text"
              value={product.sku}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity
            </label>
            <input
              type="number"
              name="stockQuantity"
              value={product.stockQuantity}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Min Stock Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Stock Level
            </label>
            <input
              type="number"
              name="minStockLevel"
              value={product.minStockLevel}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Current Image Preview */}
        {product.image && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Image
            </label>
            <img
              src={`${import.meta.env.VITE_APP_URL}${product.image}`}
              alt={product.name}
              className="h-32 w-32 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Update Image
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Update Product
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/products')}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
