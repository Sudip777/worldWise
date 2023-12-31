// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import Button from "./Button";

import styles from "./Form.module.css";
import "react-datepicker/dist/react-datepicker.css"

import Message from "../components/Message"
import Spinner from "../components/Spinner"
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import { useUrlPosition } from "../hooks/useUrlPosition";
import DatePicker from "react-datepicker";
import { useCities } from "../contexts/CitiesContext";
import { create } from "json-server";

export function convertToEmoji(countryCode) {
  console.log("countryCode:", countryCode);

  try {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt());

    console.log("codePoints:", codePoints);

    if (codePoints.length > 0) {
      return String.fromCodePoint(...codePoints);
    } else {
      console.warn("Empty codePoints array. Returning empty string.");
      return "";
    }
  } catch (error) {
    console.error("Error in convertToEmoji:", error);
    return ""; // or provide a default emoji or handle it according to your requirement
  }
}


const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client"


function Form() {
  const [lat, lng] = useUrlPosition()
  const {createCity, isLoading} = useCities();
  const navigate = useNavigate();

  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false)
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState('')
  const [geocodingError, setGeocodingError] = useState()


  useEffect(function(){
    if(!lat && !lng) return;

    async function fetchCityData( ){
      try {
        setIsLoadingGeocoding(true)
        setGeocodingError("")


        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`)
        const data = await res.json();
        console.log("Response data:", data);


        if(!data.countryCode)
        throw new Error(
      "That doesn't seem to be a City. Click somewhere else😉"
      )

        setCityName(data.city || data.locality || "")
        setCountry(data.countryName)
        setEmoji(convertToEmoji(data.countryCode))
         
      } catch (error) {
        setGeocodingError(error.message)
        
      } finally{
        setIsLoadingGeocoding(false)
      }
    }
    fetchCityData();
  },[lat,lng])

  function handleSubmit(e){
    e.preventDefault();

    if(!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position:{lat, lng}

    }
    createCity(newCity)
  }

  if(isLoadingGeocoding) return <Spinner/>

  if(!lat && !lng) return <Message message={'Start by Clicking somewhare on the map'}/>

  if(geocodingError) return <Message message={geocodingError}/>

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">
          City name
        </label>
        <input
          id="cityName"
          onChange={(e) =>
            setCityName(e.target.value)
          }
          value={cityName}
        />
        <span className={styles.flag}>
          {emoji}
        </span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">
          When did you go to {cityName}?
        </label>

        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat={"dd/MM/yyyy"}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">
          Notes about your trip to {cityName}
        </label>
        <textarea
          id="notes"
          onChange={(e) =>
            setNotes(e.target.value)
          }
          value={notes}
        />
      </div>
      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
      {/* 
      <div className={styles.buttons}>
        <BackButton/>
      </div> */}
    </form>
  )
}

export default Form;
