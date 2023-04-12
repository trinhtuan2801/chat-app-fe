import { configureStore } from '@reduxjs/toolkit'
import friendListReducer from './friendListReducer'
import rootReducer from './rootReducer'

export default configureStore({
  reducer: {
    root: rootReducer,
    friendList: friendListReducer
  }
})