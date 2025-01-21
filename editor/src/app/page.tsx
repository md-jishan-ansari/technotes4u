
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href="/froala-editor" >froala-editor</Link><br/><br/>
      <Link href="/froala-page" >froala-page</Link><br/><br/>
    </div>
  );
}
