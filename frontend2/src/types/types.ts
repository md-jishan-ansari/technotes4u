
export type User = {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    authtoken?: string;
}

export type SafeUser = User

// The SafeUser type is created using TypeScript utility types:

// Omit<User, "createdAt" | "updatedAt" | "emailVerified"> removes these three properties from the original User type
// Then using the & (intersection type), it adds them back with modified types:
// createdAt: string
// updatedAt: string
// emailVerified: string | null