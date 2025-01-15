import Image from "next/image";
import getCurrentUser from "../actions/getCurrentUser";
import Button from "../components/Button";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/sadcnComponents/ui/accordion"

export default async function Home() {
  const currentUser = await getCurrentUser();

  console.log({currentUser});

  return (
    <>
    <div className="h-[200vh]">

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <div className="flex items-center justify-between">
            <p>Name</p>
            <AccordionTrigger></AccordionTrigger>
          </div>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

    </div>

    </>
  );
}
