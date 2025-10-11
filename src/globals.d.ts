import type { UserPayload } from "./src/auth/types"; // path to your type

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
export {};
