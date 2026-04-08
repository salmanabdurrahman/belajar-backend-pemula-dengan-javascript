import amqp from 'amqplib';
import config from '../../config/env.js';
import logger from '../../config/logger.js';

const applicationNotificationQueue = 'application_notifications';

let rabbitConnection = null;
let rabbitChannel = null;
let rabbitChannelPromise = null;

const buildRabbitMqUrl = () => {
  if (config.rabbitMqUser && config.rabbitMqPassword) {
    const user = encodeURIComponent(config.rabbitMqUser);
    const password = encodeURIComponent(config.rabbitMqPassword);
    return `amqp://${user}:${password}@${config.rabbitMqHost}:${config.rabbitMqPort}`;
  }

  return `amqp://${config.rabbitMqHost}:${config.rabbitMqPort}`;
};

const resetRabbitState = () => {
  rabbitConnection = null;
  rabbitChannel = null;
};

const createRabbitChannel = async () => {
  const connection = await amqp.connect(buildRabbitMqUrl());
  connection.on('error', (error) => {
    logger.warn('RabbitMQ connection error', { message: error.message });
  });
  connection.on('close', () => {
    logger.warn('RabbitMQ connection closed');
    resetRabbitState();
  });

  const channel = await connection.createChannel();
  await channel.assertQueue(applicationNotificationQueue, {
    durable: true,
  });

  rabbitConnection = connection;
  rabbitChannel = channel;
  logger.info('RabbitMQ channel ready');

  return channel;
};

const getRabbitMqChannel = async () => {
  if (!config.rabbitMqHost) {
    return null;
  }

  if (rabbitChannel) {
    return rabbitChannel;
  }

  if (!rabbitChannelPromise) {
    rabbitChannelPromise = createRabbitChannel()
      .catch((error) => {
        logger.warn('RabbitMQ is unavailable', { message: error.message });
        resetRabbitState();
        return null;
      })
      .finally(() => {
        rabbitChannelPromise = null;
      });
  }

  return rabbitChannelPromise;
};

const closeRabbitMqConnection = async () => {
  try {
    if (rabbitChannel) {
      await rabbitChannel.close();
    }

    if (rabbitConnection) {
      await rabbitConnection.close();
    }
  } catch (error) {
    logger.warn('Failed to close RabbitMQ connection', {
      message: error.message,
    });
  } finally {
    resetRabbitState();
  }
};

export {
  applicationNotificationQueue,
  closeRabbitMqConnection,
  getRabbitMqChannel,
};
