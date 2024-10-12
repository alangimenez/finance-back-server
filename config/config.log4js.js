/* const log4js = require('log4js');

log4js.configure({
    appenders: {
        console: { type: 'console' },
        // infoFile: {type: 'file', filename: 'infoLog/info.log'},
        // warningsFile: {type: 'file', filename: 'infoLog/warn.log'},
        errorsFile: { type: 'file', filename: 'log/error.log' }
    },
    categories: {
        default: { appenders: ['console'], level: 'info' },
        //infoFile: {appenders: ['infoFile'], level: 'info'},
        // warningsFile: {appenders: ['console','warningsFile'], level: 'warn'},
        error: { appenders: ['console', 'errorsFile'], level: 'error' },
    }
})

const logger = log4js.getLogger();
// const infoLogger = log4js.getLogger('infoFile');
// const warningLogger = log4js.getLogger('warningsFile');
const errorLogger = log4js.getLogger('error');

module.exports = {
    logger,
    //infoLogger,
    // warningLogger,
    errorLogger
} */