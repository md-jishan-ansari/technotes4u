import React from 'react'

const FormWrap = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="
        min-h-fit
        h-full
        flex
        justify-center
        items-center
        pb-12
        pt-24
    ">
        <div className="
            max-w-[650px]
            w-fit
            flex
            flex-col
            gap-6
            items-center
            shadow-xl
            shadow-slate-200
            rounded-md
            overflow-hidden
        ">
            {children}
        </div>
    </div>
  )
}

export default FormWrap
