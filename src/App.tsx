import { Route, Routes } from "react-router-dom"

import Nav from "./components/Nav/Nav"

import Home from "./pages/Home/Home"
import AllProducts from "./pages/AllProducts/AllProducts"
import AddProduct from "./pages/AddProduct/AddProduct"
import Register from "./pages/Register/Register"
import Login from "./pages/Login/Login"
import Profile from "./pages/Profile/Profile"
import AllUsers from "./pages/AllUsers/AllUsers"

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
            <Route
              path="/register"
              element={<Register />}
            />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/profile"
              element={<Profile />}
            />
            <Route
              path="/all-users"
              element={<AllUsers />}
            />
        </Routes>
      </DatabaseProvider>
    </ThemeProvider>
  </IconsProvider>
}

export default App
