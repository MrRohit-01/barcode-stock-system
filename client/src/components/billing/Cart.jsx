
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  Button, 
  NumberInput, 
  Group, 
  Text, 
  Card 
} from '@mantine/core';
import { useCartStore } from '../../stores/cartStore';

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

  const handleCheckout = () => {
    navigate('/dashboard/checkout');
  };

  if (items.length === 0) {
    return (
      <Text size="lg" align="center" mt="xl">
        Cart is empty. Scan products to add them.
      </Text>
    );
  }

  return (
    <Card shadow="sm" p="lg">
      <Table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>${item.price}</td>
              <td>
                <NumberInput
                  value={item.quantity}
                  min={1}
                  max={item.stockQuantity}
                  onChange={(value) => updateQuantity(item.id, value)}
                  style={{ width: 100 }}
                />
              </td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
              <td>
                <Button 
                  color="red" 
                  onClick={() => removeItem(item.id)}
                  size="sm"
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Group position="apart" mt="xl">
        <Text size="xl" weight={700}>
          Total: ${getTotal().toFixed(2)}
        </Text>
        <Group>
          <Button variant="outline" onClick={clearCart} color="red">
            Clear Cart
          </Button>
          <Button onClick={handleCheckout} color="green">
            Checkout
          </Button>
        </Group>
      </Group>
    </Card>
  );
};

export default Cart; 