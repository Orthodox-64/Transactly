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
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: "No authorization header or invalid format" });
            return;
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: "No token provided" });
            return;
        }

        const decoded = jwt.verify(token, "123123");
        if (typeof decoded === 'string') {
            res.status(401).json({ message: "Invalid token" });
            return;
        }

        const user = await User.findById((decoded as JwtPayload).id);
        if (!user || !user.lastName) {
            res.status(401).json({ message: "User not found" });
            return;
        }

        req.lastName = user.lastName;
        next();
    } catch (error) {
        console.error("Auth error:", error);
        res.status(401).json({ message: "Unauthorized" });
    }
};