import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  // useSearchParams,
} from "react-router-dom"

import Product from "./pages/Product"
import HomePage from "./pages/HomePage"
import Pricing from "./pages/Pricing"
import PageNotFound from "./pages/PageNotFound"
import AppLayout from "./pages/AppLayout"
import Login from "./pages/Login"
import CityList from "./components/CityList"
import CountriesList from "./components/CountriesList"
import City from "./components/City"
import Form from "./components/Form"
import { CitiesProvider } from "./contexts/CitiesContext"

export default function App() {
  return (
    <CitiesProvider>
      <BrowserRouter>
        <Routes>
          <Route
            index
            element={<HomePage />}
          />
          <Route
            path="product"
            element={<Product />}
          />
          <Route
            path="pricing"
            element={<Pricing />}
          />
          <Route
            path="login"
            element={<Login />}
          />
          <Route
            path="app"
            element={<AppLayout />}
          >
            {/* Index Route is default child route when none is matched*/}
            <Route
              index
              element={
                <Navigate
                  to="cities"
                  replace
                />
              }
            />

            <Route
              path="cities"
              element={
                <CityList
                  cities={cities}
                  isLoading={isLoading}
                />
              }
            />
            <Route
              path="cities/:id"
              element={<City />}
            />

            <Route
              path="countries"
              element={
                <CountriesList
                  cities={cities}
                  isLoading={isLoading}
                />
              }
            />
            <Route
              path="form"
              element={<Form />}
            />
          </Route>

          <Route
            path="*"
            element={<PageNotFound />}
          />
        </Routes>
      </BrowserRouter>
    </CitiesProvider>
  )
}
