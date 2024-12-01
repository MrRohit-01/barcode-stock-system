import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../stores/authStore';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  const categories = [
    'Electronics',
    'Clothing',
    'Food',
    'Beverages',
    'Household',
    'Other',
  ];

  // Fetch products function
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data);
    } catch (error) {
      toast.error('Error fetching products');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm);

    const matchesCategory =
      selectedCategory === '' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Handle delete product
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Error deleting product');
      }
    }
  };

  // Handle product click
  const handleProductClick = (product) => {
    navigate(`/dashboard/products/${product._id}`, {
      state: { product }
    });
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products</h2>
        <Link
          to="/dashboard/products/add"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add New Product
        </Link>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Image</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">SKU</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Barcode</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Category</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Price</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Stock</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr 
                key={product._id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                <td className="px-6 py-4">
                  {product.image ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}${product.image}`}
                      alt={product.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                      No img
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.sku}</td>
                <td className="px-6 py-4">{product.barcode}</td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">
                      Cost: ₹
                      {product.price?.cost ? product.price.cost.toFixed(2) : '0.00'}
                    </span>
                    <span className="text-sm text-gray-900">
                      Retail: ₹
                      {product.price?.retail ? product.price.retail.toFixed(2) : '0.00'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      product.stockQuantity <= product.minStockLevel
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {product.stockQuantity}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/dashboard/products/edit/${product._id}`)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
