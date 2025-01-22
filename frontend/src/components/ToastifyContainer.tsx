'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export default function ToastifyContainer() {
    const [toasterTheme, setToasterTheme] = useState('colored');
    const theme = useSelector((state: RootState) => state.theme.theme)

    useEffect(() => {
        if (theme === 'dark') {
            setToasterTheme('dark');
        } else {
            setToasterTheme('colored');
        }
    }, [theme]);

    return (
        <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={toasterTheme}
        />
    );
}