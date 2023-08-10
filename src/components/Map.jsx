import {
  useNavigate,
  useSearchParams,
} from "react-router-dom"
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet"

import styles from "./Map.module.css"
import Button from "./Button"
import { useEffect, useState } from "react"
import { useCities } from "../contexts/CitiesContext"
import { useGeolocation } from "../hooks/useGeolocation"
import { useUrlPosition } from "../hooks/useUrlPosition"

export default function Map() {
  const navigate = useNavigate()
  const { cities } = useCities()

  const [mapPosition, setMapPosition] = useState([
    25, 70,
  ])
  const [searchParams] = useSearchParams()
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation()

  const [mapLat, mapLng] = useUrlPosition();


  useEffect(function(){
     if (mapLat & mapLng)
       setMapPosition([mapLat, mapLng])
  },[mapLat, mapLng])


  useEffect(function(){
    if(geolocationPosition) 
    setMapPosition([geolocationPosition.lat, geolocationPosition.lng])
  }, [geolocationPosition])

  return (
    <div
      className={styles.mapContainer}
      >
         {!geolocationPosition && <Button type="position" onClick={getPosition}>
            {isLoadingPosition ? "Loading...": "Use your position"}
            </Button>}
      <MapContainer
        center={mapPosition}
        zoom={9}
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
  const map = useMap()
  map.setView(position)
  return null
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
