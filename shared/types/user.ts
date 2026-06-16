export interface User {
  id: number;
  fullName: string;
  phone: number;
  email: string;
  login: string;
  role: "admin" | "user";
}

export type SessionUser = Pick<User, "id" | "login" | "role">;
