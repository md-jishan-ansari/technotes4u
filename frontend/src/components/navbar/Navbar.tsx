import { Redressed } from 'next/font/google';

import Link from 'next/link';;
import getCurrentUser from '@/src/actions/getCurrentUser';
import Darkmode from './Darkmode';
import Button from '../Button';
import { RxHamburgerMenu } from "react-icons/rx";
import UserMenus from './UserMenus';
const redressed = Redressed({
  weight: ['400'],
  subsets: ['latin'],
})

const Navbar = async () => {
  const currentUser = await getCurrentUser();

  console.log("user image", currentUser?.image);

  return (
    <header className="sticky top-0 left-0 h-[68px]  w-100 z-50 shadow-sm dark:border dark:border-neutral-700 flex justify-start flex-nowrap w-full bg-background text-sm py-3">
      <nav className="xl:px-10 w-full mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex-none text-xl font-semibold dark:text-white focus:outline-none focus:opacity-80" aria-label="Brand">
            Technotes4u
          </Link>
          <div className="hidden">
            <button type="button" className="hs-collapse-toggle relative size-7 flex justify-center items-center gap-x-2 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10" id="hs-navbar-example-collapse" aria-expanded="false" aria-controls="hs-navbar-example" aria-label="Toggle navigation" data-hs-collapse="#hs-navbar-example">
                <RxHamburgerMenu />
            </button>
          </div>
        </div>
        <div id="hs-navbar-example" className="hs-collapse overflow-hidden transition-all duration-300 basis-full grow block" aria-labelledby="hs-navbar-example-collapse">
          <div className="flex gap-5 flex-row items-center justify-end mt-0 ps-5">
            <Darkmode />

            {currentUser ? (
              <UserMenus currentUser={currentUser} />
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
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
