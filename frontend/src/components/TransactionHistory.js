import React, { useState } from 'react';
import { Table, Badge, Form, Row, Col, Button } from 'react-bootstrap';
import { getTransactionsByDateRange, downloadStatement } from '../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

function TransactionHistory({ transactions: initialTransactions, accountNumber }) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [startDate, setStartDate] = useState(
    format(new Date().setMonth(new Date().getMonth() - 1), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const getCategoryColor = (category) => {
    const colors = {
      FOOD: 'primary',
      TRANSPORT: 'info',
      BILLS: 'warning',
      SALARY: 'success',
      SHOPPING: 'secondary',
      ENTERTAINMENT: 'danger',
      HEALTHCARE: 'info',
      EDUCATION: 'primary',
      OTHER: 'light'
    };
    return colors[category] || 'secondary';
  };

  const getTypeColor = (type) => {
    if (type === 'DEPOSIT' || type === 'TRANSFER_IN' || type === 'INTEREST') return 'success';
    if (type === 'WITHDRAWAL' || type === 'TRANSFER_OUT') return 'danger';
    return 'secondary';
  };

  const handleFilter = async () => {
    try {
      const response = await getTransactionsByDateRange(accountNumber, startDate, endDate);
      setTransactions(response.data);
      toast.success('Transactions filtered successfully');
    } catch (error) {
      toast.error('Failed to filter transactions');
    }
  };

  const handleDownloadStatement = async () => {
    try {
      const response = await downloadStatement(accountNumber, startDate, endDate);
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `statement-${accountNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Statement downloaded successfully');
    } catch (error) {
      toast.error('Failed to download statement');
    }
  };

  return (
    <div>
      <Row className="mb-3">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3} className="d-flex align-items-end">
          <Button variant="primary" onClick={handleFilter} className="me-2">
            Filter
          </Button>
          <Button variant="success" onClick={handleDownloadStatement}>
            Download PDF
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount(R)</th>
            <th>Balance(R)</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{format(new Date(transaction.transactionDate), 'dd/MM/yyyy HH:mm')}</td>
              <td>{transaction.description}</td>
              <td>
                <Badge bg={getCategoryColor(transaction.category)}>
                  {transaction.category}
                </Badge>
              </td>
              <td>
                <Badge bg={getTypeColor(transaction.type)}>
                  {transaction.type}
                </Badge>
              </td>
              <td className={transaction.amount > 0 ? 'text-success' : 'text-danger'}>
                R{transaction.amount?.toFixed(2)}
              </td>
              <td>R{transaction.balanceAfterTransaction?.toFixed(2)}</td>
            </tr>
          ))}
          {transactions.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default TransactionHistory;