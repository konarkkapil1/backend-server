import { format, transports } from 'winston';
const { printf, combine } = format;

const logTime = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
const customLog = printf(({ level, message }) => {
    return `Level:[${ level }] LogTime: [${ logTime }] Message:-[${ message }]`
})

const date = new Date()
const newdate = `${ date.getDate() }-${ date.getMonth() }-${ date.getFullYear() }`

const options = {
    info: {
        level: 'info',
        dirname: 'logs',
        json: true,
        handleExceptions: true,
        datePattern: 'YYYY-MM-DD-HH',
        filename: `combined.log`,
    },
    error: {
        level: 'error',
        dirname: 'logs',
        json: true,
        handleExceptions: true,
        filename: `error.log`,
    },
    console: {
        level: 'debug',
        json: false,
        handleExceptions: true,
        colorize: true,
    },
}

const loggerConfig = {
    format: combine(customLog),
    transports: [
        new transports.File(options.info),
        new transports.File(options.error),
        new transports.Console(options.console)
    ]
}

export default loggerConfig;