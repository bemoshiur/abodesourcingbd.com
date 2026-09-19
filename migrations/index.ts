import * as migration_20260918_204511_initial from './20260918_204511_initial';
import * as migration_20260918_211418 from './20260918_211418';
import * as migration_20260919_055615 from './20260919_055615';

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
    name: '20260919_055615'
  },
];
