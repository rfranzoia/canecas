import mongoose from "mongoose";

export enum OrderStatus { NEW = 0, CONFIRMED = 1, IN_PRODUCTION = 2, READY_TO_DELIVER = 3, FINISHED = 8, CANCELED = 9 }

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
    drawings: number,
    drawingsImages?: string,
    background: string,
    backgroundImage?: string,
    price: number,
    amount: number
}

export interface OrderStatusHistory {
    changeDate: Date,
    prevStatus: number,
    currStatus: number,
    reason?: string
}

const orderItemSchema = new mongoose.Schema<OrderItem>({
    product: {type: String, required: true},
    drawings: {type: Number, required: true},
    drawingsImages: {type: String, required: false},
    background: {type: String, required: true},
    backgroundImage: {type: String, required: false},
    price: {type: Number, required: true},
    amount: {type: Number, required: true}
});

const orderStatusHistorySchema = new mongoose.Schema<OrderStatusHistory>({
    changeDate: {type: Date, required: true},
    prevStatus: {type: Number, required: true},
    currStatus: {type: Number, required: true},
    reason: {type: String},
});

const orderSchema = new mongoose.Schema<Order>({
    orderDate: {type: Date, required: true},
    userEmail: {type: String, required: true},
    status: {type: Number, required: true},
    totalPrice: {type: Number, required: true},
    items: [ orderItemSchema ],
    statusHistory: [ orderStatusHistorySchema ]
}, { timestamps: true });

export const OrdersModel = mongoose.model("order", orderSchema);


