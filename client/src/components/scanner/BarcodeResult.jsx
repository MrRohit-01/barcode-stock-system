import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { productService } from '../../services/api';
import { toast } from 'react-toastify';

const BarcodeResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const barcode = location.state?.barcode;

  useEffect(() => {
    const checkBarcode = async () => {
      if (!barcode) {
        toast.error('No barcode provided');
        navigate('/dashboard/products');
        return;
      }

      try {
        const response = await productService.getByBarcode(barcode);
        if (response.data) {
          toast.success('Product found!');
          navigate(`/dashboard/products/${response.data._id}`, {
            state: { product: response.data }
          });
        }
      } catch (error) {
        console.error('Error:', error);
        if (error.response?.status === 404) {
          toast.info('Product not found. Redirecting to add product...', {
            autoClose: 2000
          });
          setTimeout(() => {
            navigate('/dashboard/products/add', { 
              state: { barcode: barcode }
            });
          }, 2000);
        } else {
          toast.error('Error checking barcode. Please try again.');
          setTimeout(() => {
            navigate('/dashboard/scanner');
          }, 2000);
        }
      }
    };

    checkBarcode();
  }, [barcode, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p className="mt-4 text-gray-600">Processing barcode...</p>
    </div>
  );
};

export default BarcodeResult;