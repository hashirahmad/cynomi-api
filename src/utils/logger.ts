import config from '@/config'
import winston from 'winston'

class logger {
    private readonly levels = {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4,
    }
    private readonly colors = {
        error: 'bold red',
        warn: 'italic yellow',
        info: 'green',
        http: 'blue',
        debug: 'magenta',
    }

    /**
     * Given an err stack, it will return only the part
     * of error stack that refers to actual source files.
     * Basically the file that actually threw the immediate
     * error.
     */
    private getUsefulErrStack(stack: string) {
        const lines = stack.split('\n')
        const usefulLines = lines.filter(
            line =>
                !line.includes('node_modules') &&
                !line.includes('<anonymous>') &&
                !line.includes('new ApiError'),
        )
        return usefulLines.join('\n')
    }

    private readonly format = winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:SSSS' }),
        winston.format.prettyPrint(),
        winston.format.splat(),
        winston.format.align(),
        winston.format.errors({ stack: true }),
        winston.format.printf(
            ({ level, timestamp, message, stack, ...rest }) => {
                let restString = JSON.stringify(rest, null, 4)
                restString = restString === '{}' ? '' : restString
                const usefulErrStack = this.getUsefulErrStack(stack || '')
                return `${timestamp} ${level} ${message} ${usefulErrStack} ${restString}`
            },
        ),
    )
    private readonly transports = [
        new winston.transports.Console(),
        ...Object.keys(this.levels).map(
            logLevel =>
                new winston.transports.File({
                    filename: `logs/${logLevel}.log`,
                    level: logLevel,
                }),
        ),
    ]
    private logger

    constructor() {
        winston.addColors(this.colors)
        this.logger = winston.createLogger({
            /**
             * This is the minimum level that the logs will be outputted to the console
             * and the file. On production, we are also printing everything apart from
             * debug. It can be `warn` so it only prints warnings or errors.
             */
            level: config.IS_PROD ? 'info' : 'debug',
            levels: this.levels,
            format: this.format,
            transports: this.transports,
            /**
             * This is when our code throws an error like `throw new Error` and
             * it will be recoded automatically in the exceptions log file.
             */
            exceptionHandlers: [
                new winston.transports.File({ filename: 'logs/exception.log' }),
            ],
            /**
             * Any `async` function that got rejected which was not handled carefully.
             */
            rejectionHandlers: [
                new winston.transports.File({
                    filename: 'logs/rejections.log',
                }),
            ],
        })
    }

    /** Information related logs only */
    public info(message: string, details?: object) {
        this.logger.info(message, details)
    }

    /** Error related logs only */
    public err(message: string, details?: object) {
        this.logger.error(message, details)
    }

    /** Warning related logs only */
    public warn(message: string, details?: object) {
        this.logger.warn(message, details)
    }

    /**
     * Http related logs only
     */
    public http(message: string, details?: object) {
        this.logger.http(message, details)
    }

    /** Debug related logs only */
    public debug(message: string, details?: object) {
        this.logger.debug(message, details)
    }
}

export default new logger()
