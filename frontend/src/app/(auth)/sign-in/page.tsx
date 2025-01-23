
import getCurrentUser from "@/src/redux/actions/getCurrentUser";
import SignInForm from "@/src/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Sign In | Technotes4u',
  description: 'Sign in to your account'
}

const SignIn = async () => {
  const currentUser = await getCurrentUser();
  return  <SignInForm currentUser={currentUser} />
}

export default SignIn;
