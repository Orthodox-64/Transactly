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
    const session = await mongoose.startSession();
    
    try {
        session.startTransaction();
        const { amount, to } = req.body;
        const fromLastName = req.lastName;

        const transferAmount = Number(amount);
        if (isNaN(transferAmount)) {
            await session.abortTransaction();
            res.status(400).json({
                message: "Invalid transfer amount"
            });
            return;
        }

        if (!fromLastName) {
            await session.abortTransaction();
            res.status(401).json({
                message: "Please login to make transfers"
            });
            return;
        }

        const fromAccount = await Bank.findOne({
            lastName: fromLastName
        });

        if (!fromAccount || typeof fromAccount.balance !== 'number') {
            await session.abortTransaction();
            res.status(404).json({
                message: "Your bank account not found"
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

        const toAccount = await Bank.findOne({
            lastName: to
        });

        if (!toAccount || typeof toAccount.balance !== 'number') {
            await session.abortTransaction();
            res.status(404).json({
                message: "Recipient's account not found"
            });
            return;
        }

        const newFromBalance = Number(fromAccount.balance) - transferAmount;
        const newToBalance = Number(toAccount.balance) + transferAmount;

        const [fromUpdate, toUpdate] = await Promise.all([
            Bank.findOneAndUpdate(
                { lastName: fromLastName },
                { $set: { balance: newFromBalance } },
                { new: true, session }
            ),
            Bank.findOneAndUpdate(
                { lastName: to },
                { $set: { balance: newToBalance } },
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
            fromBalance: newFromBalance,
            toBalance: newToBalance
        });
    } catch (error) {
        await session.abortTransaction();
        console.log("Error during transfer:", error);
        res.status(500).json({
            message: "Transfer failed - please try again"
        });
    } finally {
        session.endSession();
    }
});

export default router;