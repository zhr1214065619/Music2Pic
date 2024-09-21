import http from "../../util/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { MusicState } from "../../model/state/MusicStateModel";

// 异步获取音乐信息
export const fetchMusic = createAsyncThunk(
  'music/fetchMusic',
  async (payload: { id: string }) => {
    const response = await http.get(`/music/test`, payload);
    return response.data;
  }
)

export const uploadMusic = createAsyncThunk(
  'music/uploadMusic',
  async (payload: { file: File }) => {
    const formData = new FormData();
    formData.append("file", payload.file);
    const response = await http.post(`/music/saveMusic`, formData);
    return response.data;
  }
)

export const convert2Text = createAsyncThunk(
  'music/convert2Text',
  async (payload: { fileId: string }) => {
    const formData = new FormData();
    formData.append("fileId", payload.fileId);
    const response = await http.post(`/music/convert2Text`, formData);
    return response.data;
  }
)

export const generateImage = createAsyncThunk(
  'music/text2Image',
  async (payload: { text: string }) => {
    const response = await http.post(`/music/text2Image`, payload);
    return response.data;
  }
)

const initialState = {
  progress: 0,
  message: "",
  base64image: "",
  requestTime: 0,
  status: 'idle'
} as MusicState

export const MusicSlice = createSlice({
  name: 'music',
  initialState: initialState,
  reducers: {
    resetProgress: (state) => {
      state.progress = 0;
    },
    updateProgress: (state, action) => {
      state.progress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMusic.pending, (state: MusicState) => {
        // action is inferred correctly here if using TS
        state.requestTime += 1
      })
      // You can chain calls, or have separate `builder.addCase()` lines each time
      .addCase(fetchMusic.fulfilled, (state: MusicState, {payload}) => {
        state.message = payload.message
      })
      .addCase(uploadMusic.pending, (state: MusicState) => {
        state.progress = 1;
      })
      .addCase(uploadMusic.fulfilled, (state: MusicState) => {
        state.progress = 2;
      })
      .addCase(uploadMusic.rejected, (state: MusicState) => {
        state.progress = -1;
      })
      .addCase(convert2Text.fulfilled, (state: MusicState) => {
        state.progress = 3;
      })
      .addCase(convert2Text.rejected, (state: MusicState) => {
        state.progress = -1;
      })
      .addCase(generateImage.fulfilled,(state: MusicState, {payload}) => {
        state.progress = 4;
        state.base64image = payload.base64Image;
      })
      .addCase(generateImage.rejected,(state: MusicState) => {
        state.progress = -1;
      })
  },
})

export const {
  resetProgress,
  updateProgress} = MusicSlice.actions;

export default MusicSlice.reducer;
