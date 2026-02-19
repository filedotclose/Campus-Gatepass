export type Role = "student" | "warden" | "librarian";

export interface IUser {
  _id: string;
  name: string;
  rollNo: string;
  email: string;
  role: Role;
}
