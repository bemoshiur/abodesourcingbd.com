import * as migration_20260918_204511_initial from './20260918_204511_initial';
import * as migration_20260918_211418 from './20260918_211418';
import * as migration_20260919_055615 from './20260919_055615';
import * as migration_20260919_075035 from './20260919_075035';
import * as migration_20260919_100957 from './20260919_100957';
import * as migration_20260919_101256 from './20260919_101256';

export const migrations = [
  {
    up: migration_20260918_204511_initial.up,
    down: migration_20260918_204511_initial.down,
    name: '20260918_204511_initial',
  },
  {
    up: migration_20260918_211418.up,
    down: migration_20260918_211418.down,
    name: '20260918_211418',
  },
  {
    up: migration_20260919_055615.up,
    down: migration_20260919_055615.down,
    name: '20260919_055615',
  },
  {
    up: migration_20260919_075035.up,
    down: migration_20260919_075035.down,
    name: '20260919_075035',
  },
  {
    up: migration_20260919_100957.up,
    down: migration_20260919_100957.down,
    name: '20260919_100957',
  },
  {
    up: migration_20260919_101256.up,
    down: migration_20260919_101256.down,
    name: '20260919_101256'
  },
];
