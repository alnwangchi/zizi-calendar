'use client';

import { Table } from 'antd';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '/firebase';

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '電話',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '門市',
    dataIndex: 'storeId',
    key: 'storeId',
  },
  {
    title: '配送方式',
    dataIndex: 'deliveryMethod',
    key: 'deliveryMethod',
  },
  {
    title: '銀行末五碼',
    dataIndex: 'bankCode',
    key: 'bankCode',
  },
  {
    title: '總價',
    dataIndex: 'total',
    key: 'total',
  },
  {
    title: '是否付款',
    dataIndex: 'havePaid',
    key: 'havePaid',
    render: (text) => (text ? 'Yes' : 'No'),
  },
  {
    title: '桌曆數量',
    dataIndex: ['calendar', 'quantity'],
    key: 'calendarQuantity',
    render: (value, whole) => {
      const sign = whole?.calendar?.signed ? ' (需簽)' : '';
      return `${value} ${sign}`;
    },
  },
  {
    title: '簽名照數量',
    dataIndex: ['polaroid', 'quantity'],
    key: 'polaroidQuantity',
    render: (value, whole) => {
      const sign = whole?.calendar?.signed ? ' (需簽)' : '';
      return `${value} ${sign}`;
    },
  },
  {
    title: '建立時間',
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
