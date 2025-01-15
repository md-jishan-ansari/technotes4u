'use client';
import React from 'react'
import { ThemeContextProvider } from './ThemeContextProvider';
import ToastProvider from './ToastProvider';

interface ContextProvidersProps {
    children: React.ReactNode;
}

const ContextProviders:React.FC<ContextProvidersProps> = ({children}) => {
  return (
    <ThemeContextProvider>
      <ToastProvider />
      {children}
    </ThemeContextProvider>
  )
}

export default ContextProviders
