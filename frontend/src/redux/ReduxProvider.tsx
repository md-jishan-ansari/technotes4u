'use client';
import React from 'react'

import { Provider } from 'react-redux';
import { store } from './store';
interface ContextProvidersProps {
    children: React.ReactNode;
}

const ContextProviders:React.FC<ContextProvidersProps> = ({children}) => {
  return (
    <Provider store={store}>
        {children}
    </Provider>
  )
}

export default ContextProviders
