import { createSlice } from '@reduxjs/toolkit'
export const rootSlice = createSlice({
  name: 'friendListReducer',
  initialState: {
    refresh_list: false,
    conversation_id: null,
    my_id: null,
    chat_title: '',
    replied_message: null
  },
  reducers: {
    refreshFriendList: (state) => {
      state.refresh_list = !state.refresh_list
    },
    setConversationId: (state, action) => {
      console.log('change to conv', action.payload)
      state.conversation_id = action.payload
    },
    setMyId: (state, action) => {
      state.my_id = action.payload
    },
    setChatTitle: (state, action) => {
      state.chat_title = action.payload
    },
    setRepliedMessage: (state, action) => {
      state.replied_message = action.payload
    }
  }
})

export const { refreshFriendList, setConversationId, setMyId, setChatTitle, setRepliedMessage } = rootSlice.actions

export default rootSlice.reducer