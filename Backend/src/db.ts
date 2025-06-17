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
    balance: {
        type: Number,
        required: true,
        default: 0,
        get: (v: number) => Math.round(v),
        set: (v: number) => Math.round(v)
    }
});

bankSchema.set('toJSON', { getters: true });
bankSchema.set('toObject', { getters: true });

bankSchema.index({ lastName: 1 }, { unique: true });
bankSchema.index({ accountNumber: 1 }, { unique: true });

export const User = mongoose.model('User', userSchema);
export const Bank = mongoose.model('Bank', bankSchema);