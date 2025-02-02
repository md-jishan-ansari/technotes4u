import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Role, User } from "../types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isAdmin(currentUser: User | null): boolean {
  return currentUser?.role === Role.ADMIN;
}