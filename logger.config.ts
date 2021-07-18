import { format, transports } from 'winston';
const { timestamp, errors, printf, combine } = format;

const loggerConfig = {
    format: combine(
        timestamp({format: 'YYYY-MM-DD HH::mm:ss'}),
        errors({stack: true}),
        printf(({timestamp, level, message}) => {
            return `${timestamp} ${level}: ${message} `;
        }),
    ),
    transports: [
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/warning.log', level: 'warn' }),
        new transports.File({ filename: 'logs/http.log', level: 'http' }),
        new transports.File({ filename: 'logs/combined.log' }),
        new transports.Console()
    ]
}

export default loggerConfig;