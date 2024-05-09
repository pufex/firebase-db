import { Route, Routes } from "react-router-dom"

import Nav from "./components/Nav/Nav"

import Home from "./pages/Home/Home"
import Dashboard from "./pages/Dashboard/Dashboard"
import AddProduct from "./pages/AddProduct/AddProduct"
import Register from "./pages/Register/Register"
import Login from "./pages/Login/Login"
import Profile from "./pages/Profile/Profile"
import AllUsers from "./pages/AllUsers/AllUsers"
import ErrorPage from "./pages/ErrorPage/ErrorPage"
import ResetPassword from "./pages/ResetPassword/ResetPassword"

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
              element={<Dashboard />}
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
            <Route
              path="/reset-password"
              element={<ResetPassword />}
            />
            <Route
              path="/*"
              element={<ErrorPage />}
            />
        </Routes>
      </DatabaseProvider>
    </ThemeProvider>
  </IconsProvider>
}

export default App
