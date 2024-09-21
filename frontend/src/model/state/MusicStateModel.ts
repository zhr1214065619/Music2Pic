export interface MusicState {
  progress: number;
  message: string;
  base64image: string;
  requestTime: number;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
}
