import { useZxing } from "react-zxing";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const BarcodeScanner = ({ onClose }) => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(true);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    // Request camera permission
    navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: "environment" } 
    })
    .then(() => {
      setHasPermission(true);
      toast.info("Camera activated. Ready to scan.");
    })
    .catch((err) => {
      console.error("Camera permission error:", err);
      setHasPermission(false);
      toast.error("Camera access denied. Please enable camera permissions.");
    });

    return () => setIsScanning(false);
  }, []);

  const handleBarcodeScan = (barcodeValue) => {
    if (!barcodeValue || !isScanning) {
      setIsScanning(true);
      return;
    }

    console.log("Scanned barcode:", barcodeValue); // Debug log
    if (onClose) onClose();
    
    navigate('/dashboard/scan-result', { 
      state: { barcode: barcodeValue }
    });
  };

  const { ref } = useZxing({
    onDecodeResult(result) {
      const barcodeValue = result.getText();
      console.log("Decode result:", barcodeValue); // Debug log
      handleBarcodeScan(barcodeValue);
    },
    onError(error) {
      if (error.name !== 'NotFoundException') {
        console.error("Scanner error:", error);
        toast.error("Scanner error. Please try again.");
      }
      setIsScanning(true);
    },
    constraints: {
      video: {
        facingMode: "environment",
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    },
    timeBetweenDecodingAttempts: 200, // Faster scanning attempts
    formats: ["EAN_13", "EAN_8", "CODE_128", "CODE_39", "UPC_A", "UPC_E"],
    tryHarder: true
  });

  if (hasPermission === false) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-4">
          <p className="text-red-500">Camera permission is required to scan barcodes.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry Camera Access
          </button>
        </div>
      </div>
    );
  }

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
