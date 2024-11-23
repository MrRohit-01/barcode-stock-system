import { useEffect, useState } from 'react';
import { 
  Table, 
  Card, 
  Text, 
  Group, 
  Badge,
  Stack 
} from '@mantine/core';
import { inventoryAPI } from '../../services/api';

const InventoryMovements = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMovements();
  }, []);

  const loadMovements = async () => {
    try {
      const response = await inventoryAPI.getMovements();
      setMovements(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text color="red">{error}</Text>;

  return (
    <Stack>
      <Group position="apart">
        <Text size="xl" weight={700}>Inventory Movements</Text>
      </Group>

      <Card>
        <Table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement) => (
              <tr key={movement.id}>
                <td>{new Date(movement.createdAt).toLocaleDateString()}</td>
                <td>{movement.product.name}</td>
                <td>
                  <Badge 
                    color={movement.type === 'IN' ? 'green' : 'red'}
                  >
                    {movement.type}
                  </Badge>
                </td>
                <td>{Math.abs(movement.quantity)}</td>
                <td>{movement.notes}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Stack>
  );
};

export default InventoryMovements;
