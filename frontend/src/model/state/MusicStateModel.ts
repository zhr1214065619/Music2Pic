export interface MusicState {
  message: string;
  requestTime: number;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
}