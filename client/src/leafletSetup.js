import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Map core CSS styles

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Vite bundles and renames image assets with content hashes.
// By default, Leaflet attempts to load markers dynamically via relative paths,
// which breaks in Vite production bundles. We explicitly bind the bundled asset URLs:
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

