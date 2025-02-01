export type User = {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    authtoken?: string;
    role?: Role;
}

export type SafeUser = User

// The SafeUser type is created using TypeScript utility types:

// Omit<User, "createdAt" | "updatedAt" | "emailVerified"> removes these three properties from the original User type
// Then using the & (intersection type), it adds them back with modified types:
// createdAt: string
// updatedAt: string
// emailVerified: string | null

export type IconImage = {
    url: string;
    darkUrl: string;
}
export type Category = {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    parentId?: string | null;
    iconImage?: IconImage | null;
    isPublished: boolean;
    isFeatured: boolean;
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
    editor: Editor;
}

export type Blog = Category & {
    content?: string | null;
    draftContent?: string | null;
    mdxcontent?: string | null;
    mdxdraftContent?: string | null;
    isMdxEditor: boolean;
}

export type CommentUser = {
    id: string,
    name: string,
    image: string
}

export type Comment = {
    id: string,
    content: string,
    createdAt: string,
    updatedAt: string,
    blogId: string,
    parentId: string,
    user: CommentUser,
}

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
}

export enum Editor {
    RichEditor = "RichEditor",
    MdxEditor = "MdxEditor",
}