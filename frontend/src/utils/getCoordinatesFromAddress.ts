export async function getCoordinatesFromAddress(address: string) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          address,
        )}&format=json&limit=1`,
      );
      const data = await res.json();
      if (data.length === 0) return null; // No encontró resultados
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      };
    } catch (error) {
      console.error("Error geocoding address:", error);
      return null;
    }
  }