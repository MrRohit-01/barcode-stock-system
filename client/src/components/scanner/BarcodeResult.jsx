import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { productService } from '../../services/api';
import { toast } from 'react-hot-toast';

const BarcodeResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const barcode = location.state?.barcode;

  useEffect(() => {
    const checkBarcode = async () => {
      if (!barcode) {
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
          toast.info('Product not found. Add a new product.');
          navigate('/dashboard/products/add', { 
            state: { barcode: barcode }
          });
        } else {
          toast.error('Error checking barcode');
          navigate('/dashboard/products');
        }
      }
    };

    checkBarcode();
  }, [barcode, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
};

export default BarcodeResult;