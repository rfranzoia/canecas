"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderHistoryDTO = void 0;
class OrderHistoryDTO {
    constructor(changeDate, previousStatus, currentStatus, changeReason) {
        this.changeDate = changeDate;
        this.previousStatus = previousStatus;
        this.currentStatus = currentStatus;
        this.changeReason = changeReason;
    }
    static mapToDTO(history) {
        return new OrderHistoryDTO(history.changeDate, history.previousStatus, history.currentStatus, history.changeReason);
    }
    static mapToListDTO(historyList) {
        return historyList.map(oh => OrderHistoryDTO.mapToDTO(oh));
    }
}
exports.OrderHistoryDTO = OrderHistoryDTO;
//# sourceMappingURL=OrderHistoryDTO.js.map