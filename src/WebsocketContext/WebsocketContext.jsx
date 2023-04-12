import { createContext } from 'react'
import { io } from 'socket.io-client'

export const getSocketHeaders = () => ({
  authorization: `Bearer ${localStorage.getItem('access_token')}`
})

export const socket = io('http://localhost:8080')
export const WebsocketContext = createContext(socket)
export const WebsocketProvider = WebsocketContext.Provider