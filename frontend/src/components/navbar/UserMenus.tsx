'use client';
import React, { useState } from 'react'
import Button from '../Button'

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SafeUser } from '@/src/types/types';
import MenuItem from './MenuItem';
import { toast } from 'react-toastify';

const UserMenus = ({currentUser}: {currentUser: SafeUser | null}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  const togleOpen = () => {
    setIsOpen(!isOpen);
  }


  return (
    <div>
      <MenuItem onClick={() => { togleOpen(); router.push('/orders') }} >Your Orders</MenuItem>

      <MenuItem onClick={() => { togleOpen(); router.push('/admin') }} >Admin Dashboard</MenuItem>

      <hr />

      <MenuItem onClick={() => signOut()}>Logout</MenuItem>
    </div>
  )
}

export default UserMenus
