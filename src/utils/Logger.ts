import { createLogger, transports, format } from "winston";

const customFormat = format.combine(format.timestamp(),
    format.printf((info) => {
        return `[${info.level.toUpperCase()}] - ${info.timestamp} - ${info.message}`
    }));

const logger = createLogger({
    format: customFormat,
    transports: [
        new transports.Console()
    ]
});

export default logger;