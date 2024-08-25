import http from "../../util/http";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MusicState } from "../../model/state/MusicStateModel";
import type {AxiosResponse} from "axios";

// 异步获取音乐信息
export const fetchMusic = createAsyncThunk(
  'music/fetchMusic',
  async (payload: { id: string }) => {
    const response = await http.get(`/music/test`, { params: payload });
    return response.data;
  }
)

export const MusicSlice = createSlice({
  name: 'music',
  initialState: {
    message: "",
    requestTime: 0,
    status: 'idle'
  } as MusicState,
  reducers: {
    updateState: (state, action: PayloadAction<MusicState>) => {
      state = action;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMusic.pending, (state: MusicState, {payload}) => {
        // action is inferred correctly here if using TS
        state.requestTime += 1
      })
      // You can chain calls, or have separate `builder.addCase()` lines each time
      .addCase(fetchMusic.fulfilled, (state: MusicState, {payload}) => {
        state.message = (payload as AxiosResponse).data;
      })
  },
})

export const {} = MusicSlice.actions;

export default MusicSlice.reducer;
