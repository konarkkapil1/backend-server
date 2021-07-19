import { format, transports } from 'winston';
const { timestamp, errors, printf, combine, json } = format;

const loggerConfig = {
    format: json(),
    transports: [
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/warning.log', level: 'warn' }),
        new transports.File({ filename: 'logs/http.log', level: 'http' }),
        new transports.File({ filename: 'logs/combined.log' }),
        new transports.Console()
    ]
}

export default loggerConfig;