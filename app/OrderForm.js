'use client';
import React, { useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
  Typography,
  Button,
  Card,
  message,
} from 'antd';
import { db } from '/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const { Title } = Typography;

const OrderForm = () => {
  const [form] = Form.useForm();
  const [deliveryMethod, setDeliveryMethod] = useState('711');
  const [total, setTotal] = useState(0);

  const calculateTotal = (values) => {
    const calendar = (values?.calendar?.quantity || 0) * 800;
    const polaroid = (values?.polaroid?.quantity || 0) * 100;
    const shipping = 60;
    const total = calendar + polaroid;
    return total > 2000 ? total : total + shipping;
  };

  const onValuesChange = (_, allValues) => {
    setTotal(calculateTotal(allValues));
    if (allValues.deliveryMethod) {
      setDeliveryMethod(allValues.deliveryMethod);
    }
  };

  const onFinish = async (values) => {
    try {
      console.log('Form values:', values);
      const orderData = {
        ...values,
        total,
        createdAt: serverTimestamp(),
        havePaid: false,
      };
      await addDoc(collection(db, 'orders'), orderData);

      message.success('訂單提交成功！');
      form.resetFields();
      setTotal(0);
    } catch (error) {
      message.success('訂單提交失敗 請稍後再度嘗試！');
    }
  };

  return (
    <Card className='max-w-xl mx-auto my-8'>
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        initialValues={{
          deliveryMethod: '711',
          calendar: { quantity: 0, signed: false },
          polaroid: { quantity: 0, signed: false },
        }}
      >
        <Title level={3}>訂購表單</Title>

        {/* 基本資料 */}
        <Form.Item
          className='mb-3'
          name='name'
          label='姓名'
          rules={[{ required: true, message: '請輸入姓名' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          className='mb-3'
          name='phone'
          label='電話'
          rules={[
            { required: true, message: '請輸入電話' },
            { pattern: /^09\d{8}$/, message: '請輸入正確的手機號碼格式' },
            { max: 10, message: '請輸入 10 碼' },
          ]}
        >
          <Input />
        </Form.Item>
        <div className='flex gap-4'>
          <Form.Item label='桌曆' className='w-1/2'>
            <Space direction='vertical'>
              <Form.Item name={['calendar', 'quantity']} className='mb-0'>
                <InputNumber min={0} placeholder='數量' />
              </Form.Item>
              <Form.Item name={['calendar', 'signed']} className='mb-0'>
                <Radio.Group>
                  <Radio value={true}>需要簽名</Radio>
                  <Radio value={false}>不需簽名</Radio>
                </Radio.Group>
              </Form.Item>
            </Space>
          </Form.Item>

          <Form.Item label='拍立得' className='w-1/2'>
            <Space direction='vertical'>
              <Form.Item name={['polaroid', 'quantity']} className='mb-0'>
                <InputNumber min={0} placeholder='數量' />
              </Form.Item>
              <Form.Item name={['polaroid', 'signed']} className='mb-0'>
                <Radio.Group>
                  <Radio value={true}>需要簽名</Radio>
                  <Radio value={false}>不需簽名</Radio>
                </Radio.Group>
              </Form.Item>
            </Space>
          </Form.Item>
        </div>

        <Form.Item
          className='mb-3'
          name='deliveryMethod'
          label='配送方式'
          rules={[{ required: true, message: '請選擇配送方式' }]}
        >
          <Radio.Group>
            <Radio value='711'>7-11 店到店 (運費 60)</Radio>
            <Radio value='post'>郵局配送 (運費 60)</Radio>
          </Radio.Group>
        </Form.Item>
        <div className={`flex gap-4 ${deliveryMethod === '711' ? '' : 'flex-wrap'}`}>
          {deliveryMethod === '711' && (
            <Form.Item
              className='w-1/2'
              name='storeId'
              label='選擇門市'
              rules={[{ required: true, message: '請選擇門市' }]}
            >
              <Input placeholder='請填寫門市' />
            </Form.Item>
          )}

          {deliveryMethod === 'post' && (
            <Form.Item
              className='w-full'
              name='address'
              label='收件地址'
              rules={[{ required: true, message: '請輸入收件地址' }]}
            >
              <Input.TextArea />
            </Form.Item>
          )}

          <Form.Item
            className='w-1/2'
            name='bankCode'
            label='匯款帳戶末五碼'
            rules={[
              { required: true, message: '請輸入匯款帳戶末五碼' },
              { pattern: /^\d{5}$/, message: '請輸入正確的末五碼格式' },
            ]}
          >
            <Input maxLength={5} />
          </Form.Item>
        </div>

        {/* 總金額顯示 */}
        <div className='text-right mb-6'>
          <Title level={4}>總金額：NT$ {total}</Title>
        </div>

        {/* 送出按鈕 */}
        <Form.Item>
          <Button type='primary' htmlType='submit' className='w-full'>
            確認送出
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default OrderForm;
