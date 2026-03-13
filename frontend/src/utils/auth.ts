import toast from "react-hot-toast";

export async function authFetch(url: string, options: RequestInit = {}) {
  const token = sessionStorage.getItem("access_token");

  if (!token) {
    toast.error("No access token found. Please log in.");
    window.location.href = "/login";
    throw new Error("No access token");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401 || response.status === 403) {
    toast.error("Your session has expired. Please log in again.");
    sessionStorage.removeItem("access_token");
    window.location.href = "/login";
  }

  return response;
}
