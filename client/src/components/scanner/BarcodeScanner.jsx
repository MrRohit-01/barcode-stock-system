import { useZxing } from "react-zxing";
import { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';

const BarcodeScanner = ({ onScan, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isPOS = location.pathname === '/dashboard/pos';
  const [lastScanned, setLastScanned] = useState('');
  const [scanTimeout, setScanTimeout] = useState(null);

  useEffect(() => {
    navigate(location.pathname, { replace: true, state: {} });
  }, [navigate, location.pathname]);

  const handleSuccessfulScan = useCallback((barcode) => {
    // Prevent duplicate scans within 2 seconds
    if (lastScanned === barcode) return;
    
    // Clear any existing timeout
    if (scanTimeout) clearTimeout(scanTimeout);
    
    setLastScanned(barcode);
    console.log("Scanned:", barcode);
    
    // Reset last scanned after 2 seconds
    const timeout = setTimeout(() => setLastScanned(''), 2000);
    setScanTimeout(timeout);

    if (isPOS) {
      onScan(barcode);
      if (onClose) onClose();
    } else {
      navigate('/dashboard/scan-result', { 
        state: { barcode }
      });
      toast.success('Barcode captured!');
    }
  }, [lastScanned, scanTimeout, isPOS, onScan, onClose, navigate]);

  const { ref } = useZxing({
    onDecodeResult(result) {
      handleSuccessfulScan(result.getText());
    },
    onError(error) {
      // Only log non-NotFound errors
      if (error.name !== 'NotFoundException') {
        console.error("Scanner error:", error);
      }
    },
    constraints: {
      video: {
        facingMode: "environment",
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 }
      }
    },
    timeBetweenDecodingAttempts: 150, // Faster scanning attempts
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
          />
          {/* Scanning guide overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-32 border-2 border-red-500 rounded-lg">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500"></div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          Position barcode within frame
        </div>
      </div>
    </div>
  );
};

BarcodeScanner.propTypes = {
  onScan: PropTypes.func,
  onClose: PropTypes.func,
};

export default BarcodeScanner;
