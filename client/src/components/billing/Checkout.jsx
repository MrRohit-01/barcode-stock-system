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
  Modal
} from '@mantine/core';
import { IconTrash, IconPlus, IconBarcode, IconSearch } from '@tabler/icons-react';
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
        setScannerOpen(false);
      }
    } catch (error) {
      toast.error('Product not found');
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

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    try {
      setLoading(true);
      const transaction = {
        customer: customerInfo,
        items: items.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price.retail
        })),
        total: total
      };

      const response = await billingService.createTransaction(transaction);
      toast.success('Transaction completed successfully');
      // Navigate to invoice view
      navigate(`/dashboard/invoice/${response.data._id}`);
    } catch (error) {
      toast.error('Error processing transaction');
    } finally {
      setLoading(false);
    }
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
                <Button 
                  leftIcon={<IconBarcode size={20} />}
                  onClick={() => setScannerOpen(true)}
                >
                  Scan Barcode
                </Button>
                <Button 
                  leftIcon={<IconSearch size={20} />}
                  onClick={() => setSearchOpen(true)}
                >
                  Search Products
                </Button>
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
                    <td>${item.price.retail.toFixed(2)}</td>
                    <td>
                      <Group spacing={5}>
                        <NumberInput
                          value={item.quantity}
                          onChange={(value) => updateQuantity(index, value)}
                          min={1}
                          max={item.stock.quantity}
                          style={{ width: 80 }}
                        />
                        <Badge color={item.quantity <= item.stock.quantity ? 'green' : 'red'}>
                          Stock: {item.stock.quantity}
                        </Badge>
                      </Group>
                    </td>
                    <td>${(item.price.retail * item.quantity).toFixed(2)}</td>
                    <td>
                      <ActionIcon color="red" onClick={() => removeItem(index)}>
                        <IconTrash size={20} />
                      </ActionIcon>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Group position="right" mt="md">
              <Text size="xl" weight={700}>
                Total: ${total.toFixed(2)}
              </Text>
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

      {/* Barcode Scanner Modal */}
      <Modal
        opened={isScannerOpen}
        onClose={() => setScannerOpen(false)}
        title="Scan Barcode"
        size="xl"
      >
        <BarcodeScanner 
          onClose={() => setScannerOpen(false)}
          onScan={handleBarcodeScanned}
        />
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