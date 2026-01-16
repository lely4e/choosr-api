
export async function authFetch(url: string, options: RequestInit = {}) {
  const token = sessionStorage.getItem("access_token");

  if (!token) {
    alert("No access token found. Please log in.");
    throw new Error("No access token");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}
