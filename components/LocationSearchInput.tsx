"use client";

import { useEffect, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { Input } from "./ui/input";

type LocationAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
};

const libraries: "places"[] = ["places"];

export function LocationAutocomplete({
  value,
  onChange,
}: LocationAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
    libraries,
  });

  useEffect(() => {
    if (!isLoaded || !inputRef.current || !window.google) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["geocode"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const address = place.formatted_address || "";
      onChange(address);
    });
  }, [isLoaded, onChange]);

  if (!isLoaded) return <p>Cargando ubicación...</p>;

  return (
    <Input
      ref={inputRef}
      defaultValue={value}
      placeholder="Escribe una ubicación"
      type="text"
    />
  );
}
