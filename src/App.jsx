import { Box } from '@mui/material'
import { useContext, useEffect, useState } from "react"
import { Route, Routes, useNavigate } from 'react-router-dom'
import { BASE_API } from "./constants"
import HomePage from "./pages/HomePage/HomePage"
import LoginPage from "./pages/LoginPage/LoginPage"
import Navbar from "./pages/Navbar/Navbar"
import "./styles.css"
import { axiosGet, axiosPost } from "./utils/axiosUtils"
import { useSelector, useDispatch } from 'react-redux'
import './styles/CustomScrollBar.css'
import './styles/Draggable.css'
import { refreshNavbar, setSignedIn, setTokenTimeout } from './redux/rootReducer'
import { getDurationFromStr } from './utils/timeUtils'
import { useRef } from 'react'
import ProtectedRoute from './RouteWrapper/ProtectedRoute'
import { getSocketHeaders, WebsocketContext } from './WebsocketContext/WebsocketContext'

export const setNewTokens = (access_token, refresh_token) => {
  localStorage.setItem('access_token', access_token)
  localStorage.setItem('refresh_token', refresh_token)
}

const App = () => {
  const { token_timeout, signed_in } = useSelector(state => state.root)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const tokenTimer = useRef()
  const [firstCheck, setFirstCheck] = useState(false)
  const socket = useContext(WebsocketContext)
  const getNewTokens = async () => {
    const response = await axiosPost(`${BASE_API}/auth/access-token`, {
      refresh_token: localStorage.getItem('refresh_token')
    })
    if (response && response.success) {
      dispatch(setSignedIn(true))
      dispatch(refreshNavbar())
      const { access_token, refresh_token, expireIn } = response.data
      setNewTokens(access_token, refresh_token)
      tokenTimer.current = setTimeout(() => {
        dispatch(setTokenTimeout())
      }, getDurationFromStr(expireIn) / 2)
    } else {
      navigate('/login')
    }
  }

  useEffect(() => {
    getNewTokens().then(_ => {
      if (!firstCheck) {
        console.log('first check')
        setFirstCheck(true)
      }
    })
    return clearTimeout(tokenTimer.current)
  }, [token_timeout])

  useEffect(() => {
    if (signed_in) {
      socket.emit('joinServer', {
        headers: getSocketHeaders()
      })
    }

  }, [signed_in])

  return (
    <>
      {firstCheck &&
        <Box
          width='100%'
          height='100%'
          bgcolor='white'
        >
          <Navbar />
          <Routes>
            <Route element={<ProtectedRoute isAllowed={signed_in} />}>
              <Route path="/" element={<HomePage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Box >
      }
    </>
  )
}

export default App