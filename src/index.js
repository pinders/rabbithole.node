import RabbitHoleService from './service';
import RabbitHoleClient from './client';

// @flow

class RabbitHole {
  // User with throng!
  static createClusteredService(opts: any, startFn: (service: RabbitHoleService) => void): void {
    startFn(new RabbitHoleService(opts));
  }
}

export {
  RabbitHoleService,
  RabbitHoleClient,
};

export default RabbitHole;
