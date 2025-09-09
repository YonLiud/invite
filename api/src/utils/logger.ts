import winston from "winston";
import path from "path";

const logsDir = path.join(__dirname, "../../logs");
import fs from "fs";
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
    ),
    defaultMeta: { service: "invite-api" },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
            ),
        }),

        new winston.transports.File({
            filename: path.join(logsDir, "combined.log"),
        }),

        new winston.transports.File({
            filename: path.join(logsDir, "error.log"),
            level: "error",
        }),
    ],
});

export default logger;
