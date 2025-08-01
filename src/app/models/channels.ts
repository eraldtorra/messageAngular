export interface Channel {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;       
  isOnline?: boolean;
 }