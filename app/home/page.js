'use client';

import { Table } from 'antd';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '/firebase';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: 'Store ID',
    dataIndex: 'storeId',
    key: 'storeId',
  },
  {
    title: 'Delivery Method',
    dataIndex: 'deliveryMethod',
    key: 'deliveryMethod',
  },
  {
    title: 'Bank Code',
    dataIndex: 'bankCode',
    key: 'bankCode',
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
  },
  {
    title: 'Paid',
    dataIndex: 'havePaid',
    key: 'havePaid',
    render: (text) => (text ? 'Yes' : 'No'),
  },
  {
    title: 'Calendar Quantity',
    dataIndex: ['calendar', 'quantity'],
    key: 'calendarQuantity',
  },
  {
    title: 'Polaroid Quantity',
    dataIndex: ['polaroid', 'quantity'],
    key: 'polaroidQuantity',
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (createdAt) => {
      const date = new Date(createdAt.seconds * 1000);
      return date.toLocaleString();
    },
  },
];

const Page = () => {
  const [data, setData] = useState([]);
  console.log('🚀 ~ data:', data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'orders'));
        const dataList = querySnapshot.docs.map((doc) => doc.data());
        setData(dataList);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default Page;
