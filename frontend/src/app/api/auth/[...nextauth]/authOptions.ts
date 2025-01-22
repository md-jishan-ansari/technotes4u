import { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:9000';

export const addApiTokenToCookies = async (authtoken: string) => {

  // Store in cookies
  // Using Next.js cookies
  cookies().set('authtoken', authtoken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 3 * 24 * 60 * 60 // 3 days
  });
}


export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
          access_type: "offline", // Ensures refresh_token is included
          prompt: "consent", // Forces consent screen to show (useful for testing)
        },
      },
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        confirmPassword: { label: "Confirm Password", type: "password" },
        action: { label: "Action", type: "text" }
      },
      async authorize(credentials) {
        try {
          const isRegister = credentials?.action === 'register';
          const endpoint = isRegister ? '/api/auth/register' : '/api/auth/signin';

          const payload = isRegister
            ? {
                name: credentials.name,
                email: credentials.email,
                password: credentials.password,
                confirmPassword: credentials.confirmPassword
              }
            : {
                email: credentials?.email,
                password: credentials?.password
              };

          const response = await fetch(`${BACKEND_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error(isRegister ? 'Registration failed' : 'Invalid credentials');
          }

          const user = await response.json();

          if (!user) {
            return null;
          }

          addApiTokenToCookies(user.authtoken);
          return user;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  events: {
    async signIn({ user, account }) {


      if (account?.provider === 'google') {


        try {
          const response = await fetch(`${BACKEND_URL}/api/auth/oauth-signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
              account: account
            })
          });

          const userData = await response.json();
          addApiTokenToCookies(userData.authtoken);

          if (!response.ok) {
            throw new Error('OAuth signin failed');
          }
        } catch (error) {
          console.error('OAuth signin error:', error);
          throw error; // Instead of returning false, throw the error
        }

      }
    },
    async signOut() {
      // Remove api-token from cookies
      cookies().delete('authtoken');
    }
  },
  pages: {
    signIn: "/sign-in",
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: "jwt",
    maxAge: 3 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET
}

// const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo`, {
//   headers: {
//     Authorization: `Bearer ${token.accessToken}`,
//   },
// });