import { configureStore } from '@reduxjs/toolkit'
import MusicReducer from "./modules/music.ts";
import {useDispatch} from "react-redux";
// ...

const store = configureStore({
  reducer: {
    music: MusicReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch

export default store