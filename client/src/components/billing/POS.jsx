import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  TextInput, 
  NumberInput, 
  Button, 
  Paper, 
  Grid, 
  Table, 
  Text, 
  Group,
  ActionIcon,
  Badge,
  Modal,
  Select
} from '@mantine/core';
import { 
  TrashIcon, 
  PlusIcon, 
  QrCodeIcon, 
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';
import { productService, billingService } from '../../services/api';
import BarcodeScanner from '../scanner/BarcodeScanner';
import ProductSearch from './ProductSearch';
import { Button as MantineButton } from '@mantine/core';

const Checkout = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [isScannerOpen, setScannerOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');

  // Calculate total whenever items change
  useEffect(() => {
    const newTotal = items.reduce((sum, item) => {
      return sum + (item.price.retail * item.quantity);
    }, 0);
    setTotal(newTotal);
  }, [items]);

  const handleProductAdd = async (product) => {
    // Check if item already exists in cart
    const existingItemIndex = items.findIndex(item => item._id === product._id);
    
    if (existingItemIndex > -1) {
      // Update quantity if item exists
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += 1;
      setItems(updatedItems);
    } else {
      // Add new item
      setItems([...items, { ...product, quantity: 1 }]);
    }
    
    toast.success('Product added to cart');
  };

  const handleBarcodeScanned = async (barcodeValue) => {
    try {
      setLoading(true);
      const response = await productService.getByBarcode(barcodeValue);
      if (response.data) {
        handleProductAdd(response.data);
        toast.success('Product added to cart');
      } else {
        toast.error('Product not found');
      }
    } catch (error) {
      console.error('Error scanning barcode:', error);
      toast.error('Failed to find product');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedItems = [...items];
    if (newQuantity <= updatedItems[index].stockQuantity) {
      updatedItems[index].quantity = newQuantity;
      setItems(updatedItems);
    } else {
      toast.error('Quantity exceeds available stock');
    }
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const getSubtotal = () => {
    return items.reduce((sum, item) => {
      return sum + (item.price.retail * item.quantity);
    }, 0);
  };

  const getTax = () => {
    const subtotal = getSubtotal();
    return subtotal * 0.18; // 18% GST
  };

  const handleCheckout = async () => {
    try {
      if (items.length === 0) {
        toast.error('Cart is empty');
        return;
      }

      setLoading(true);
      console.log('Starting checkout process...');

      const transactionData = {
        items: items.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price.retail,
          name: item.name,
          sku: item.sku
        })),
        customerInfo: {
          name: customerInfo.name || 'Walk-in Customer',
          phone: customerInfo.phone || '+9999999999',
          email: customerInfo.email || 'anonymous@gmail.com'
        },
        paymentMethod,
        total: getSubtotal() + getTax(),
        subtotal: getSubtotal(),
        tax: getTax()
      };

      console.log('Transaction data:', transactionData);
      const response = await billingService.createTransaction(transactionData);
      console.log('Transaction response:', response);

      if (response.data) {
        toast.success('Transaction completed successfully');
        navigate('/dashboard/transactions');
        clearCart();
      }
    } catch (error) {
      console.error('Full checkout error:', error);
      console.error('Error response:', error.response);
      toast.error(error.response?.data?.message || 'Error processing transaction');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setItems([]);
    setTotal(0);
    setCustomerInfo({
      name: '',
      phone: '',
      email: ''
    });
    setPaymentMethod('cash');
  };

  return (
    <div className="p-4">
      <Grid>
        {/* Left Side - Cart */}
        <Grid.Col span={8}>
          <Paper shadow="xs" p="md">
            <Group mb="md" position="apart">
              <Text size="xl" weight={700}>Billing</Text>
              <Group>
                <MantineButton 
                  leftSection={<QrCodeIcon className="h-5 w-5" />}
                  onClick={() => setScannerOpen(true)}
                >
                  Scan Barcode
                </MantineButton>
                <MantineButton 
                  leftSection={<MagnifyingGlassIcon className="h-5 w-5" />}
                  onClick={() => setSearchOpen(true)}
                >
                  Search Products
                </MantineButton>
              </Group>
            </Group>

            <Table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>₹{item.price.retail.toFixed(2)}</td>
                    <td>
                      <Group spacing={5}>
                        <NumberInput
                          value={item.quantity}
                          onChange={(value) => updateQuantity(index, value)}
                          min={1}
                          max={item.stockQuantity}
                          style={{ width: 80 }}
                        />
                        <Badge color={item.quantity <= item.stockQuantity ? 'green' : 'red'}>
                          Stock: {item.stockQuantity}
                        </Badge>
                      </Group>
                    </td>
                    <td>₹{(item.price.retail * item.quantity).toFixed(2)}</td>
                    <td>
                      <ActionIcon color="red" onClick={() => removeItem(index)}>
                        <TrashIcon className="h-5 w-5" />
                      </ActionIcon>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Group position="right" mt="md" spacing="xl">
              <div>
                <Text size="sm" color="dimmed">Subtotal:</Text>
                <Text size="lg">₹{getSubtotal().toFixed(2)}</Text>
              </div>
              <div>
                <Text size="sm" color="dimmed">Tax (18%):</Text>
                <Text size="lg">₹{getTax().toFixed(2)}</Text>
              </div>
              <div>
                <Text size="sm" color="dimmed">Total:</Text>
                <Text size="xl" weight={700}>₹{(getSubtotal() + getTax()).toFixed(2)}</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>

        {/* Right Side - Customer Info */}
        <Grid.Col span={4}>
          <Paper shadow="xs" p="md">
            <Text size="lg" weight={500} mb="md">
              Customer Information
            </Text>

            <TextInput
              label="Name"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
              mb="sm"
            />

            <TextInput
              label="Phone"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
              mb="sm"
            />

            <TextInput
              label="Email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
              mb="lg"
            />

            <Select
              label="Payment Method"
              value={paymentMethod}
              onChange={(value) => setPaymentMethod(value)}
              data={[
                { value: 'cash', label: 'Cash' },
                { value: 'card', label: 'Card' },
                { value: 'upi', label: 'UPI' }
              ]}
              mb="lg"
            />

            <Button
              fullWidth
              size="lg"
              onClick={handleCheckout}
              loading={loading}
              disabled={items.length === 0}
            >
              Complete Transaction
            </Button>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Updated Barcode Scanner Modal */}
      <Modal
        opened={isScannerOpen}
        onClose={() => setScannerOpen(false)}
        title="Scan Barcode"
        size="xl"
        styles={{
          title: {
            fontSize: '1.2rem',
            fontWeight: 600
          },
          body: {
            padding: '1rem'
          }
        }}
      >
        <div className="flex flex-col items-center">
          <div className="w-full w-2xl aspect-video mb-4">
            <BarcodeScanner 
              onClose={() => setScannerOpen(false)}
              onScan={handleBarcodeScanned}
            />
          </div>
          <Text color="dimmed" size="sm" align="center">
            Position the barcode in front of your camera
          </Text>
        </div>
      </Modal>

      {/* Product Search Modal */}
      <Modal
        opened={isSearchOpen}
        onClose={() => setSearchOpen(false)}
        title="Search Products"
        size="xl"
      >
        <ProductSearch 
          onProductSelect={(product) => {
            handleProductAdd(product);
            setSearchOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default Checkout;