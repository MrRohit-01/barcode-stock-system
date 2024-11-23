import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Barcode from 'react-barcode';
import { productService } from '../../services/api';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    barcode: '',
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
  const barcodeRef = useRef();

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
      // Convert string values to numbers for price and stock
      const formattedData = {
        ...formData,
        price: {
          cost: Number(formData.price.cost),
          retail: Number(formData.price.retail),
          wholesale: Number(formData.price.wholesale) || 0
        },
        stock: {
          quantity: Number(formData.stock.quantity),
          minQuantity: Number(formData.stock.minQuantity) || 0
        }
      };

      console.log('Submitting formatted data:', formattedData); // Debug log
      
      const response = await productService.create(formattedData);
      console.log('Response:', response); // Debug log
      
      toast.success('Product added successfully');
      navigate('/dashboard/products');
    } catch (error) {
      console.error('Error details:', error.response?.data || error); // More detailed error
      toast.error(error.response?.data?.message || 'Error adding product');
    }
  };

  // Optimized barcode generation
  const generateBarcode = () => {
    // Generate 12 digits (EAN-13 format without check digit)
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

  // Optimized SKU generation
  const generateSKU = () => {
    const prefix = 'PRD'; // Fixed prefix for better readability
    const numbers = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
    const newSKU = `${prefix}-${numbers}`;
    
    setFormData(prev => ({
      ...prev,
      sku: newSKU
    }));
  };

  // Print Barcode function
  const printBarcode = () => {
    const printWindow = window.open('', '', 'width=800,height=400');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcode - ${formData.name || 'Product'}</title>
          <style>
            @page { 
              size: 58mm 40mm; /* Standard label size */
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
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter category"
            />
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
