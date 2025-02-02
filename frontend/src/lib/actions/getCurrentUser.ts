import { authOptions } from "@/src/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { User, Role } from "@/src/types/types";

interface JwtPayload {
    role: Role;
    [key: string]: any;
}

export async function getSessionData() {
    return getServerSession(authOptions);
}

export default async function getCurrentUser(): Promise<User | null> {
    const cookieStore = cookies();
    const session = await getSessionData();

    if(!session?.user || !session?.user?.email) {
        return null;
    }

    const authtoken = cookieStore.get('authtoken');
    const jwtSecret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(authtoken?.value || "", jwtSecret) as unknown as JwtPayload;

    const user: User = {
        authtoken: authtoken?.value,
        role: decoded?.role,
        ...session?.user
    }

    return user;
    // return getCurrentUserCached(session?.user?.email);
}

