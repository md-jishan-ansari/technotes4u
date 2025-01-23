"use client";

import { useAppDispatch } from "@/src/redux/hooks";
import { setActiveSlug } from "@/src/redux/slices/blogSlice";
import { useEffect } from "react";

const ActiveBlog = ({slug}: {slug: string}) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setActiveSlug({slug}));
    }, []);

    return (
        <div>

        </div>
    )
}

export default ActiveBlog
