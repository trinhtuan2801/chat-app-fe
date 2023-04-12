import { createSlice } from '@reduxjs/toolkit'
export const rootSlice = createSlice({
  name: 'root',
  initialState: {
    signed_in: false,
    refresh_navbar: false,
    token_timeout: false
  },
  reducers: {
    setSignedIn: (state, action) => {
      state.signed_in = action.payload
    },
    refreshNavbar: (state) => {
      state.refresh_navbar = !state.refresh_navbar
    },
    setTokenTimeout: (state) => {
      state.token_timeout = !state.token_timeout
    }
  }
})

export const { setSignedIn, refreshNavbar, setTokenTimeout } = rootSlice.actions

export default rootSlice.reducer