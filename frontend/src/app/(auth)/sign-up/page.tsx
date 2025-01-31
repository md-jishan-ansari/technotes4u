
import getCurrentUser from "@/src/lib/actions/getCurrentUser";
import SignUpForm from "@/src/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Sign Up | Technotes4u',
  description: 'Sign in to your account'
}

const SignUp = async () => {
  const currentUser = await getCurrentUser();
  return (
    <SignUpForm currentUser={currentUser}/>
  )
}

export default SignUp;
