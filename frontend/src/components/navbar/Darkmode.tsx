'use client';
import { memo } from 'react';
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useEffect } from 'react';

import { changeTheme, setThemeFromLocalStorage } from "../../redux/slices/generalSlice";
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';

const Darkmode = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(state => state?.general?.theme);

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

export default memo(Darkmode);
