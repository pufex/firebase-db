import { Route, Routes } from "react-router-dom"

import Nav from "./components/Nav/Nav"

import Home from "./pages/Home/Home"
import AllProducts from "./pages/AllProducts/AllProducts"
import AddProduct from "./pages/AddProduct/AddProduct"

import DatabaseProvider from "./contexts/Database"
import ThemeProvider from "./contexts/Theme"
import IconsProvider from "./contexts/Icon"

import "./assets/App.css"

function App() {

  return <IconsProvider>
    <ThemeProvider>
      <DatabaseProvider>
        <Nav />
        <Routes>
            <Route
              path="/"
              element={<Home />}
            />
            <Route
              path="/all-products"
              element={<AllProducts />}
            />
            <Route
              path="/add-product"
              element={<AddProduct />}
            />
        </Routes>
      </DatabaseProvider>
    </ThemeProvider>
  </IconsProvider>
}

export default App
