import { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  CircleMarker,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import '../leafletSetup';
import { listingLatLng } from '../utils/geo';

/**
 * Moves the map viewport smoothly when the search center coordinates change.
 * Must be rendered as a child of MapContainer to access the Leaflet map context via useMap().
 */
function Recenter({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (typeof lat === 'number' && typeof lng === 'number') {
      map.setView([lat, lng]); // Preserves current zoom level while panning
    }
  }, [map, lat, lng]);
  return null;
}

/**
 * Allows the user to click anywhere on the map to set a new custom search center.
 * Must be rendered as a child of MapContainer to access useMapEvents().
 */
function ClickToPick({ onPick }) {
  useMapEvents({
    click(e) {
      if (onPick) {
        onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
}

/**
 * ListingMap: Interactive map displaying:
 * - Search center point (Blue CircleMarker)
 * - Search radius boundary (Green Circle)
 * - Available food donation pins (Markers with Popups)
 */
export default function ListingMap({ center, radiusKm, listings = [], onPick }) {
  if (!center || typeof center.lat !== 'number' || typeof center.lng !== 'number') {
    return null;
  }

  return (
    <div className="w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        scrollWheelZoom={false}
        className="h-80 w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Recenter lat={center.lat} lng={center.lng} />
        {onPick && <ClickToPick onPick={onPick} />}

        {/* Search radius visualization (Leaflet Circle takes radius in METERS) */}
        <Circle
          center={[center.lat, center.lng]}
          radius={radiusKm * 1000}
          pathOptions={{
            color: '#059669', // Emerald 600
            fillColor: '#10b981', // Emerald 500
            fillOpacity: 0.12,
            weight: 1.5,
          }}
        />

        {/* Current user / search center position indicator */}
        <CircleMarker
          center={[center.lat, center.lng]}
          radius={7}
          pathOptions={{
            color: '#ffffff',
            fillColor: '#2563eb', // Blue 600
            fillOpacity: 1,
            weight: 2,
          }}
        />

        {/* Listing markers */}
        {listings.map((listing) => (
          <Marker key={listing._id} position={listingLatLng(listing)}>
            <Popup>
              <div className="text-sm p-1">
                <p className="font-bold text-gray-900">{listing.title}</p>
                <p className="text-emerald-700 font-semibold">{listing.quantity} meals available</p>
                {listing.pickupAddress && (
                  <p className="text-xs text-gray-600 mt-1">{listing.pickupAddress}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

