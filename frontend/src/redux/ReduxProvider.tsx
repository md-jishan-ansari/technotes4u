'use client';
import React from 'react'

import { Provider } from 'react-redux';
import { store } from './store';
import Footer from '../components/footer/Footer';
import { usePathname } from 'next/navigation';
interface ContextProvidersProps {
    children: React.ReactNode;
}

const ContextProviders:React.FC<ContextProvidersProps> = ({children}) => {
  const pathname = usePathname();
  return (
    <Provider store={store}>
        {children}
        {!pathname.startsWith("/admin") && <Footer />}
    </Provider>
  )
}

export default ContextProviders
