"use client";

import { setActiveSlug } from "@/src/redux/slices/blogSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const ActiveBlog = ({slug}: {slug: string}) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setActiveSlug({slug}));
    }, []);

    return (
        <div>

        </div>
    )
}

export default ActiveBlog
