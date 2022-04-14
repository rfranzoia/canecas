import mongoose from "mongoose";

export enum Role { ADMIN = "ADMIN", USER = "USER", GUEST = "GUEST" }

const schema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    phone: { type: String},
    address: { type: String }
}, { timestamps: true });

export const UserModel = mongoose.model("user", schema);

export interface User {
    name?: string;
    email?: string;
    password?: string;
    role?: string
    phone?: string;
    address?: string;
    authToken?: string;
}
