import logger from '../../config/logger.js';
import {
  applicationNotificationQueue,
  getRabbitMqChannel,
} from '../../shared/libs/rabbitmq.js';

class ApplicationNotificationPublisher {
  async publishApplicationCreated(applicationId) {
    try {
      const channel = await getRabbitMqChannel();
      if (!channel) {
        logger.warn(
          'Skipping RabbitMQ publish because channel is unavailable',
          {
            applicationId,
          }
        );
        return;
      }

      const payload = JSON.stringify({ ['application_id']: applicationId });
      channel.sendToQueue(applicationNotificationQueue, Buffer.from(payload), {
        persistent: true,
      });

      logger.info('Application notification published', { applicationId });
    } catch (error) {
      logger.warn('Failed to publish application notification', {
        applicationId,
        message: error.message,
      });
    }
  }
}

export default new ApplicationNotificationPublisher();
