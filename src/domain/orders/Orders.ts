import mongoose from "mongoose";

export enum OrderStatus { NEW = 0, CREATED = 1, IN_PROGRESS = 2, FINISHED = 3, CANCELED = 9 }

const orderItemSchema = new mongoose.Schema({
    product: {type: String, required: true},
    price: {type: Number, required: true},
    amount: {type: Number, required: true}
});

const orderStatusHistorySchema = new mongoose.Schema({
    changeDate: {type: Date, required: true},
    prevStatus: {type: Number, required: true},
    currStatus: {type: Number, required: true},
    reason: {type: String},
});

const orderSchema = new mongoose.Schema({
    orderDate: {type: Date, required: true},
    userEmail: {type: String, required: true},
    status: {type: Number, required: true},
    totalPrice: {type: Number, required: true},
    items: [ orderItemSchema ],
    statusHistory: [ orderStatusHistorySchema ]
}, { timestamps: true });

export const OrdersModel = mongoose.model("order", orderSchema);

export interface Order {
    orderDate?: Date,
    userEmail?: string,
    status?: number,
    statusReason?: string,
    totalPrice?: number,
    items?: OrderItem[],
    statusHistory?: OrderStatusHistory[]
}

export interface OrderItem {
    product: string,
    price: number,
    amount: number
}

export interface OrderStatusHistory {
    changeDate: Date,
    prevStatus: number,
    currStatus: number,
    reason?: string
}
