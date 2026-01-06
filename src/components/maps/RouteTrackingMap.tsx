// DESHABILITADO TEMPORALMENTE - Falta dependencia @react-google-maps/api
// TODO: Instalar: npm install @react-google-maps/api

/*
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

// Datos quemados para demostración
const MOCK_ROUTE_DATA = {
  origin: { lat: -0.1807, lng: -78.4678 }, // Quito Centro
  destination: { lat: -0.2902, lng: -78.5497 }, // Quitumbe
  waypoints: [
    { lat: -0.2108, lng: -78.4903 }, // El Recreo
    { lat: -0.2525, lng: -78.5233 }, // Villaflora
  ],
};

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const center = {
  lat: -0.1807,
  lng: -78.4678,
};

const libraries: ("places" | "drawing" | "geometry" | "visualization" | "marker")[] = ["places", "marker"];

interface RouteTrackingMapProps {
  routeId: string;
  userType: "driver" | "passenger";
}

export default function RouteTrackingMap({ routeId, userType }: RouteTrackingMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Solicitar permisos de geolocalización y obtener ubicación en tiempo real
  useEffect(() => {
    if (!isLoaded) return;

    if (!navigator.geolocation) {
      setLocationError("Tu navegador no soporta geolocalización");
      return;
    }

    // Solicitar ubicación actual
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(newLocation);
        console.log("Ubicación inicial obtenida:", newLocation);
      },
      (error) => {
        console.error("Error al obtener ubicación:", error);
        setLocationError("No se pudo obtener tu ubicación. Verifica los permisos.");
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    // Monitorear cambios de ubicación en tiempo real
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(newLocation);

        // Centrar automáticamente solo si el usuario no ha interactuado
        if (map && !userHasInteracted) {
          map.panTo(newLocation);
          map.setZoom(20);
        }

        // Enviar ubicación al servidor
        console.log("Enviando posición en tiempo real al servidor:", {
          lat: newLocation.lat,
          lng: newLocation.lng,
          timestamp: new Date().toISOString(),
          routeId,
          userType,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        console.error("Error al monitorear ubicación:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    // Limpiar el monitoreo al desmontar
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isLoaded, routeId, userType, map, userHasInteracted]);

  // Crear marcador avanzado para la ubicación del usuario
  useEffect(() => {
    if (!map || !userLocation || !isLoaded) return;

    // Crear el icono del carrito usando SVG
    const carIcon = document.createElement("div");
    carIcon.innerHTML = `
      <div style="
        background-color: ${userType === "driver" ? "#3B82F6" : "#10B981"};
        border: 3px solid white;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        font-size: 20px;
      ">
        🚗
      </div>
    `;

    // Si ya existe un marcador, eliminarlo
    if (userMarkerRef.current) {
      userMarkerRef.current.map = null;
    }

    // Crear nuevo AdvancedMarkerElement
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: userLocation,
      content: carIcon,
      title: userType === "driver" ? "Tu ubicación (Conductor)" : "Tu ubicación",
    });

    userMarkerRef.current = marker;

    return () => {
      if (userMarkerRef.current) {
        userMarkerRef.current.map = null;
      }
    };
  }, [map, userLocation, isLoaded, userType]);

  // Calcular la ruta más rápida (con datos mock)
  const calculateRoute = useCallback(() => {
    if (!isLoaded) return;

    const directionsService = new google.maps.DirectionsService();

    const waypoints = MOCK_ROUTE_DATA.waypoints.map((point) => ({
      location: new google.maps.LatLng(point.lat, point.lng),
      stopover: true,
    }));

    directionsService.route(
      {
        origin: new google.maps.LatLng(MOCK_ROUTE_DATA.origin.lat, MOCK_ROUTE_DATA.origin.lng),
        destination: new google.maps.LatLng(
          MOCK_ROUTE_DATA.destination.lat,
          MOCK_ROUTE_DATA.destination.lng
        ),
        waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);

          console.log("Ruta calculada (MOCK):", {
            distancia: result.routes[0].legs.reduce((acc, leg) => acc + (leg.distance?.value || 0), 0),
            duracion: result.routes[0].legs.reduce((acc, leg) => acc + (leg.duration?.value || 0), 0),
            inicio: MOCK_ROUTE_DATA.origin,
            fin: MOCK_ROUTE_DATA.destination,
            paradas: MOCK_ROUTE_DATA.waypoints,
          });
        } else {
          console.error("Error al calcular la ruta:", status);
        }
      }
    );
  }, [isLoaded]);

  useEffect(() => {
    calculateRoute();
  }, [calculateRoute]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  // Función para centrar el mapa en la ubicación del usuario
  const centerOnUser = useCallback(() => {
    if (map && userLocation) {
      map.panTo(userLocation);
      map.setZoom(20); // Zoom más cercano
      setUserHasInteracted(false); // Resetear bandera para seguir centrado automáticamente
      console.log("Mapa centrado en ubicación del usuario");
    }
  }, [map, userLocation]);

  if (loadError) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded">
        Error al cargar Google Maps. Verifica tu API Key.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center" style={{ height: '600px' }}>
        <div className="text-gray-600">Cargando mapa...</div>
      </div>
    );
  }

  return (
    <>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={userLocation || center}
        zoom={20}
        onLoad={onMapLoad}
        onDragStart={() => setUserHasInteracted(true)}
        onZoomChanged={() => {
          if (map) {
            setUserHasInteracted(true);
          }
        }}
        options={{
          mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          zoomControl: false,
          gestureHandling: "greedy",
          tilt: 45,
          heading: 0,
          mapTypeId: "roadmap",
          disableDefaultUI: false,
        }}
      >
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      {/* Botón flotante para centrar en ubicación * / }
        <button
          onClick={centerOnUser}
          className="absolute bottom-24 right-4 bg-white hover:bg-gray-100 text-gray-700 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10 border border-gray-200"
          title="Centrar en mi ubicación"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
        </button>
      )}
    </>
  );
}
*/

// Exportar componente dummy mientras se instala la dependencia
export default function RouteTrackingMap({ routeId, userType }: { routeId?: string; userType?: string }) {
  return <div className="w-full h-96 bg-gray-100 flex items-center justify-center rounded-lg">RouteTrackingMap - pendiente de configuración de Google Maps</div>;
}
