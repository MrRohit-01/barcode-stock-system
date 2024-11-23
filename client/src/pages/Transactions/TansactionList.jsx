import React, { useState, useEffect } from 'react';
import { Table, Card, Text, Group, Badge, Button } from '@mantine/core';
import { billingService } from '../../services/api';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const response = await billingService.getTransactions();
      setTransactions(response.data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Text>Loading...</Text>;

  return (
    <Card shadow="sm" p="lg">
      <Group position="apart" mb="md">
        <Text size="xl" weight={700}>Transactions</Text>
      </Group>

      <Table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Transaction ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
              <td>{transaction._id}</td>
              <td>{transaction.customer?.name || 'Walk-in Customer'}</td>
              <td>
                <Badge>{transaction.items.length} items</Badge>
              </td>
              <td>${transaction.total.toFixed(2)}</td>
              <td>
                <Badge color="green">Completed</Badge>
              </td>
              <td>
                <Button size="xs" onClick={() => {
                  setSelectedTransaction(transaction);
                  setShowDetails(true);
                }}>
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};

export default TransactionList;