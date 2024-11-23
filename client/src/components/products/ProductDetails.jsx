import { useState } from 'react';
import { TextField, Button, Paper, Box } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

const ProductDetails = () => {
  const [product, setProduct] = useState({
    name: '',
    barcode: '',
    price: '',
    quantity: '',
    category: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/products', product);
      console.log(response);
      toast.success('Product added successfully!');
      setProduct({
        name: '',
        barcode: '',
        price: '',
        quantity: '',
        category: ''
      }); // Reset form
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(error.response?.data?.message || 'Error adding product');
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            name="name"
            label="Product Name"
            value={product.name}
            onChange={handleChange}
            required
          />
          <TextField
            name="barcode"
            label="Barcode"
            value={product.barcode}
            onChange={handleChange}
            required
          />
          <TextField
            name="price"
            label="Price"
            type="number"
            value={product.price}
            onChange={handleChange}
            required
          />
          <TextField
            name="quantity"
            label="Initial Quantity"
            type="number"
            value={product.quantity}
            onChange={handleChange}
            required
          />
          <TextField
            name="category"
            label="Category"
            value={product.category}
            onChange={handleChange}
          />
          <Button variant="contained" type="submit">
            Save Product
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default ProductDetails;
