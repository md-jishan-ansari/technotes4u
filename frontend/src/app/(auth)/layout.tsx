import FormWrap from '@/src/components/FormWrap';
import React from 'react'

interface authLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<authLayoutProps> = ({ children }) => {

  return (
    <FormWrap>
        <div className="w-[400px] p-8 md:p-4 shadow-xl ">
            {children}
        </div>
    </FormWrap>
  )
}

export default AuthLayout
