export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    status: boolean;
    username: string;
    resetToken?: string;
    dateToken?: string;
    password?: string;
    photos?: string;
    role: string;
  }
  