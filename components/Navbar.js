import React, { useState } from 'react';
import { auth } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Dropdown, message } from 'antd';
import { IoNotifications } from 'react-icons/io5';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
    const [user, loading] = useAuthState(auth);
    const [firebaseLoaded, setFirebaseLoaded] = useState(false);

    const handleLogout = () => {
        auth.signOut();
        message.success("Logged out successfully");
    }

    // Get the current hour
    const currentHour = new Date().getHours();

    // Determine the greeting based on the time of day
    let greeting = '';
    if (currentHour >= 5 && currentHour < 12) {
        greeting = 'Good morning';
    } else if (currentHour >= 12 && currentHour < 18) {
        greeting = 'Good afternoon';
    } else {
        greeting = 'Good evening';
    }

    const items = [
        {
            label: user && user.photoURL && (
                <div className='w-[200px] mt-5 flex justify-center items-center'>
                    <img src={user.photoURL} alt={user.displayName} className='rounded-full w-[70px]' />
                </div>
            ),
            key: '0',
        },
        {
            label: user && (
                <div className='w-[200px] mb-5 flex justify-center items-center'>
                    <h1 className='font-medium'>{user.displayName}</h1>
                </div>
            ),
            key: '0',
        },
        {
            label: <Link href='/settings'>Settings</Link>,
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label: <button onClick={handleLogout}>Logout</button>,
            key: '2',
            danger: true,
        },
    ];

    // Set a timeout to simulate the loading delay
    setTimeout(() => {
        setFirebaseLoaded(true);
    }, 2000);

    return (
      <>
        {loading || !firebaseLoaded ? (
          // Skeleton CSS loading animation
          <div className='p-10 flex justify-between items-center'>
            <div className="skeleton-box animate-pulse">
              <div className="skeleton-text1"></div>
              <div className="skeleton-text2"></div>
            </div>
            <div className='flex gap-5 justify-center items-center'>
              <div className="skeleton-box animate-pulse">
                <div className="skeleton-circle"></div>
              </div>
            </div>
          </div>
        ) : (
          // Render the actual content once Firebase data is loaded
          <div className='p-10 flex justify-between items-center'>
            <div>
              {user && user.photoURL && (
                <>
                  <h1 className='md:text-2xl text-[#5F5F5F]'>{greeting},</h1>
                  <h2 className='text-2xl md:text-4xl font-medium text-white'>{user.displayName}</h2>
                </>
              )}
    
            </div>
            <div className='flex gap-5 justify-center items-center'>
              {/* <div>
                <IoNotifications size={25} className='transition-all hover:scale-105' />
              </div> */}
              {user && user.photoURL && (
                <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
                  <img src={user.photoURL} alt={user.displayName} className='rounded-full w-[50px] cursor-pointer' />
                </Dropdown>
              )}
            </div>
          </div>
        )}
      </>
    );
    
}
