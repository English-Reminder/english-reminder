import * as winston from 'winston'

const logger = winston.createLogger({
  format: winston.format.combine(
    // winston.format.colorize(),
    winston.format.label({ label: 'default' }),
    winston.format.timestamp(),
    winston.format.logstash()
  ),
//   defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
        level: 'debug'
    })
  ],
});

export {
  logger
}