import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/firebase';
import { message } from 'antd';
import { useAuthState } from 'react-firebase-hooks/auth';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { FaGoogle } from 'react-icons/fa';
import { db } from '@/firebase';
import { useSpring, animated } from 'react-spring';

export default function Login() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [referralLink, setReferralLink] = useState('');

  // Sign in with Google
  const googleProvider = new GoogleAuthProvider();

  const generateReferralCode = () => {
    const length = 6; // Adjust the length of the referral code as needed
    const characters = 'abcdefghijklmnopqrstuzwxyz0123456789';
    let referralCode = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      referralCode += characters[randomIndex];
    }

    return referralCode;
  };

  const fetchReferralLink = async () => {
    const referralCode = generateReferralCode(); // Generate a random referral code
    const referralLink = `https://stoiccord.com/?ref=${referralCode}`; // Generate a referral link

    const userRef = collection(db, 'users');
    const q = query(userRef, where('link', '==', referralLink));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      setReferralLink(referralLink);
      return referralLink; // Return the referral link
    } else {
      return fetchReferralLink(); // Retry if the referral link already exists
    }
  };

  const handleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      router.push('/');
      message.success('Signed in successfully');

      const userRef = collection(db, 'users');
      const q = query(userRef, where('email', '==', res.user.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const referralLink = await fetchReferralLink();
        const docRef = await addDoc(userRef, {
          name: res.user.displayName,
          email: res.user.email,
          link: referralLink,
          sales: 0,
        });
        console.log('Document written with ID:', docRef.id);
        setReferralLink(referralLink);
      } else {
        const doc = querySnapshot.docs[0];
        const { link } = doc.data();
        setReferralLink(link);
        console.log('Referral link already exists for this user.');
      }
    } catch (err) {
      message.error('Error signing in');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReferralLink();
  }, []);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user]);

  // Animation
  const popupAnimation = useSpring({
    from: { opacity: 0, transform: 'scale(0)' },
    to: { opacity: 1, transform: 'scale(1)' },
    delay: 500,
  });

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Track your affiliates for the stoic program" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex justify-center items-center h-screen">
        <animated.div
          style={popupAnimation}
          className="border border-[#242627] bg-[#262626] p-8 rounded-lg flex flex-col justify-center items-center m-5"
        >
          <h1 className="text-4xl font-medium mb-5">S T O I C</h1>
          <p className="mb-5 text-[#777777] text-center">Login to your account to view your dashboard</p>
          <button
            className="bg-[#FEC801] rounded-lg px-4 py-2 text-black font-medium flex justify-center items-center gap-1"
            onClick={handleLogin}
          >
            <FaGoogle />
            Sign in with Google
          </button>
          {/* {referralLink && (
            <p className="mt-5 text-[#777777] text-center">
              Referral Link: <a href={referralLink}>{referralLink}</a>
            </p>
          )} */}
        </animated.div>
      </div>
    </>
  );
}
