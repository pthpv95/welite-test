import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function paginate<T>(array: T[], pageSize: number, pageIndex: number) {
  return array.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
}
