import React, { useState } from 'react';
import { Table, Tag, Space, Input, Button } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  ReloadOutlined
} from '@ant-design/icons';

export default function Payments() {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  
  // Dummy payment data
  const [paymentData, setPaymentData] = useState([
    {
      key: '1',
      transactionId: 'TXN123456',
      student: 'John Doe',
      course: 'Advanced React',
      amount: 149.99,
      date: '2023-05-15',
      status: 'completed',
      method: 'Credit Card'
    },
    {
      key: '2',
      transactionId: 'TXN789012',
      student: 'Jane Smith',
      course: 'Python for Data Science',
      amount: 199.99,
      date: '2023-05-16',
      status: 'pending',
      method: 'PayPal'
    },
    {
      key: '3',
      transactionId: 'TXN345678',
      student: 'Robert Johnson',
      course: 'UX Design Fundamentals',
      amount: 99.99,
      date: '2023-05-17',
      status: 'completed',
      method: 'Stripe'
    },
    {
      key: '4',
      transactionId: 'TXN901234',
      student: 'Emily Davis',
      course: 'Machine Learning Basics',
      amount: 249.99,
      date: '2023-05-18',
      status: 'failed',
      method: 'Credit Card'
    },
    {
      key: '5',
      transactionId: 'TXN567890',
      student: 'Michael Brown',
      course: 'Web Development Bootcamp',
      amount: 499.99,
      date: '2023-05-19',
      status: 'completed',
      method: 'Bank Transfer'
    },
  ]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
  });

  const columns = [
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      ...getColumnSearchProps('transactionId'),
    },
    {
      title: 'Student',
      dataIndex: 'student',
      key: 'student',
      ...getColumnSearchProps('student'),
    },
    {
      title: 'Course',
      dataIndex: 'course',
      key: 'course',
      ...getColumnSearchProps('course'),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: amount => `$${amount.toFixed(2)}`,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      ...getColumnSearchProps('date'),
    },
    {
      title: 'Payment Method',
      dataIndex: 'method',
      key: 'method',
      ...getColumnSearchProps('method'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        let color, icon;
        switch (status) {
          case 'completed':
            color = 'green';
            icon = <CheckCircleOutlined />;
            break;
          case 'pending':
            color = 'orange';
            icon = <ClockCircleOutlined />;
            break;
          case 'failed':
            color = 'red';
            icon = <CloseCircleOutlined />;
            break;
          default:
            color = 'gray';
        }
        return (
          <Tag icon={icon} color={color}>
            {status.toUpperCase()}
          </Tag>
        );
      },
      filters: [
        { text: 'Completed', value: 'completed' },
        { text: 'Pending', value: 'pending' },
        { text: 'Failed', value: 'failed' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>View Details</a>
          {record.status === 'pending' && <a>Approve</a>}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Payment Details</h1>
        <Input.Search
          placeholder="Search payments..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          style={{ width: 400 }}
          onSearch={(value) => {
            const filteredData = paymentData.filter(item =>
              Object.keys(item).some(key =>
                item[key]?.toString().toLowerCase().includes(value.toLowerCase())
              )
            );
            setPaymentData(filteredData);
          }}
          onChange={(e) => {
            if (e.target.value === '') {
              // Reset to original data when search is cleared
              setPaymentData([
                {
                  key: '1',
                  transactionId: 'TXN123456',
                  student: 'John Doe',
                  course: 'Advanced React',
                  amount: 149.99,
                  date: '2023-05-15',
                  status: 'completed',
                  method: 'Credit Card'
                },
                // ... rest of the original data
              ]);
            }
          }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={paymentData}
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />
    </div>
  );
}