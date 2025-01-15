'use client';

import { usePathname } from 'next/navigation';
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { changeTheme, setThemeFromLocalStorage } from "../../redux/slices/themeSlice";
import { toast } from 'react-toastify';

const Darkmode = () => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state?.theme?.theme)
  let pathname = usePathname();
  pathname = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  console.log({theme});

  useEffect(() => {
    dispatch(setThemeFromLocalStorage());
    // toast.success('Theme changed successfully');
  },[dispatch]);

  return (
    <div>
      <button
        className="
          bg-black
          dark:bg-white
          text-white
          dark:text-black
          border-2
          rounded-[12px]
          w-[40px]
          h-[24px]
          p-[2px]
          relative
        "
        onClick={() => dispatch(changeTheme())}
      >
        <div className="
          absolute
          top-[3px]
          left-[2px]
          dark:left-[16px]
          transition-all
        ">
        {theme == 'dark' ? <MdLightMode /> : <MdDarkMode />}
        </div>
      </button>
    </div>
  )
}

export default Darkmode
