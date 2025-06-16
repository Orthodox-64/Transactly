import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    password: String
});

const bankSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    accountNumber: Number,
    lastName: String,
    balance: Number
});

export const User = mongoose.model('User', userSchema);
export const Bank = mongoose.model('Bank', bankSchema);