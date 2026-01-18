import { configureStore } from '@reduxjs/toolkit'
import userRedcuer from '../features/users/userSlice.js'
import messagesReducer from '../features/messages/messageSlice.js'
import connectionsReducer from '../features/connections/connectionSlice.js'

export const store = configureStore({
  reducer:{
    user:userRedcuer,
    messages:messagesReducer,
    connections:connectionsReducer
  }
})