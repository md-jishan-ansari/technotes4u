"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/src/componentsSadcn/ui/dropdown-menu"
import Button from "../Button"
import Avatar from "../Avatar"
import { IoMdArrowDropdown } from "react-icons/io"
import { signOut } from "next-auth/react";
import Link from "next/link";

import { fetchCategories } from '@/src/redux/slices/blogSlice';
import { useEffect } from "react";
import { SafeUser } from "@/src/types/types";
import { useAppDispatch } from "@/src/redux/hooks";
import { isAdmin } from "@/src/lib/utils";

import { SiLibreofficewriter } from "react-icons/si";
import { TfiWrite } from "react-icons/tfi";

interface NavbarMenusProps {
    currentUser?: SafeUser | null;
}

const NavbarMenus:React.FC<NavbarMenusProps> = ({ currentUser }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);


  return (
    currentUser ? (
      <>
        <Link href="/admin/write/category">
          <Button
            variant="secondaryGhost"
            size="sm"
          >
            <TfiWrite size="16" className="mr-1" />
            Write
          </Button>
        </Link>


        <DropdownMenu>

          <DropdownMenuTrigger asChild>
            <Button
              variant="secondaryOutline"
              size="sm"
              rounded="rounded-3xl"
              isLoading={false}
              type="button"
              id="hs-navbar-example-dropdown"
            >
              <Avatar image={currentUser?.image} size={24} />
              <IoMdArrowDropdown size={24} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">

            <Link href="/blog/category1">
              <DropdownMenuItem >
                Blogs
              </DropdownMenuItem>
            </Link>

            <DropdownMenuItem>
              Billing
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>

            {isAdmin(currentUser) && (
              <DropdownMenuSub>
              <DropdownMenuSubTrigger>Admin</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Message</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>More...</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
              </DropdownMenuSub>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => signOut()}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    ) : (
      <>
        <Link href="/sign-in" >
          <Button
            variant="primaryGhost"
            size="sm"
            rounded="rounded-3xl"
          >
            Sign In
          </Button>
        </Link>

        <Link href="/sign-up" >
          <Button
            variant="dangerOutline"
            size="sm"
            rounded="rounded-3xl"
          >
            Sign Up
          </Button>
        </Link>
      </>
    )


  )
}

export default NavbarMenus;