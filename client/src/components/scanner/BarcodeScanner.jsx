import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { Box, Text, Button, Group } from '@mantine/core';
import { productAPI } from '../../services/api';
import { useCartStore } from '../../stores/cartStore';
import { scannerService } from '../../services/scannerService';

const BarcodeScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { addItem } = useCartStore();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'reader',
      scannerService.getDefaultScannerConfig(),
      false
    );

    async function handleScan(decodedText) {
      try {
        const product = await productAPI.getByBarcode(decodedText);
        addItem(product);
        navigate('/dashboard/cart');
      } catch (err) {
        setError('Product not found');
      }
    }

    scanner.render(handleScan, (err) => console.warn(err));

    return () => scanner.clear();
  }, [navigate, addItem]);

  const handleManualEntry = async () => {
    const code = window.prompt('Enter barcode manually:');
    if (code) {
      try {
        const product = await productAPI.getByBarcode(code);
        addItem(product);
        navigate('/dashboard/cart');
      } catch (err) {
        setError('Product not found');
      }
    }
  };

  return (
    <Box p="md">
      <Group position="apart" mb="lg">
        <Text size="xl" weight={700}>
          Scan Product
        </Text>
        <Button onClick={() => navigate('/dashboard/cart')}>
          View Cart
        </Button>
      </Group>

      {error && (
        <Text color="red" mb="md">
          {error}
        </Text>
      )}

      <div id="reader"></div>

      <Button 
        onClick={handleManualEntry}
        mt="md"
        variant="outline"
      >
        Enter Barcode Manually
      </Button>
    </Box>
  );
};

export default BarcodeScanner;
