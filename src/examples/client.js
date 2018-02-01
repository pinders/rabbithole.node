import { RabbitHoleClient } from '../';

const client = new RabbitHoleClient({
  connectionUrl: 'amqp://wlfegxhr:KMWLWPs99fuSpSULe1Cb-x2WVsfSfC10@impala.rmq.cloudamqp.com/wlfegxhr',
});

client.publish({
  routingKey: 'user.signedIn',
  content: 'Hallo vom Client',
});

client.publish({
  routingKey: 'user.signedIn',
  content: 'Noch ein Nachricht',
});
