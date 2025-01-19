import Button from '@/src/components/Button'
import Container from '@/src/components/Container'
import React from 'react'

const page = () => {
  return (
    <div>
        <div className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-secondary text-sm">
            <Container>
                <nav className="w-full mx-auto sm:flex sm:items-center sm:justify-between">
                    <a className="flex-none font-semibold text-xl text-black focus:outline-none focus:opacity-80 dark:text-white" href="#" aria-label="Brand">Brand</a>
                    <div className="flex flex-row items-center gap-5 mt-5 pb-2 overflow-x-auto sm:justify-end sm:mt-0 sm:ps-5 sm:pb-0 sm:overflow-x-visible [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                        <Button variant="primary" size="sm" > Save to Draft </Button>
                        <Button variant="primary" size="sm" > Publish </Button>
                        <Button variant="primary" size="sm" > Unpublish </Button>
                    </div>
                </nav>
            </Container>
        </div>
    </div>
  )
}

export default page
