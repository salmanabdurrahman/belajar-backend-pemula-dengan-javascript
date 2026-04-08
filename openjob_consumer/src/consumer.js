import applicationNotificationConsumer from './consumers/application-notification.consumer.js';
import logger from './config/logger.js';
import { closeRabbitMqConnection } from './shared/libs/rabbitmq.js';

const startConsumer = async () => {
  try {
    await applicationNotificationConsumer.consume();
  } catch (error) {
    logger.error('Failed to start application notification consumer', {
      message: error.message,
    });
    process.exit(1);
  }
};

const gracefulShutdown = async () => {
  await closeRabbitMqConnection();
  process.exit(0);
};

process.on('SIGINT', () => {
  void gracefulShutdown();
});

process.on('SIGTERM', () => {
  void gracefulShutdown();
});

void startConsumer();
