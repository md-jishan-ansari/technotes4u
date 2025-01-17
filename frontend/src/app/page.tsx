import Image from "next/image";
import getCurrentUser from "../actions/getCurrentUser";
import Button from "../components/Button";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/componentsSadcn/ui/accordion"
import Container from "../components/Container";
import FormWrap from "../components/FormWrap";

export default async function Home() {
  const currentUser = await getCurrentUser();

  console.log({currentUser});

  return (
    <>
    <div className="h-[200vh]">

      <Container>
        <FormWrap maxwidth="1000px">FormForm FormForm FormForm FormForm FormForm FormForm FormForm FormForm FormForm FormForm FormForm FormForm FormForm FormForm FormForm FormForm FormForm FormForm FormForm FormForm FormForm FormForm FormForm FormForm FormForm FormForm FormForm FormForm </FormWrap>
      </Container>

    </div>

    </>
  );
}
