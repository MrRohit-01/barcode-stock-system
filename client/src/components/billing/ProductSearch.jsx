import { useState, useEffect } from 'react';
import { TextInput, Table, Group, Text, Badge, Loader } from '@mantine/core';
import { productService } from '../../services/api';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const ProductSearch = ({ onProductSelect }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll();
      const validProducts = response.data.map(product => ({
        ...product,
        price: {
          retail: product.price?.retail || 0,
          wholesale: product.price?.wholesale || 0
        },
        stockQuantity: product.stockQuantity || 0,
        minStockLevel: product.minStockLevel || 0
      }));
      setProducts(validProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode?.includes(searchTerm)
  );

  if (loading) {
    return <Loader size="xl" className="mx-auto my-8" />;
  }

  return (
    <div>
      <TextInput
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb="md"
      />

      {products.length === 0 ? (
        <Text align="center" color="dimmed">No products found</Text>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr
                key={product._id}
                onClick={() => onProductSelect(product)}
                style={{ cursor: 'pointer' }}
                className="hover:bg-gray-50"
              >
                <td>{product.name || 'N/A'}</td>
                <td>{product.sku || 'N/A'}</td>
                <td>₹{(product.price?.retail || 0).toFixed(2)}</td>
                <td>
                  <Group spacing={5}>
                    <Text>{product.stockQuantity || 0}</Text>
                    {product.stockQuantity <= (product.minStockLevel || 0) && (
                      <Badge color="red">Low</Badge>
                    )}
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

ProductSearch.propTypes = {
  onProductSelect: PropTypes.func.isRequired
};

export default ProductSearch;