import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Barcode from 'react-barcode';
import { productService } from '../../services/api';
import BarcodeScanner from '../../components/scanner/BarcodeScanner';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    barcode: location.state?.barcode || '',
    category: '',
    brand: '',
    price: {
      cost: '',
      retail: '',
      wholesale: ''
    },
    stock: {
      quantity: '',
      minQuantity: ''
    }
  });
  const [showBarcode, setShowBarcode] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const barcodeRef = useRef();
  const [categories] = useState([
    'Electronics',
    'Clothing',
    'Food & Beverages',
    'Books',
    'Home & Kitchen',
    'Sports & Outdoors',
    'Beauty & Personal Care',
    'Toys & Games',
    'Automotive',
    'Health & Wellness',
    'Office Supplies',
    'Pet Supplies',
    'Tools & Home Improvement',
    'Baby Products',
    'Jewelry',
    'Arts & Crafts'
  ]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else if (name === 'quantity') {
      setFormData(prev => ({
        ...prev,
        stock: {
          ...prev.stock,
          quantity: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.barcode) {
        toast.error('Please generate or scan a barcode first');
        return;
      }

      // Validate required fields
      const requiredFields = ['name', 'sku', 'category', 'price.cost', 'price.retail', 'stock.quantity'];
      const missingFields = requiredFields.filter(field => {
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          return !formData[parent][child];
        }
        return !formData[field];
      });

      if (missingFields.length > 0) {
        toast.error('Please fill in all required fields');
        return;
      }

      const formattedData = {
        name: formData.name,
        description: formData.description,
        sku: formData.sku,
        barcode: formData.barcode,
        category: formData.category,
        brand: formData.brand,
        price: {
          cost: Number(formData.price.cost),
          retail: Number(formData.price.retail),
          wholesale: Number(formData.price.wholesale) || 0
        },
        stockQuantity: Number(formData.stock.quantity),
        minStockLevel: Number(formData.stock.minQuantity) || 0
      };

      console.log('Sending data:', formattedData);
      const response = await productService.create(formattedData);
      
      if (response && response.status === 201) {
        toast.success('Product added successfully');
        setTimeout(() => {
          navigate('/dashboard/products');
        }, 1000);
      }
    } catch (error) {
      console.error('Submit error:', error);
      
      if (error.response) {
        const errorMessage = error.response.data.message || 'Error adding product';
        toast.error(errorMessage);
        
        if (errorMessage.includes('barcode already exists')) {
          setFormData(prev => ({
            ...prev,
            barcode: ''
          }));
          setShowBarcode(false);
        }
        
        if (errorMessage.includes('SKU already exists')) {
          setFormData(prev => ({
            ...prev,
            sku: ''
          }));
        }
      } else if (error.request) {
        toast.error('Network error. Please try again.');
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  const generateBarcode = () => {
    let code = '';
    for(let i = 0; i < 12; i++) {
      code += Math.floor(Math.random() * 10);
    }
    
    setFormData(prev => ({
      ...prev,
      barcode: code
    }));
    setShowBarcode(true);
  };

  const generateSKU = async () => {
    try {
      let isUnique = false;
      let newSKU = '';
      
      while (!isUnique) {
        const prefix = 'PRD';
        const numbers = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
        newSKU = `${prefix}-${numbers}`;
        
        // Check if SKU exists
        try {
          await productService.checkSKU(newSKU);
          isUnique = true;
        } catch (error) {
          // If 404, SKU is unique. If other error, keep trying
          if (error.response?.status === 404) {
            isUnique = true;
          }
        }
      }
      
      setFormData(prev => ({
        ...prev,
        sku: newSKU
      }));
    } catch (error) {
      toast.error('Error generating SKU');
    }
  };

  const printBarcode = () => {
    const printWindow = window.open('', '', 'width=800,height=400');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcode - ${formData.name || 'Product'}</title>
          <style>
            @page { 
              size: 58mm 40mm;
              margin: 0;
            }
            body { 
              margin: 0;
              padding: 8px;
              font-family: Arial, sans-serif;
            }
            .label {
              text-align: center;
              page-break-after: always;
            }
            .product-name {
              font-size: 12px;
              font-weight: bold;
              margin-bottom: 4px;
            }
            .product-price {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 4px;
            }
            .product-sku {
              font-size: 10px;
              color: #666;
              margin-bottom: 4px;
            }
            .barcode-container {
              margin-top: 4px;
            }
            @media print {
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="label">
            <div class="product-name">${formData.name || 'Product'}</div>
            <div class="product-price">$${formData.price || '0.00'}</div>
            <div class="product-sku">SKU: ${formData.sku || ''}</div>
            <div class="barcode-container">
              ${barcodeRef.current.innerHTML}
            </div>
          </div>
          <div class="no-print" style="margin-top: 20px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #4F46E5; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Print Label
            </button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleBarcodeDetected = (barcode) => {
    setFormData(prev => ({
      ...prev,
      barcode
    }));
    setShowScanner(false);
    toast.success('Barcode added successfully!');
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    handleChange(e);
    
    const filtered = categories.filter(category =>
      category.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCategories(filtered);
    setShowCategoryDropdown(true);
  };

  const handleCategorySelect = (category) => {
    setFormData(prev => ({
      ...prev,
      category
    }));
    setShowCategoryDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.category-container')) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKU *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter SKU"
              />
              <button
                type="button"
                onClick={generateSKU}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex-shrink-0"
              >
                Generate
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Format: ABC-12345
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Barcode *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter barcode"
              />
              <button
                type="button"
                onClick={generateBarcode}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex-shrink-0 whitespace-nowrap"
              >
                Generate Barcode
              </button>
              <button
                type="button"
                onClick={() => setShowScanner(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Scan Barcode
              </button>
            </div>
          </div>

          {showScanner && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg w-full max-w-xl mx-4">
                <BarcodeScanner
                  onBarcodeDetected={handleBarcodeDetected}
                  onClose={() => setShowScanner(false)}
                />
              </div>
            </div>
          )}

          <div className="relative category-container">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleCategoryChange}
              onFocus={() => setShowCategoryDropdown(true)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="Search or enter category"
              autoComplete="off"
            />
            {showCategoryDropdown && filteredCategories.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredCategories.map((category, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter brand"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost Price *
              </label>
              <input
                type="number"
                name="price.cost"
                value={formData.price.cost}
                onChange={handleChange}
                required
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter cost price"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Retail Price *
              </label>
              <input
                type="number"
                name="price.retail"
                value={formData.price.retail}
                onChange={handleChange}
                required
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter retail price"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                name="stock.quantity"
                value={formData.stock.quantity}
                onChange={handleChange}
                required
                min="0"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter quantity"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Quantity
              </label>
              <input
                type="number"
                name="stock.minQuantity"
                value={formData.stock.minQuantity}
                onChange={handleChange}
                min="0"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter minimum quantity"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter product description"
          />
        </div>

        {showBarcode && formData.barcode && (
          <div className="mt-4 p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Generated Barcode</h3>
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={printBarcode}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 inline-flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                  </svg>
                  Print Label
                </button>
              </div>
            </div>
            <div ref={barcodeRef} className="flex justify-center">
              <Barcode 
                value={formData.barcode}
                format="EAN13"
                width={1.5}
                height={50}
                fontSize={14}
                displayValue={true}
                margin={10}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/products')}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 inline-flex items-center gap-2"
          >
            <ClipboardDocumentListIcon className="w-5 h-5" />
            View Products
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/products')}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
