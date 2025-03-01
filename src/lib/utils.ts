import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function apiRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: unknown,
    params?: Record<string, string | number | boolean>
): Promise<T> {
  const url = new URL(`/api/${endpoint}`, window.location.origin);
  if (params) {
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, String(params[key]));
    });
  }

  const response = await fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || response.statusText || "Something went wrong");
  }

  return response.json();
}