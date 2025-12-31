const GEOCODING_BASE = "https://geocoding-api.open-meteo.com/v1/search";

export async function geocodeCity(name, { count = 10, language = 'en' } = {}) {
  const q = encodeURIComponent(name);
  const url = `${GEOCODING_BASE}?name=${q}&count=${count}&language=${language}`;
  const json = await fetch(url).then(async (res) => {
    if (!res.ok) throw new Error(`Request failed ${res.status}: ${res.statusText}`);
    return res.json();
  });
  const cities = json?.results
  .map(res => ({
    id: res.id,
    name: res.name,
    country: res.country,
    displayName: `${res.name}, ${res.country}`,
    lat: res.latitude,
    lon: res.longitude,
  }))
  .filter(
    (city, index, arr) =>
      index ===
      arr.findIndex(
        c => c.name === city.name && c.country === city.country
      )
  ).slice(0, 5);

  return cities || [];
}
