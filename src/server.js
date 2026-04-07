import app from './app.js';
import config from './config/env.js';
import logger from './config/logger.js';

const start = async () => {
  try {
    app.listen(config.port, config.host, () => {
      logger.info(`Server running at http://${config.host}:${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

start();
