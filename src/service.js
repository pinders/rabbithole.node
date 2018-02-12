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
  tasks: EventsObject;
  rpcs: EventsObject;

  /*
   *  Class constructor
   */
  constructor(opts?: ServiceOptions) {
    const options: ServiceOptions = opts || {};

    this.serviceName = options.serviceName || uuidv1();
    this.connectionUrl = options.connectionUrl || '';

    this.events = {};
    this.tasks = {};
    this.rpcs = {};
  }

  async assertExchanges(exchanges: Array<string>): Promise<void> {
    exchanges.forEach((exchange) => {
      this.channel.assertExchange(exchange, 'topic');
    });
  }

  async handle() {

  }

  /*
   *  Methods
   */
  event(bindingKey: string, processFn: (msg: amqp.Message) => void) {
    this.events[bindingKey] = processFn;
  }

  task(bindingKey: string, processFn: (msg: amqp.Message) => void) {
    this.tasks[bindingKey] = processFn;
  }

  rpc(bindingKey: string, processFn: (msg: amqp.Message) => void) {
    this.rpcs[bindingKey] = processFn;
  }

  async start(): Promise<string> {
    try {
      this.connection = await amqp.connect(this.connectionUrl);

      this.channel = await this.connection.createChannel();

      await this.assertExchanges(['events', 'tasks', 'rpcs']);

      const eventKeys: [string] = _.keys(this.events);
      const taskKeys: [string] = _.keys(this.tasks);
      const rpcKeys: [string] = _.keys(this.rpcs);

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
