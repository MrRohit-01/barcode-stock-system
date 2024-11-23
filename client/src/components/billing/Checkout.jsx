import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
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
  Badge
} from '@mantine/core';
import { IconTrash, IconPlus } from '@tabler/icons-react';
import { productService, billingService } from '../../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
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

  const handleBarcodeSubmit = async (e) => {
    e.preventDefault();
    if (!barcode) return;

    try {
      setLoading(true);
      const product = await productService.getProductByBarcode(barcode);
      
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
      
      setBarcode('');
    } catch (error) {
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedItems = [...items];
    updatedItems[index].quantity = newQuantity;
    setItems(updatedItems);
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

      await billingService.createTransaction(transaction);
      toast.success('Transaction completed successfully');
      navigate('/dashboard/transactions');
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
            <form onSubmit={handleBarcodeSubmit} className="mb-4">
              <Group>
                <TextInput
                  placeholder="Scan barcode..."
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  style={{ flex: 1 }}
                />
                <Button 
                  type="submit" 
                  loading={loading}
                >
                  <IconPlus size={20} />
                </Button>
              </Group>
            </form>

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
    </div>
  );
};

export default Checkout;