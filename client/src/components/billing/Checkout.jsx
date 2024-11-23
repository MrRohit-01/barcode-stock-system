import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Button, 
  Group, 
  Stack, 
  Text, 
  Select 
} from '@mantine/core';
import { useCartStore } from '../../stores/cartStore';
import { billingAPI } from '../../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      const transaction = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total: getTotal(),
        paymentMethod,
        date: new Date()
      };

      await billingAPI.createTransaction(transaction);
      clearCart();
      navigate('/dashboard/scan');
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card shadow="sm" p="lg">
      <Stack spacing="xl">
        <Text size="xl" weight={700}>Order Summary</Text>
        
        {items.map((item) => (
          <Group key={item.id} position="apart">
            <Text>
              {item.name} x {item.quantity}
            </Text>
            <Text>${(item.price * item.quantity).toFixed(2)}</Text>
          </Group>
        ))}

        <Card withBorder p="md">
          <Group position="apart">
            <Text weight={700}>Total Amount</Text>
            <Text weight={700} size="xl">${getTotal().toFixed(2)}</Text>
          </Group>
        </Card>

        <Select
          label="Payment Method"
          value={paymentMethod}
          onChange={setPaymentMethod}
          data={[
            { value: 'cash', label: 'Cash' },
            { value: 'card', label: 'Card' }
          ]}
        />

        <Group position="apart">
          <Button variant="outline" onClick={() => navigate('/dashboard/cart')}>
            Back to Cart
          </Button>
          <Button 
            color="green" 
            onClick={handleComplete}
            loading={loading}
          >
            Complete Transaction
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};

export default Checkout; 