// DESHABILITADO TEMPORALMENTE - Falta dependencia @react-google-maps/api
// TODO: Instalar: npm install @react-google-maps/api

/*
"use client";

import { useState, useEffect, useRef } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ["places"];

interface PlacesAutocompleteProps {
  onPlaceSelect: (place: { address: string; lat: number; lng: number }) => void;

  placeholder?: string;
  defaultValue?: string;
}

interface Suggestion {
  placeId: string;
  text: string;
  mainText: string;
  secondaryText: string;
}

export default function PlacesAutocomplete({
  onPlaceSelect,
  placeholder = "Buscar dirección...",
  defaultValue = "",
}: PlacesAutocompleteProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [inputValue, setInputValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputValue || inputValue.length < 3 || !isLoaded) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        // Usar la nueva API de AutocompleteSuggestion
        const request = {
          input: inputValue,
          includedRegionCodes: ["ec"], // Limitar a Ecuador
          // Usar locationBias en lugar de bounds/location/radius
          locationBias: new google.maps.Circle({
            center: { lat: -0.1807, lng: -78.4678 }, // Centro de Quito
            radius: 50000, // 50km
          }),
        };

        const { suggestions: autocompleteSuggestions } =
          await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

        const formattedSuggestions: Suggestion[] = autocompleteSuggestions.map((suggestion) => ({
          placeId: suggestion.placePrediction?.placeId || "",
          text: suggestion.placePrediction?.text?.toString() || "",
          mainText: suggestion.placePrediction?.mainText?.toString() || "",
          secondaryText: suggestion.placePrediction?.secondaryText?.toString() || "",
        }));

        setSuggestions(formattedSuggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error al obtener sugerencias:", error);
        setSuggestions([]);
      }
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timer);
  }, [inputValue, isLoaded]);

  const handleSuggestionClick = async (placeId: string, description: string) => {
    try {
      // Usar la nueva API de Place
      const place = new google.maps.places.Place({
        id: placeId,
      });

      // Fetch place details
      await place.fetchFields({
        fields: ["location", "formattedAddress"],
      });

      if (place.location) {
        const lat = place.location.lat();
        const lng = place.location.lng();

        console.log("Lugar seleccionado:", {
          direccion: description,
          coordenadas: { lat, lng },
        });

        setInputValue(description);
        setShowSuggestions(false);
        onPlaceSelect({
          address: description,
          lat,
          lng,
        });
      }
    } catch (error) {
      console.error("Error al obtener detalles del lugar:", error);
    }
  };

  if (!isLoaded) {
    return <Input placeholder="Cargando..." disabled />;
  }

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        placeholder={placeholder}
        autoComplete="off"
      />

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.placeId}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
              onClick={() => handleSuggestionClick(suggestion.placeId, suggestion.text)}
            >
              <div className="font-medium text-sm">{suggestion.mainText}</div>
              <div className="text-xs text-gray-600">{suggestion.secondaryText}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
*/

// Exportar componente dummy mientras se instala la dependencia
export default function PlacesAutocomplete({ 
  onPlaceSelect, 
  placeholder = "Buscar dirección...", 
  defaultValue = "" 
}: { 
  onPlaceSelect?: (place: { address: string; lat: number; lng: number }) => void; 
  placeholder?: string; 
  defaultValue?: string; 
}) {
  return <input type="text" placeholder={placeholder} defaultValue={defaultValue} className="w-full px-3 py-2 border rounded-md" disabled />;
}
