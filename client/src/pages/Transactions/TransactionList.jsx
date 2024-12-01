import React, { useState, useEffect, useCallback } from 'react';
import { Table, Card, Text, Group, Badge, Button, Modal } from '@mantine/core';
import { billingService } from '../../services/api';

function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const loadTransactions = useCallback(async () => {
    try {
      const response = await billingService.getAllTransactions();
      setTransactions(response.data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const TransactionDetailsModal = ({ transaction, opened, onClose }) => {
    if (!transaction) return null;
    
    return (
      <Modal
        opened={opened}
        onClose={onClose}
        title={`Transaction Details - ${transaction.transactionId}`}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <Text weight={500}>Customer Information</Text>
            <Text>Name: {transaction.customer?.name || 'Walk-in Customer'}</Text>
            <Text>Phone: {transaction.customer?.phone || '+91-9999999999'}</Text>
            <Text>Email: {transaction.customer?.email || 'anonymous@gmail.com'}</Text>
          </div>

          <div>
            <Text weight={500}>Items</Text>
            <Table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {transaction.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price.toFixed(2)}</td>
                    <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <Group position="apart">
            <div>
              <Text>Subtotal: ₹{transaction.subtotal.toFixed(2)}</Text>
              <Text>Tax: ₹{transaction.tax.toFixed(2)}</Text>
              <Text weight={500}>Total: ₹{transaction.total.toFixed(2)}</Text>
            </div>
            <div>
              <Text>Payment Method: {transaction.paymentMethod.toUpperCase()}</Text>
              <Text>Status: {transaction.status}</Text>
              <Text>Date: {new Date(transaction.createdAt).toLocaleString()}</Text>
            </div>
          </Group>
        </div>
      </Modal>
    );
  };

  if (loading) return <Text>Loading...</Text>;

  return (
    <Card shadow="sm" p="xs" sm:p="lg">
      <Group position="apart" mb="md">
        <Text size="xl" weight={700}>Transactions</Text>
      </Group>

      {/* Mobile View */}
      <div className="block sm:hidden">
        {transactions.map((transaction) => (
          <div 
            key={transaction._id}
            className="mb-4 p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <Text size="sm" color="dimmed">Date</Text>
                <Text>{new Date(transaction.createdAt).toLocaleDateString()}</Text>
              </div>
              <Badge color="green">Completed</Badge>
            </div>

            <div className="mb-2">
              <Text size="sm" color="dimmed">Transaction ID</Text>
              <Text>{transaction._id}</Text>
            </div>

            <div className="mb-2">
              <Text size="sm" color="dimmed">Customer</Text>
              <Text>{transaction.customer?.name || 'Walk-in Customer'}</Text>
            </div>

            <div className="flex justify-between items-center mb-2">
              <div>
                <Text size="sm" color="dimmed">Items</Text>
                <Badge>{transaction.items.length} items</Badge>
              </div>
              <div>
                <Text size="sm" color="dimmed">Total</Text>
                <Text weight={500}>${transaction.total.toFixed(2)}</Text>
              </div>
            </div>

            <Button 
              fullWidth
              size="sm"
              onClick={() => {
                setSelectedTransaction(transaction);
                setShowDetails(true);
              }}
            >
              View Details
            </Button>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block">
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
                <td><Badge>{transaction.items.length} items</Badge></td>
                <td>${transaction.total.toFixed(2)}</td>
                <td><Badge color="green">Completed</Badge></td>
                <td>
                  <Button 
                    size="xs" 
                    onClick={() => {
                      setSelectedTransaction(transaction);
                      setShowDetails(true);
                    }}
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        transaction={selectedTransaction}
        opened={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelectedTransaction(null);
        }}
      />
    </Card>
  );
}

export default TransactionList;
