import {
  useNavigate,
  useSearchParams,
} from "react-router-dom"
import styles from "./Map.module.css"
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet"
import { useEffect, useState } from "react"
import { useCities } from "../contexts/CitiesContext"

export default function Map() {
  const navigate = useNavigate()
  const { cities } = useCities()

  const [mapPosition, setMapPosition] = useState([
    25, 70,
  ])

  const [searchParams] = useSearchParams()
  const mapLat = parseFloat(
    searchParams.get("lat")
  ) // Parse as float
  const mapLng = parseFloat(
    searchParams.get("lng")
  ) // Parse as float

  useEffect(
    function () {
      if (mapLat && mapLng)
        setMapPosition([mapLat, mapLng])
    },
    [mapLat, mapLng]
  )

  return (
    <div
      className={styles.mapContainer}
      onClick={() => {
        navigate("form")
      }}
    >
      <MapContainer
        center={mapPosition}
        zoom={8}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[
              city.position.lat,
              city.position.lng,
            ]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}

        <ChangeMapPointer
          position={mapPosition}
        />
        <DetectClick />
      </MapContainer>
    </div>
  )
}

function ChangeMapPointer({ position }) {
  const map = useMap();
    map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate()

  useMapEvents({
    click: (e) => {
      const newLat = e.latlng.lat
      const newLng = e.latlng.lng

      navigate(`form?lat=${newLat}&lng=${newLng}`)
    },
  })

  return null
}