import React from 'react'

const FormWrap = ({children, maxwidth="650px"}: {children: React.ReactNode, maxwidth?: string}) => {
  return (
    <div className="
        min-h-fit
        h-full
        flex
        justify-center
        items-center
        pb-12
        pt-20
    ">
        <div style={{maxWidth: maxwidth}} className={`
            w-fit
            flex
            flex-col
            gap-6
            items-center
            shadow-sm
            shadow-slate-200
            rounded-md
            overflow-hidden
        `}>
            {children}
        </div>
    </div>
  )
}

export default FormWrap
