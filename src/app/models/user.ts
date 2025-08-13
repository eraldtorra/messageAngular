export interface User {
  id?: string;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'away';
  memberSince?: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  avatar?: string;
}
