import React, { useEffect, useState } from "react";
import Map from "./Map";
import { getCoordinatesFromAddress } from "../utils/getCoordinatesFromAddress";

interface MapLoaderProps {
  address: string;
}

const MapLoader: React.FC<MapLoaderProps> = ({ address }) => {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    if (!address) return;
    getCoordinatesFromAddress(address).then(setCoords);
  }, [address]);

  if (!coords) {
    return <p>Loading map...</p>;
  }

  return <Map lat={coords.lat} lon={coords.lon} />;
};

export default MapLoader;