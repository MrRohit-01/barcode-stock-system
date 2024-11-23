import { useZxing } from "react-zxing";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuthStore } from "../../stores/authStore";

const BarcodeScanner = () => {
  const [result, setResult] = useState("");
  const [isScanning, setIsScanning] = useState(true);
  const [product, setProduct] = useState(null);
  const { token } = useAuthStore();

  const { ref } = useZxing({
    onDecodeResult(result) {
      setResult(result.getText());
      setIsScanning(false);
      handleBarcodeDetected(result.getText());
    },
  });

  const handleBarcodeDetected = async (barcode) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/products/barcode/${barcode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setProduct(response.data);
      toast.success(`Product found: ${response.data.name}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Product not found!");
      console.error("Error fetching product:", error);
    }
  };

  const resetScanner = () => {
    setResult("");
    setProduct(null);
    setIsScanning(true);
  };

  return (
    <div className="p-4">
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Barcode Scanner</h2>
        
        {isScanning ? (
          <div className="relative">
            <video ref={ref} className="w-full rounded-lg shadow-lg" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-48 h-48 border-2 border-red-500 rounded-lg"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="font-medium">Scanned Barcode:</p>
              <p className="text-lg">{result}</p>
            </div>
            
            {product && (
              <div className="p-4 bg-white shadow rounded-lg">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">SKU</p>
                    <p className="font-medium">{product.sku}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Price</p>
                    <p className="font-medium">${product.price}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Stock</p>
                    <p className="font-medium">{product.stockQuantity} units</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Category</p>
                    <p className="font-medium">{product.category}</p>
                  </div>
                </div>
                {product.description && (
                  <div className="mt-4">
                    <p className="text-gray-600">Description</p>
                    <p>{product.description}</p>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={resetScanner}
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Scan Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarcodeScanner;
