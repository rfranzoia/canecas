import {OrdersHistory} from "../entity/OrdersHistory";

export class OrderHistoryDTO {
    changeDate: Date;
    previousStatus: string;
    currentStatus: string;
    changeReason: string;

    constructor(changeDate: Date, previousStatus: string, currentStatus: string, changeReason: string) {
        this.changeDate = changeDate;
        this.previousStatus = previousStatus;
        this.currentStatus = currentStatus;
        this.changeReason = changeReason;
    }

    static mapToDTO(history: OrdersHistory): OrderHistoryDTO {
        return new OrderHistoryDTO(history.changeDate, history.previousStatus, history.currentStatus, history.changeReason);
    }

    static mapToListDTO(historyList: OrdersHistory[]): OrderHistoryDTO[] {
        return historyList.map(oh => OrderHistoryDTO.mapToDTO(oh));
    }
}