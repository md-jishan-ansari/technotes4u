'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../redux/hooks';

export default function ToastifyContainer() {
    const [toasterTheme, setToasterTheme] = useState('colored');
    const theme = useAppSelector(state => state.general.theme)

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