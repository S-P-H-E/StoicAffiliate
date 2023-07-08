import React from 'react';
import { auth } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Dropdown, message } from 'antd';
import { IoNotifications } from 'react-icons/io5';

export default function Navbar() {
    const [user, loading] = useAuthState(auth);

    const handleLogout = () => {
        auth.signOut();
        message.success("Logged out successfully");
    }

    const items = [
      {
        label: user && user.photoURL && (
          <div className='w-[200px] mt-5 flex justify-center items-center'>
            <img src={user.photoURL} alt={user.displayName} className='rounded-full w-[70px]'/>
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
        label: <a href='/settings'>Settings</a>,
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

    return (
        <>
            <div className='m-10 flex justify-between items-center'>
            <h1 className='text-4xl font-medium'>S T O I C | Affiliates</h1>
            <div className='flex gap-5 justify-center items-center'>
              {/* <div>
                <IoNotifications size={25} className='transition-all hover:scale-105'/>
              </div> */}
              {user && user.photoURL && (
                  <Dropdown menu={{items,}} trigger={['click']} placement="bottomRight">
                      <img src={user.photoURL} alt={user.displayName} className='rounded-full w-[50px] cursor-pointer'/>
                  </Dropdown>
              )}
            </div>
            </div>
        </>
    )
}