import { getServerSession } from "next-auth";
import { authOptions } from '../app/api/auth/[...nextauth]/authOptions';
import { cookies } from 'next/headers';

export async function getSessionData() {
    return getServerSession(authOptions);
}

export default async function getCurrentUser() {
    const cookieStore = cookies();
    const session = await getSessionData();
    if(!session?.user || !session?.user?.email) {
        return null;
    }
    const authtoken = cookieStore.get('authtoken');
    const user = {
        authtoken: authtoken?.value,
        ...session?.user
    }

    return user;
    // return getCurrentUserCached(session?.user?.email);
}

// const getCurrentUserCached = cache(async (email: string | null | undefined): Promise<SafeUser | null> => {
//     try {
//         if (!email) return null;

//         const response = await fetch(`${BACKEND_URL}/api/auth/user/${email}`);
//         const user = await response.json();



//         if (!user) return null;

//         return {
//             ...user,
//             createdAt: user.createdAt,
//             updatedAt: user.updatedAt,
//             emailVerified: user.emailVerified || null,
//         };
//     } catch (error: any) {
//         console.log(error.message);
//         return null;
//     }
// });
