/* eslint-disable camelcase */
/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.addColumn('companies', {
    owner_user_id: {
      type: 'uuid',
      references: 'users',
      onDelete: 'SET NULL',
    },
  });
  pgm.createIndex('companies', 'owner_user_id');

  pgm.addColumn('jobs', {
    owner_user_id: {
      type: 'uuid',
      references: 'users',
      onDelete: 'SET NULL',
    },
  });
  pgm.createIndex('jobs', 'owner_user_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropIndex('jobs', 'owner_user_id');
  pgm.dropColumns('jobs', ['owner_user_id']);

  pgm.dropIndex('companies', 'owner_user_id');
  pgm.dropColumns('companies', ['owner_user_id']);
};
