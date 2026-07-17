import morgan, { type StreamOptions } from 'morgan';
import logger from './logger.js';

const format = ':remote-addr :method :url :status :res[content-length] - :response-time ms';

const stream: StreamOptions = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

const morganLogger = morgan(format, { stream });

export default morganLogger;