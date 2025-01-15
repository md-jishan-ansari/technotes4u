import Image from "next/image";
import getCurrentUser from "../actions/getCurrentUser";

export default async function Home() {
  const currentUser = await getCurrentUser();

  console.log({currentUser});

  return (
    <>
    <div>main</div>
    </>
  );
}
