import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

const BASE_URL = "http://localhost:9000"

const CitiesContext = createContext()

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentCity, setCurrentCity] = useState(
    {}
  )

  useEffect(() => {
    async function fetchCities() {
      try {
        const res = await fetch(`${BASE_URL}/cities`)
        const data = await res.json()
        setCities(data)
      } catch (error) {
        console.error(
          "Error loading cities:",
          error
        )
      } finally {
        setIsLoading(false)
      }
    }
    fetchCities()
  }, [])

  async function getCity(id) {
    try {
      const res = await fetch(`${BASE_URL}/cities${id}`) // Changed URL
      const data = await res.json()
      setCurrentCity(data)
    } catch (error) {
      console.error("Error loading city:", error)
    }
  }


  async function createCity(newCity) {
    try {
      setIsLoading(true)
      const res = await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json"
        },
      }) // Changed URL
      const data = await res.json()
      setCities((cities)=> [...cities, data])

    } catch (error) {
      console.error("Error loading city:", error)
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity
      }}
    >
      {children}
    </CitiesContext.Provider>
  )
}

function useCities() {
  const context = useContext(CitiesContext)

  if (context === undefined) {
    throw new Error(
      "useCities must be used within a CitiesProvider"
    )
  }
  return context
}

export { CitiesProvider, useCities }
