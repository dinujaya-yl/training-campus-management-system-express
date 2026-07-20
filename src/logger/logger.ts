import winston, { format, transports, type LoggerOptions } from 'winston';
import config from '../env.js';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const getLevel = (): string => {
  switch (config.NODE_ENV) {
    case 'production': return 'info';
    case 'test': return 'warn';
    default: return 'debug';
  }
};

winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  http: 'magenta',
  debug: 'gray',
});

const consoleFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.colorize({ all: true }),
  format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
);

const loggerOptions: LoggerOptions = {
  level: getLevel(),
  levels,
  format: format.json(),
  transports: [
    new transports.Console({ format: consoleFormat }),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
  exitOnError: false,
};

const logger = winston.createLogger(loggerOptions);

(logger as any).stream = {
  write: (message: string) => logger.http(message.trim()),
};

export default logger;