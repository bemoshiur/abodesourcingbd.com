import * as migration_20260918_204511_initial from './20260918_204511_initial';

export const migrations = [
  {
    up: migration_20260918_204511_initial.up,
    down: migration_20260918_204511_initial.down,
    name: '20260918_204511_initial'
  },
];
