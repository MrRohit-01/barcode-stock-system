import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Paper, Table, Text, Group } from '@mantine/core';
import { billingAPI } from '../../services/api';

const Invoice = () => {
  const { id } = useParams();
  const { data: transaction, isLoading } = useQuery({
    queryKey: ['transaction', id],
    queryFn: () => billingAPI.getTransaction(id),
  });

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <Paper p="md" className="invoice-container">
      <div className="invoice-header">
        <Text size="xl" weight={700}>Invoice</Text>
        <Text>Transaction ID: {transaction.transactionId}</Text>
        <Text>Date: {new Date(transaction.createdAt).toLocaleString()}</Text>
        <Text>Cashier: {transaction.cashier.username}</Text>
      </div>

      <Table mt="md">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {transaction.items.map((item, index) => (
            <tr key={index}>
              <td>{item.product.name}</td>
              <td>{item.quantity}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>${(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Group position="right" mt="md">
        <Text size="lg" weight={500}>
          Total Amount: ${transaction.total.toFixed(2)}
        </Text>
      </Group>

      <Text mt="xl" size="sm" color="dimmed">
        Payment Method: {transaction.paymentMethod}
      </Text>
    </Paper>
  );
};

export default Invoice; 