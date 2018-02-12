// @flow

import amqp from 'amqplib';

type ClientOptions = {
  clientName?: string,
  connectionUrl?: string,
};

type ClientMessage = {
  routingKey?: string,
  deliveryMode?: number,
  headers?: { [string]: any },
  properties?: { [string]: any },
  payload?: string,
}

export default class RabbitHoleClient {
  /*
   *  Properties
   */
  clientName: string;
  connectionUrl: string;
  connection: amqp.Connection;
  channel: amqp.Channel;

  /*
   *  Constructor
   */
  constructor(opts?: ClientOptions) {
    const options: ClientOptions = opts || {};

    this.clientName = options.clientName || '';
    this.connectionUrl = options.connectionUrl || '';
  }

  /*
   *  Methods
   */
  async publish(exchangeName: string, msg: ClientMessage): Promise<Error | void> {
    try {
      if (!this.connection) {
        this.connection = await amqp.connect(this.connectionUrl);
      }

      if (!this.channel) {
        this.channel = await this.connection.createChannel();
      }

      this.channel.assertExchange('events', 'topic');

      this.channel.publish('events', msg.routingKey || '', Buffer.from(msg.payload || ''));
    } catch (err) {
      console.log(err);
    }
  }
}
