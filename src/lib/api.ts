export async function fetchFeaturedCasinos() {
  const res = await fetch("/api/featured", {
    cache: 'force-cache',
    next: {
      revalidate: 3600, // 1 hour - casino data doesn't change frequently
      tags: ['featured-casinos']
    },
  });
  if (!res.ok) throw new Error("Failed to fetch featured casinos");
  return res.json();
}

export async function fetchAllCasinos() {
  const res = await fetch("/api/casinos", {
    cache: 'force-cache',
    next: {
      revalidate: 1800, // 30 minutes - more frequent for casino list
      tags: ['all-casinos']
    },
  });
  if (!res.ok) throw new Error("Failed to fetch casinos list");
  return res.json();
}

// Fetch top casinos (first 10 by default)
export async function fetchTopCasinos(limit: number = 10) {
  const casinos = await fetchAllCasinos();
  return Array.isArray(casinos) ? casinos.slice(0, limit) : [];
}
