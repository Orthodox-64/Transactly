import { Router, Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { Bank, User } from '../db';
import { userMiddleware } from '../middleware/user';
import { Types } from "mongoose";

const router = Router();
const JWT_PASSWORD = "123123";

router.post('/signup', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;
    
    try {
        const existingUser = await User.findOne({ firstName, lastName });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists with this name' });
            return;
        }

        const user = await User.create({
            firstName,
            lastName,
            password
        });
        
        await Bank.create({
            userId: user._id,
            accountNumber: Math.floor(100000 + Math.random() * 9000000),
            lastName: lastName,
            balance: 500
        });

        res.json({ message: "Account created successfully" });
    } catch (error) {
        console.log("Error creating User", error);
        res.status(401).json({ message: "Failed to create account" });
    }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const password = req.body.password;
        
        const user = await User.findOne({
            firstName,
            lastName,
        });

        if (!user) {
            res.status(404).json({ message: "No account found with these details" });
            return;
        }

        const token = jwt.sign({
            id: user._id,
        }, JWT_PASSWORD, {
            expiresIn: '24h'
        });

        res.json({ 
            message: "Login successful",
            token 
        });
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({ message: "Login failed" });
    }
});

router.put('/update', userMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    try {
        const result = await User.updateOne(
            { lastName: req.lastName },
            { $set: { firstName, lastName } }
        );

        if (result.matchedCount === 0) {
            res.status(404).json({ message: "Account not found" });
            return;
        }

        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        console.log("Error updating", error);
        res.status(500).json({ message: "Failed to update profile" });
    }
});

router.get('/getUser', userMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await User.findOne({ lastName: req.lastName });
        
        if (!user) {
            res.status(404).json({ message: "Account not found" });
            return;
        }

        res.json({
            message: "Profile retrieved successfully",
            firstName: user.firstName,
            lastName: user.lastName
        });
    } catch (error) {
        console.log("Error Fetching User", error);
        res.status(500).json({ message: "Failed to fetch profile" });
    }
});

export default router;