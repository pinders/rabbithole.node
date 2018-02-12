import { RabbitHoleService } from '../';

const service = new RabbitHoleService({
  serviceName: 'DevService',
  connectionUrl: '',
});

service.event('user.signedIn', (msg) => {
  console.log('user.signedIn: ', msg.content.toString());
});

service.event('user.signedOut', (msg) => {
  console.log('user.signedOut: ', msg.content.toString());
});

service
  .start()
  .then(msg => console.log(msg))
  .catch(err => console.log(err));
