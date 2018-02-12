import { RabbitHoleClient } from '../';

const client = new RabbitHoleClient({
  clientName: 'DevClient',
  connectionUrl: '',
});

client.publish('events', {
  routingKey: 'user.signedIn',
  payload: 'Hallo vom Client',
});

client.publish('events', {
  routingKey: 'user.signedIn',
  payload: 'Noch ein Nachricht',
});
