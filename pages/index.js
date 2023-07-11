import { MutatingDots } from  'react-loader-spinner'
import { useRouter } from 'next/router';
import { auth } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import Head from 'next/head';

export default function Home(){
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (loading) {
      // Wait until the authentication state is loaded
      return;
    }

    if (!user) {
      // Redirect to login if the user is not logged in
      router.push('/login');
    } else {
      router.push('/dashboard')
    }
  }, [user, loading]);

  return(
    <>
      <Head>
        <title>S T O I C - Make money through our affiliate system</title>
        <meta name="description" content="Track your affiliates for the stoic program" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='flex justify-center items-center h-screen'>
        <MutatingDots 
          height="100"
          width="100"
          color="white"
          secondaryColor= '#FEC800'
          radius='12.5'
          ariaLabel="mutating-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    </>
  )
}