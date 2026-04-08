import nodemailer from 'nodemailer';
import config from '../config/env.js';
import logger from '../config/logger.js';
import applicationRepository from '../shared/utils/application.repository.js';
import {
  applicationNotificationQueue,
  getRabbitMqChannel,
} from '../shared/libs/rabbitmq.js';

const parsePayload = (messageContent) => {
  try {
    return JSON.parse(messageContent);
  } catch {
    return null;
  }
};

const getMailFrom = () => {
  const address = config.mailFromAddress || config.mailUser;
  if (!address) {
    return null;
  }

  const name = config.mailFromName?.trim();
  return name ? { name, address } : address;
};

class ApplicationNotificationConsumer {
  constructor() {
    if (
      config.mailHost &&
      config.mailPort &&
      config.mailUser &&
      config.mailPassword
    ) {
      this.transporter = nodemailer.createTransport({
        host: config.mailHost,
        port: config.mailPort,
        secure: config.mailPort === 465,
        auth: {
          user: config.mailUser,
          pass: config.mailPassword,
        },
      });
    } else {
      this.transporter = null;
    }
  }

  async sendNotificationEmail(payload) {
    if (!this.transporter) {
      logger.warn('Mailer is not configured, skipping email notification');
      return;
    }

    const mailFrom = getMailFrom();
    if (!mailFrom) {
      logger.warn('Mail sender is not configured, skipping email notification');
      return;
    }

    const applicationDate = new Date(
      payload.application_created_at
    ).toISOString();

    await this.transporter.sendMail({
      from: mailFrom,
      to: payload.owner_email,
      subject: 'New job application received',
      text: [
        'A new application has been submitted.',
        '',
        `Applicant Name: ${payload.applicant_name}`,
        `Applicant Email: ${payload.applicant_email}`,
        `Application Date: ${applicationDate}`,
      ].join('\n'),
    });
  }

  async handleMessage(message, channel) {
    if (!message) {
      return;
    }

    const content = message.content.toString();
    const parsedPayload = parsePayload(content);
    if (!parsedPayload?.application_id) {
      logger.warn('Invalid application notification payload', { content });
      channel.ack(message);
      return;
    }

    try {
      const notificationPayload =
        await applicationRepository.findNotificationPayloadById(
          parsedPayload.application_id
        );

      if (!notificationPayload) {
        logger.warn('Application data not found for notification', {
          applicationId: parsedPayload.application_id,
        });
        channel.ack(message);
        return;
      }

      if (!notificationPayload.owner_email) {
        logger.warn('Owner email not found for application notification', {
          applicationId: parsedPayload.application_id,
        });
        channel.ack(message);
        return;
      }

      await this.sendNotificationEmail(notificationPayload);
      logger.info('Application notification processed', {
        applicationId: parsedPayload.application_id,
      });
      channel.ack(message);
    } catch (error) {
      logger.error('Failed to process application notification', {
        message: error.message,
      });
      channel.ack(message);
    }
  }

  async consume() {
    const channel = await getRabbitMqChannel();
    if (!channel) {
      throw new Error('RabbitMQ channel is not available');
    }

    await channel.consume(
      applicationNotificationQueue,
      (message) => {
        void this.handleMessage(message, channel);
      },
      { noAck: false }
    );

    logger.info('Application notification consumer started');
  }
}

export default new ApplicationNotificationConsumer();
