// @flow

import amqp from 'amqplib';
import uuidv1 from 'uuid';
import _ from 'lodash';

type EventsObject = {
  [string]: (msg: amqp.Message) => void
}

type ServiceOptions = {
  serviceName?: string,
  connectionUrl?: string,
  events?: EventsObject,
};

export default class RabbitHoleService {
  /*
   *  Class properties
   */
  serviceName: string;
  connectionUrl: string;
  connection: amqp.Connection;
  channel: amqp.Channel;
  events: EventsObject;

  /*
   *  Class constructor
   */
  constructor(opts?: ServiceOptions) {
    const options: ServiceOptions = opts || {};

    this.serviceName = options.serviceName || uuidv1();
    this.connectionUrl = options.connectionUrl || '';

    this.events = options.events || {};
  }

  /*
   *  Methods
   */
  async start(): Promise<string> {
    try {
      this.connection = await amqp.connect(this.connectionUrl);

      this.channel = await this.connection.createChannel();

      this.channel.assertExchange('events', 'topic');


      const eventKeys: [string] = _.keys(this.events);

      eventKeys.forEach(async (key: string): Promise<void> => {
        const q = await this.channel.assertQueue(`service:"${this.serviceName}".bindingKey:"${key}"`, {
          autoDelete: true,
        });
        this.channel.bindQueue(q.queue, 'events', key);
        this.channel.consume(q.queue, (msg): void => {
          if (msg) {
            this.events[key](msg);
          }
        });
      });
    } catch (err) {
      console.log(err);
    }

    return this.connectionUrl;
  }
}
