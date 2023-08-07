import {
  createContext,
  useEffect,
  useState,
} from "react"
const BASE_URL = "http://localhost:9000/cities"

const CitiesContext = createContext()

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(function () {
    async function fetchCities() {
      try {
        const res = await fetch(`${BASE_URL}`)
        const data = await res.json()
        setCities(data)
      } catch {
        alert(
          "There was an error loading data..."
        )
      } finally {
        setIsLoading(false)
      }
    }
    fetchCities()
  }, [])

  return (
    <CitiesContext.Provider
      value={{ cities, isLoading }}
    >
      {children}
    </CitiesContext.Provider>
  )
}

export {CitiesProvider}
