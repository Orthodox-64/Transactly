import { Router, Request, Response, NextFunction } from "express";
import { userMiddleware } from "../middleware/user";
import { Bank } from "../db";
import mongoose from "mongoose";

const router = Router();

router.get('/balance', userMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const lastName = req.lastName;
    
    if (!lastName) {
        res.status(401).json({
            message: "Please login to access your account"
        });
        return;
    }

    try {
        const bank = await Bank.findOne({
            lastName
        });

        if (!bank || typeof bank.balance !== 'number') {
            res.status(404).json({
                message: "No bank account found"
            });
            return;
        }

        res.json({
            message: "Balance retrieved successfully",
            bankBalance: bank.balance
        });
    } catch (error) {
        console.log("Error fetching balance:", error);
        res.status(500).json({
            message: "Failed to fetch balance"
        });
    }
});

router.post('/transfer', userMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const { amount, to } = req.body;
        const fromLastName = req.lastName;

        if (!fromLastName) {
            await session.abortTransaction();
            res.status(401).json({
                message: "Please login to make transfers"
            });
            return;
        }

        const transferAmount = Number(amount);
        if (isNaN(transferAmount) || transferAmount <= 0) {
            await session.abortTransaction();
            res.status(400).json({
                message: "Invalid transfer amount"
            });
            return;
        }

        // Find both accounts in parallel
        const [fromAccount, toAccount] = await Promise.all([
            Bank.findOne({ lastName: fromLastName }).session(session),
            Bank.findOne({ lastName: to }).session(session)
        ]);

        if (!fromAccount) {
            await session.abortTransaction();
            res.status(404).json({
                message: "Your bank account not found"
            });
            return;
        }

        if (!toAccount) {
            await session.abortTransaction();
            res.status(404).json({
                message: "Recipient's account not found"
            });
            return;
        }

        if (fromAccount.balance < transferAmount) {
            await session.abortTransaction();
            res.status(400).json({
                message: "Insufficient balance for transfer"
            });
            return;
        }

        // Update both accounts in parallel
        const [fromUpdate, toUpdate] = await Promise.all([
            Bank.findOneAndUpdate(
                { lastName: fromLastName },
                { $inc: { balance: -transferAmount } },
                { new: true, session }
            ),
            Bank.findOneAndUpdate(
                { lastName: to },
                { $inc: { balance: transferAmount } },
                { new: true, session }
            )
        ]);

        if (!fromUpdate || !toUpdate) {
            await session.abortTransaction();
            res.status(500).json({
                message: "Transfer failed - please try again"
            });
            return;
        }

        await session.commitTransaction();
        res.json({
            message: "Transfer completed successfully",
            fromBalance: fromUpdate.balance,
            toBalance: toUpdate.balance
        });
    } catch (error) {
        if (session) {
            await session.abortTransaction();
        }
        console.error("Error during transfer:", error);
        res.status(500).json({
            message: "Transfer failed - please try again"
        });
    } finally {
        if (session) {
            session.endSession();
        }
    }
});

export default router;