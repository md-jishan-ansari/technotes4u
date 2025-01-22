'use client';

import { usePathname } from 'next/navigation';
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { changeTheme, setThemeFromLocalStorage } from "../../redux/slices/themeSlice";
import { toast } from 'react-toastify';
import { RootState } from '@/src/redux/store';

const Darkmode = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state:RootState) => state?.theme?.theme)
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
        className="hover:bg-secondary p-2 rounded-full"
        onClick={() => dispatch(changeTheme())}
      >
        {theme == 'dark' ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
      </button>
    </div>
  )
}

export default Darkmode
