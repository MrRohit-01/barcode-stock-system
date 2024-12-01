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
  Select,
  Divider,
  Card
} from '@mantine/core';
import { 
  TrashIcon, 
  QrCodeIcon, 
  MagnifyingGlassIcon,
  CreditCardIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import { productService, billingService } from '../../services/api';
import BarcodeScanner from '../scanner/BarcodeScanner';
import ProductSearch from './ProductSearch';

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
    <div className="p-4 min-h-screen bg-gray-50">
      <Grid gutter="md">
        {/* Left Side - Cart */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card shadow="sm" radius="md" className="h-full">
            {/* Header */}
            <Group position="apart" mb="md" className="border-b pb-4">
              <div>
                <Text size="xl" weight={700} className="text-gray-800">New Sale</Text>
                <Text size="sm" text="dimmed">Add items to cart</Text>
              </div>
              <Group>
                <Button 
                  leftIcon={<QrCodeIcon className="h-5 w-5" />}
                  onClick={() => setScannerOpen(true)}
                  variant="light"
                  color="blue"
                >
                  Scan Product
                </Button>
                <Button 
                  leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  onClick={() => setSearchOpen(true)}
                  variant="light"
                  color="gray"
                >
                  Search Products
                </Button>
              </Group>
            </Group>

            {/* Cart Items */}
            <div className="overflow-x-auto">
              <Table striped highlightOnHover>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th width="70">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <Text align="center" color="dimmed" py="xl">
                          Cart is empty. Add items to begin.
                        </Text>
                      </td>
                    </tr>
                  ) : (
                    items.map((item, index) => (
                      <tr key={item._id}>
                        <td>
                          <div>
                            <Text weight={500}>{item.name}</Text>
                            <Text size="sm" color="dimmed">SKU: {item.sku}</Text>
                          </div>
                        </td>
                        <td>₹{item.price.retail.toFixed(2)}</td>
                        <td>
                          <Group spacing={5}>
                            <NumberInput
                              value={item.quantity}
                              onChange={(value) => updateQuantity(index, value)}
                              min={1}
                              max={item.stockQuantity}
                              style={{ width: 80 }}
                              size="sm"
                            />
                            <Badge 
                              color={item.quantity <= item.stockQuantity ? 'green' : 'red'}
                              variant="light"
                            >
                              Stock: {item.stockQuantity}
                            </Badge>
                          </Group>
                        </td>
                        <td>₹{(item.price.retail * item.quantity).toFixed(2)}</td>
                        <td>
                          <ActionIcon 
                            color="red" 
                            onClick={() => removeItem(index)}
                            variant="light"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </ActionIcon>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>

            {/* Cart Summary */}
            <div className="mt-auto pt-4 border-t">
              <Group position="right" spacing="xl">
                <div>
                  <Text size="sm" color="dimmed">Subtotal</Text>
                  <Text size="lg" weight={500}>₹{getSubtotal().toFixed(2)}</Text>
                </div>
                <div>
                  <Text size="sm" color="dimmed">Tax (18%)</Text>
                  <Text size="lg" weight={500}>₹{getTax().toFixed(2)}</Text>
                </div>
                <div>
                  <Text size="sm" color="dimmed">Total</Text>
                  <Text size="xl" weight={700} color="blue">₹{(getSubtotal() + getTax()).toFixed(2)}</Text>
                </div>
              </Group>
            </div>
          </Card>
        </Grid.Col>

        {/* Right Side - Customer Info & Payment */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" radius="md">
            <Text size="lg" weight={600} mb="md" className="border-b pb-3">
              Customer Information
            </Text>

            <div className="space-y-4">
              <TextInput
                label="Name"
                placeholder="Walk-in Customer"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
              />

              <TextInput
                label="Phone"
                placeholder="+91 99999 99999"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
              />

              <TextInput
                label="Email"
                placeholder="customer@example.com"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
              />

              <Divider my="md" label="Payment Method" labelPosition="center" />

              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'cash', label: 'Cash', icon: BanknotesIcon },
                  { value: 'card', label: 'Card', icon: CreditCardIcon },
                  { value: 'upi', label: 'UPI', icon: DevicePhoneMobileIcon },
                ].map((method) => (
                  <button
                    key={method.value}
                    onClick={() => setPaymentMethod(method.value)}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      paymentMethod === method.value 
                        ? 'border-blue-500 bg-blue-50 text-blue-600' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <method.icon className="h-6 w-6 mx-auto mb-1" />
                    <Text size="sm">{method.label}</Text>
                  </button>
                ))}
              </div>

              <Button
                fullWidth
                size="lg"
                onClick={handleCheckout}
                loading={loading}
                disabled={items.length === 0}
                mt="xl"
              >
                Complete Sale
              </Button>
            </div>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Modals */}
      
        {isScannerOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-transparent rounded-lg w-[600px]">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">Scan Barcode</h2>
                <button 
                  onClick={() => {
                    setScannerOpen(false);
                    // Stop camera when closing
                    if (typeof window !== 'undefined') {
                      const videoElement = document.querySelector('video');
                      if (videoElement && videoElement.srcObject) {
                        videoElement.srcObject.getTracks().forEach(track => track.stop());
                      }
                    }
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <BarcodeScanner 
                onClose={() => setScannerOpen(false)}
                onScan={handleBarcodeScanned}
                style={{
                  width: '100%',
                  backgroundColor: '#f8f9fa'
                }}
              />
            </div>
          </div>
        )}

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