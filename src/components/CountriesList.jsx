import CountryItem from "./CountryItem"
import styles from "./CountriesList.module.css"
import Spinner from "./Spinner"
import Message from "./Message"

export default function CountriesList({
  cities,
  isLoading,
}) {
  if (isLoading) return <Spinner />


  if (!cities) return null 
  if (!cities.length)
    return (
      <Message message="Add your first City by using city on the map" />
    )


    const countries = cities.reduce(
      (arr, city) => {
        if (
          !arr
            .map((el) => el.country)
            .includes(city.country)
        )
          return [
            ...arr,
            {
              country: city.country,
              emoji: city.emoji,
            },
          ]
        else return arr
      },
      []
    )


  return (
    <ul className={styles.countriesList}>
      {countries.map((country) => (
        <CountryItem
          country={country}
          key={country}
        />
      ))}
    </ul>
  )
}
