import { useState, useEffect } from 'react';
import { 
  Table, 
  TextInput, 
  Group, 
  Text, 
  Badge,
  Card,
  Button 
} from '@mantine/core';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Failed to load products');
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.barcode.includes(search)
  );

  const getStockStatus = (quantity) => {
    if (quantity <= 0) return { color: 'red', label: 'Out of Stock' };
    if (quantity < 10) return { color: 'yellow', label: 'Low Stock' };
    return { color: 'green', label: 'In Stock' };
  };

  if (loading) return <Text>Loading...</Text>;

  return (
    <Card shadow="sm" p="lg">
      <Group position="apart" mb="md">
        <Text size="xl" weight={700}>Products</Text>
        <Button onClick={() => navigate('/dashboard/scan')}>
          Scan Product
        </Button>
      </Group>

      <TextInput
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        mb="md"
      />

      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Barcode</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => {
            const status = getStockStatus(product.quantity);
            return (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.barcode}</td>
                <td>${product.price}</td>
                <td>{product.quantity}</td>
                <td>
                  <Badge color={status.color}>
                    {status.label}
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Card>
  );
};

export default ProductList; 