import NextAuth from "next-auth";
import { authConfig } from "./lib/auth/authOptions";

export default NextAuth(authConfig);

