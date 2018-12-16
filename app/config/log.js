import log4js from 'log4js'

log4js.configure({
    appenders: {
        cheeseLogs: {
            type: 'dateFile',
            filename: __dirname + "/../../logs/app.service",
            pattern: "[yyyy-MM-dd].log"
        },
        console: { type: 'console' }
    },
    categories: {
        cheese: { appenders: ['cheeseLogs'], level: 'error' },
        another: { appenders: ['console'], level: 'trace' },
        default: { appenders: ['console', 'cheeseLogs'], level: 'trace' }
    }
})

const logger = log4js.getLogger('console')
console.log = logger.info.bind(logger)
console.error = logger.error.bind(logger)
console.warn = logger.warn.bind(logger)
console.debug = logger.debug.bind(logger)
console.trace = logger.trace.bind(logger)