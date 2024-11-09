'use client';
import Image from 'next/image';
import OrderForm from './OrderForm';
import { useKeySequence } from './hooks/useKeySequence';

export default function Home() {
  const sequence = useKeySequence('zizi');

  return (
    <div className='container flex items-center h-screen'>
      <div className='w-1/2 max-h-screen flex justify-center items-center '>
        <Image src='/main.jpg' alt='zizi' width={500} height={800} />
      </div>
      <OrderForm />;
    </div>
  );
}
