export async function fetchFeaturedCasinos() {
  const res = await fetch("https://gurusingapore.com/api/featured", {
    next: { revalidate: 600 },
  });
  if (!res.ok) throw new Error("Failed to fetch featured casinos");
  return res.json();
}

export async function fetchAllCasinos() {
  // TODO: replace with real backend endpoint
  const res = await fetch("https://gurusingapore.com/api/casinos", {
    next: { revalidate: 600 },
  });
  if (!res.ok) throw new Error("Failed to fetch casinos list");
  return res.json();
}
