import winston from 'winston';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    // Console output
    new winston.transports.Console(),
    // File output for errors
    new winston.transports.File({
      filename: 'reports/error.log',
      level: 'error'
    }),
    // File output for all logs
    new winston.transports.File({
      filename: 'reports/combined.log'
    })
  ]
});

// Helper functions for consistent logging
export const logInfo = (message: string) => logger.info(message);
export const logError = (error: Error | string) => {
  if (error instanceof Error) {
    logger.error(`${error.message}\n${error.stack}`);
  } else {
    logger.error(error);
  }
};
export const logDebug = (message: string) => logger.debug(message);
export const logWarning = (message: string) => logger.warn(message);

// Test step logging
export const logStep = (step: string) => {
  logger.info(`Step: ${step}`);
};

export default logger;