export interface MusicState {
  progress: number;
  message: string;
  text: string;
  musicFileId: string;
  musicFileUrl: string;
  base64image: string;
  requestTime: number;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
}
