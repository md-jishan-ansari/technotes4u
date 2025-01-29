import React from 'react'

interface Props {
    children: React.ReactNode,
    className?: string
}

const Container: React.FC<Props> = ({children, className=""}) => {
  return (
    <div className={`
        max-w-[1920px]
        w-full
        mx-auto
        px-2
        py-4
        lg:px-6
        xl:px-20
        ${className}
    `}>
        {children}
    </div>
  )
}

export default Container
