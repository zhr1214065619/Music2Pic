import http from "../../util/http";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {MusicState} from "../../model/state/MusicStateModel";

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
  async (payload: { fileUrl: string }) => {
    console.log(payload.fileUrl)
    const formData = new FormData();
    formData.append("fileUrl", payload.fileUrl);
    const response = await http.post(`/music/convert2Text`, formData);
    return response.data;
  }
)

export const generateImage = createAsyncThunk(
  'music/text2Image',
  async (payload: {prompt: string, analyzeResult: string}) => {
    const response = await http.post(`/music/text2Image`, payload);
    return response.data;
  }
)

const initialState = {
  progress: 0,
  message: "音楽ファイルをアップロードしてください。",
  musicFileUrl: "",
  text: "",
  showText: false,
  base64image: "",
  status: 'idle'
} as MusicState;

export const MusicSlice = createSlice({
  name: 'music',
  initialState: initialState,
  reducers: {
    changeShowText: (state) => {
      state.showText = !state.showText;
    },
    refreshMusic: (state, action) => {
      state.musicFileUrl = action.payload;
    },
    resetProgress: (state) => {
      state.progress = 0;
      state.base64image = "";
      state.musicFileUrl = "";
      state.message = "音楽ファイルをアップロードしてください。";
    },
    updateProgress: (state, action) => {
      state.progress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadMusic.pending, (state: MusicState) => {
        state.progress = 1;
        state.message = "アップロード中...";
      })
      .addCase(uploadMusic.fulfilled, (state: MusicState, {payload}) => {
        state.progress = 2;
        state.musicFileUrl = payload.fileUrl;
        console.log(payload.fileUrl);
        state.message = "アップロード完了しました。画像生成してください。";
      })
      .addCase(uploadMusic.rejected, (state: MusicState) => {
        state.progress = -1;
        state.message = "アップロード失敗しました。";
      })
      .addCase(convert2Text.pending, (state: MusicState) => {
        state.progress = 3;
        state.message = "音声分析中...";
      })
      .addCase(convert2Text.fulfilled, (state: MusicState, {payload}) => {
        state.progress = 4;
        state.text = payload.analyzeResult;
        state.message = "画像生成中...";
      })
      .addCase(convert2Text.rejected, (state: MusicState) => {
        state.progress = -1;
        state.message = "音声分析失敗しました。";
      })
      .addCase(generateImage.fulfilled,(state: MusicState, {payload}) => {
        state.progress = 5;
        state.base64image = payload.base64Image;
        state.message = "画像生成完了しました。";
      })
      .addCase(generateImage.rejected,(state: MusicState) => {
        state.progress = -1;
        state.message = "画像生成失敗しました。";
      })
  },
})

export const {
  changeShowText,
  refreshMusic,
  resetProgress
} = MusicSlice.actions;

export default MusicSlice.reducer;
