import React from 'react'

interface Props {
    children: React.ReactNode
}

const Container: React.FC<Props> = ({children}) => {
  return (
    <div className="
        max-w-[1920px]
        w-full
        mx-auto
        px-2
        py-5
        lg:px-6
        xl:px-20
    ">
        {children}
    </div>
  )
}

export default Container
