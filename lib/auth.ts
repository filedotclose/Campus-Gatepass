import { cookies } from "next/headers";
import { verifyAccessToken } from "./jwt";
import { connectDB } from "./db";
import User  from "@/models/User";
import {IUser} from "@/types/user"
export async function getUserFromToken() : Promise<IUser | null> {
  try {
    const cookieStore = await cookies();
    const token =  cookieStore.get("accessToken")?.value;

    if (!token) return null;

    const decoded: any = verifyAccessToken(token);

    await connectDB();
    const user = await User.findById(decoded.id).select("-passwordHash");

    return user?.toObject() ?? null ;
  } catch {
    return null;
  }
}
