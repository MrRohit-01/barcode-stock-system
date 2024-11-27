import { useZxing } from "react-zxing";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const BarcodeScanner = ({ onBarcodeDetected, onClose }) => {
  const [result, setResult] = useState("");
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log("Scanner mounted");
    return () => console.log("Scanner unmounted");
  }, []);

  // Check for camera permissions
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        console.log("Requesting camera permissions...");
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
        console.log("Camera permission granted");
        setHasPermission(true);
        // Don't stop the stream immediately
        return () => {
          stream.getTracks().forEach(track => track.stop());
        };
      } catch (err) {
        console.error("Camera permission error:", err);
        setError("Camera permission denied or not available");
        setHasPermission(false);
      }
    };

    const cleanup = checkPermissions();
    return () => cleanup.then(cleanupFn => cleanupFn?.());
  }, []);

  const { ref } = useZxing({
    onDecodeResult(result) {
      console.log("Barcode detected:", result.getText());
      const barcodeValue = result.getText();
      setResult(barcodeValue);
      setIsScanning(false);
      onBarcodeDetected(barcodeValue);
      toast.success('Barcode scanned successfully!');
    },
    onError(error) {
      console.error("Scanner error:", error);
      setError(error.message);
    },
    constraints: {
      video: {
        facingMode: "environment",
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 }
      }
    },
    timeBetweenDecodingAttempts: 500,
    tryHarder: true,
    formats: ["EAN_13", "EAN_8", "CODE_128", "CODE_39", "UPC_A", "UPC_E", "QR_CODE"]
  });

  // Debug video element
  useEffect(() => {
    if (ref.current) {
      console.log("Video element ready");
      ref.current.onplay = () => console.log("Video stream started");
      ref.current.onerror = (e) => console.error("Video error:", e);
    }
  }, [ref]);

  const resetScanner = () => {
    console.log("Resetting scanner");
    setResult("");
    setIsScanning(true);
    setError(null);
  };

  if (!hasPermission) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-red-600">
          Camera access is required. Please enable camera permissions in your browser settings.
        </p>
        <button
          onClick={onClose}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Close Scanner
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-red-600">Error: {error}</p>
        <div className="mt-4 space-x-2">
          <button
            onClick={resetScanner}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Try Again
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Close Scanner
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Scan Barcode</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        {isScanning ? (
          <div className="relative">
            <video 
              ref={ref} 
              className="w-full rounded-lg shadow-lg"
              style={{ maxHeight: '70vh' }}
              autoPlay
              playsInline
              muted
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-48 h-48 border-2 border-red-500 rounded-lg">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500"></div>
              </div>
            </div>
            <p className="text-center mt-2 text-sm text-gray-600">
              Position the barcode within the frame
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="font-medium">Scanned Barcode:</p>
              <p className="text-lg">{result}</p>
            </div>
            
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
