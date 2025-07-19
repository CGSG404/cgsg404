export async function fetchFeaturedCasinos() {
  const res = await fetch("https://gurusingapore.com/api/featured", {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error("Failed to fetch featured casinos");
  return res.json();
}

export async function fetchAllCasinos() {
  const res = await fetch("https://gurusingapore.com/api/casinos", {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error("Failed to fetch casinos list");
  return res.json();
}

// Fetch top casinos (first 10 by default)
export async function fetchTopCasinos(limit: number = 10) {
  const casinos = await fetchAllCasinos();
  return Array.isArray(casinos) ? casinos.slice(0, limit) : [];
}
