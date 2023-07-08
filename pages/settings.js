import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase';
import { MdOutlineContentCopy } from 'react-icons/md';
import { message } from 'antd';
import Head from 'next/head';
import Image from 'next/image';

export default function Settings() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user]);

  const handleLogout = () => {
    auth.signOut();
    message.success("Logged out successfully");
}

  useEffect(() => {
    const fetchReferralLink = async () => {
      try {
        const userRef = collection(db, 'users');
        const q = query(userRef, where('email', '==', user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const referralLink = userDoc.data().link;
          setReferralLink(referralLink);
        }
      } catch (error) {
        console.error('Error fetching referral link:', error);
        message.error('Error fetching referral link');
      }
    };

    if (user) {
      fetchReferralLink();
    }
  }, [router]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    message.success('Copied to clipboard');
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <>
        <Head>
            <title>Settings</title>
            <meta name="description" content="Track your affiliates for the stoic program" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

      <div className="flex flex-col justify-center items-center">
        {user && user.photoURL && (
          <div className="w-full h-[200px] flex flex-col md:flex-row justify-center items-center gap-5 mt-16 md:mt-5">
            <Image src={user.photoURL} alt={user.displayName} className="rounded-full w-[100px] h-fit" />
            <div className="flex flex-col gap-2">
              <h1 className="font-medium text-4xl">{user.displayName}</h1>
              <p className='text-gray-500'>{user.email}</p>
              <div className='w-full flex gap-2 mt-2'>
                <button className="border border-[#242627] rounded-lg px-4 py-2 text-white font-medium flex justify-center items-center gap-1 text-sm" onClick={handleBack}>Go Back</button>
                <button className="bg-red-500 rounded-lg px-4 py-2 text-black font-medium flex justify-center items-center gap-1 text-sm" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
        )}

        <hr className="border-[#242627] mt-10 md:mt-0 mb-5 w-[300px] md:w-[600px]"/>
        <div className="w-[300px] md:w-[600px]">
          <div className="flex flex-col md:flex-row justify-between gap-2 md:items-center">
            <h1 className="font-medium">Refer a friend</h1>
            <div className='flex gap-2'>
                <p className="bg-transparent border border-[#242627] px-3 py-1 rounded-lg drop-shadow text-gray-500 text-sm md:text-lg" >{referralLink}</p>
                <button onClick={handleCopyLink}>
                    <MdOutlineContentCopy className='border border-[#242627] px-2 rounded-lg drop-shadow' size={33}/>
                </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
