import Head from 'next/head'
import { useRouter } from 'next/router';
import { auth } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import Stats from '@/components/Stats';
import { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function Home() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const { ref } = router.query;

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user])

  const sales = 1000;
  const profit = 4 * sales;
  const views = 1000

  const conversion = sales/views * 100;

  return (
    <>
      <Head>
        <title>S T O I C</title>
        <meta name="description" content="Track your affiliates for the stoic program" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='h-screen'>
        <Navbar />
        <div className='flex flex-col justify-center items-center h-full'>
         <h1 className='text-9xl'>Dashboard</h1>
         <p className='text-4xl'>Coming soon...</p>
        </div>
      </div>
    </>
  )
}
