export interface MusicState {
  progress: number;
  message: string;
  text: string;
  showText: boolean;
  musicFileUrl: string;
  base64image: string;
  requestTime: number;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
}
