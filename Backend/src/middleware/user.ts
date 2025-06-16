import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../db";

declare global {
  namespace Express {
    interface Request {
      lastName?: string;
    }
  }
}

export const userMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const headers = req.headers['authorization'];
        if (!headers) {
            res.status(401).json({ msg: "No authorization header" });
            return;
        }

        const decoded = jwt.verify(headers, "123123");
        if (typeof decoded === 'string') {
            res.status(401).json({ msg: "Invalid token" });
            return;
        }

        const user = await User.findById((decoded as JwtPayload).id);
        if (!user || !user.lastName) {
            res.status(401).json({ msg: "User not found" });
            return;
        }

        req.lastName = user.lastName;
        next();
    } catch (error) {
        res.status(401).json({ msg: "Unauthorized" });
    }
};