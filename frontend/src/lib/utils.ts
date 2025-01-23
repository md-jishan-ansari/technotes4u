import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Role, SafeUser } from "../types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isAdmin(currentUser: SafeUser | null): boolean {
  return currentUser?.role === Role.ADMIN;
}