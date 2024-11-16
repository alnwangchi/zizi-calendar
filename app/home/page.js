'use client';

import { Card, Col, Row, Statistic, Table, message } from 'antd';
import { collection, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { ceil, sumBy } from 'lodash-es';
import { useEffect, useState } from 'react';
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
    title: '配送方式',
    dataIndex: 'deliveryMethod',
    key: 'deliveryMethod',
  },
  {
    title: '門市',
    dataIndex: 'storeId',
    key: 'storeId',
    render: (storeId) => {
      return storeId ? `門市${storeId}` : '-';
    },
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
    render: (address) => {
      return address ? address : '-';
    },
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
    render: (paid, record) => {
      return (
        <button
          onDoubleClick={async (e) => {
            e.stopPropagation();
            try {
              const docRef = doc(db, 'zizi-202411-calendar', record.id);
              await updateDoc(docRef, {
                havePaid: !paid,
              });
              message.success('付款狀態已更新');
              // 重新讀取
              record.refetch();
            } catch (error) {
              console.error('Error updating payment status:', error);
              message.error('更新失敗');
            }
          }}
          className={`px-4 py-1 rounded ${
            paid ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {paid ? '已付款' : '未付款'}
        </button>
      );
    },
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
  const totalSum = sumBy(data, 'total') || 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'zizi-202411-calendar'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const dataList = querySnapshot.docs.map((doc) => ({
          id: doc.id, // 從 doc 取得 id
          ...doc.data(), // 展開其他資料
          refetch: fetchData, // 加入重新讀取函數
        }));

        setData(dataList);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className='bg-white min-h-screen p-10'>
      <Table bordered columns={columns} dataSource={data} />

      <Row gutter={16}>
        <Col span={4}>
          <Card bordered={false}>
            <Statistic
              title='Total'
              value={totalSum}
              valueStyle={{ color: '#3f8600' }}
              prefix='$'
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card bordered={false}>
            <Statistic title='Fee (5%)' value={ceil(totalSum * 0.05)} prefix='$' />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Page;
