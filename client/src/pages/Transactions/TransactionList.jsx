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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-1 sm:p-6">
      <Card className="w-full overflow-hidden">
        <Group position="apart" className="mb-4 px-3">
          <Text size="xl" weight={700}>Transactions</Text>
        </Group>

        {/* Mobile View - Maximum width */}
        <div className="block sm:hidden space-y-2 px-1">
          {transactions.map((transaction) => (
            <div 
              key={transaction._id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden w-full"
            >
              {/* Header Section */}
              <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
                <div>
                  <Text size="sm" color="dimmed">Transaction ID</Text>
                  <Text size="sm" weight={500} className="font-mono">
                    #{transaction._id.slice(-6)}
                  </Text>
                </div>
                <Badge color="green" size="lg">Completed</Badge>
              </div>

              {/* Main Content */}
              <div className="p-3 space-y-3">
                {/* Customer & Date */}
                <div className="flex justify-between items-start">
                  <div>
                    <Text size="sm" color="dimmed">Customer</Text>
                    <Text weight={500}>
                      {transaction.customer?.name || 'Walk-in Customer'}
                    </Text>
                  </div>
                  <div className="text-right">
                    <Text size="sm" color="dimmed">Date</Text>
                    <Text>
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </Text>
                  </div>
                </div>

                {/* Items & Total */}
                <div className="flex justify-between items-center pt-2 border-t">
                  <div>
                    <Text size="sm" color="dimmed">Items</Text>
                    <Badge size="lg" variant="outline">
                      {transaction.items.length} items
                    </Badge>
                  </div>
                  <div className="text-right">
                    <Text size="sm" color="dimmed">Total Amount</Text>
                    <Text size="lg" weight={700} className="text-green-600">
                      ₹{transaction.total.toFixed(2)}
                    </Text>
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  fullWidth
                  variant="light"
                  className="mt-3"
                  onClick={() => {
                    setSelectedTransaction(transaction);
                    setShowDetails(true);
                  }}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {transactions.length === 0 && (
            <div className="text-center py-8">
              <Text color="dimmed">No transactions found</Text>
            </div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <Table striped highlightOnHover className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Transaction ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Items</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Total</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{transaction._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.customer?.name || 'Walk-in Customer'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge>{transaction.items.length} items</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ₹{transaction.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge color="green">Completed</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
    </div>
  );
}

export default TransactionList;
