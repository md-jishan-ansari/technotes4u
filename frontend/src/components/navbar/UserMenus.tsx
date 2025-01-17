"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { Link } from "lucide-react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react";

const UserMenus2 = ({currentUser}: any) => {
    const router = useRouter()
  return (
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

        <DropdownMenuItem onClick={() => router.push("/blog/other")}>
            Blogs
        </DropdownMenuItem>

        <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem  onClick={() => signOut()}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenus2;