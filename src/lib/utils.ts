import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function apiRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: Record<string, unknown> | FormData,
    params?: Record<string, string | number | boolean>
): Promise<T> {
  const url = new URL(`/api/${endpoint}`, window.location.origin);
  if (params) {
    Object.keys(params).forEach((key) => {
      url.searchParams.append(key, String(params[key]));
    });
  }
  const response = await fetch(url.toString(), {
    method,
    body: body instanceof FormData ?  body : JSON.stringify(body),
    headers: body instanceof FormData ? {} : { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || response.statusText || "Something went wrong");
  }

  // Handle different content types (e.g., file responses)
  if (response.headers.get("Content-Type")?.includes("application/octet-stream") || response.headers.get("Content-Type")?.includes("application/pdf")) {
    return await response.blob() as T;
  }

  return response.json();
}