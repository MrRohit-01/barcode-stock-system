import { useZxing } from "react-zxing";
import { useState } from "react";
import { toast } from "react-toastify";
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/api';

const BarcodeScanner = ({ onClose }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(true);

  const handleBarcodeScan = async (barcodeValue) => {
    if (!barcodeValue) {
      setIsScanning(true); // Continue scanning if no barcode
      return;
    }

    try {
      const response = await productService.getByBarcode(barcodeValue);
      
      // Close the scanner
      if (onClose) onClose();
      
      if (response.data) {
        // Product exists
        toast.success('Product found! Redirecting...', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        navigate(`/dashboard/products/${response.data._id}`, {
          state: { product: response.data }
        });
      }
    } catch (err) {
      console.error('API error:', err);
      
      // Check if it's a 404 error (product not found)
      if (err.response?.status === 404) {
        // Close the scanner
        if (onClose) onClose();
        
        toast.info('New product detected! Opening add form...', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        navigate('/dashboard/products/add', {
          state: { barcode: barcodeValue }
        });
      } else {
        // For other errors, continue scanning
        setIsScanning(true);
        toast.error('Error checking product. Please try again.', {
          position: "top-right",
          autoClose: 2000,
        });
      }
    }
  };

  const { ref } = useZxing({
    onDecodeResult(result) {
      if (isScanning) {
        const barcodeValue = result.getText();
        handleBarcodeScan(barcodeValue);
      }
    },
    onError(error) {
      // Only log NotFoundException, don't show to user
      if (error.name !== 'NotFoundException') {
        console.error("Scanner error:", error);
      }
      // Continue scanning regardless of error
      setIsScanning(true);
    },
    constraints: {
      video: {
        facingMode: "environment",
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 }
      }
    },
    timeBetweenDecodingAttempts: 300,
    formats: ["EAN_13", "EAN_8", "CODE_128", "CODE_39", "UPC_A", "UPC_E"],
    tryHarder: true
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-xl mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Scan Barcode</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>

        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={ref}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-32 border-2 border-red-500 rounded-lg">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500"></div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="mt-4 space-y-2">
          <p className="text-center text-sm text-gray-600">
            Position the barcode within the frame
          </p>
          <ul className="text-xs text-gray-500 list-disc pl-4">
            <li>Hold the barcode steady</li>
            <li>Ensure good lighting</li>
            <li>Avoid glare or reflections</li>
            <li>Try different distances (6-12 inches works best)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

BarcodeScanner.propTypes = {
  onClose: PropTypes.func,
};

export default BarcodeScanner;
