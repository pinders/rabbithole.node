import { RabbitHoleService } from '../';

const service = new RabbitHoleService({
  serviceName: 'DevService',
  connectionUrl: 'amqp://wlfegxhr:KMWLWPs99fuSpSULe1Cb-x2WVsfSfC10@impala.rmq.cloudamqp.com/wlfegxhr',
  events: {
    'user.signedIn': (msg) => {
      console.log('user.signedIn: ', msg.content.toString());
    },
    'user.signedOut': (msg) => {
      console.log('user.signedOut: ', msg.content.toString());
    },
  },
});

service.start().then(msg => console.log(msg));
