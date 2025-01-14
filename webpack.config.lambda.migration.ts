import config from './webpack.config.lambda';
import type { Configuration } from 'webpack';

const migrationConfig: Configuration = {
  ...config,
  entry: {
    migration:
      './web-api/workflow-terraform/migration/main/lambdas/migration.ts',
    'migration-segments':
      './web-api/workflow-terraform/migration/main/lambdas/migration-segments.ts',
  },
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: `${__dirname}/web-api/workflow-terraform/migration/main/lambdas/dist`,
  },
};

// eslint-disable-next-line import/no-default-export
export default migrationConfig;
