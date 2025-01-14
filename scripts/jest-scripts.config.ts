import { pathsToModuleNameMapper } from 'ts-jest';
import tsconfig from '../tsconfig.json';
import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,ts}',
    '!circleci/*.ts',
    '!circleci/judge/bulkImportJudgeUsers.ts',
    '!checkUntouchedFiles.ts',
    '!compareTypescriptErrors.ts',
    '!coverage/**',
    '!download-all-case-documents.ts',
    '!dynamo/archive-outboxes.ts',
    '!dynamo/fix-race-condition-served-in-drafts.ts',
    '!dynamo/read-segment.ts',
    '!dynamo/set-local-migration-complete-marker.ts',
    '!dynamo/set-maintenance-mode.ts',
    '!elasticsearch/create-temporary-indices.ts',
    '!elasticsearch/docket-entry-search.ts',
    '!elasticsearch/docket-inbox.ts',
    '!elasticsearch/get-users.ts',
    '!elasticsearch/health-migration.ts',
    '!elasticsearch/ready-cluster-for-migration.ts',
    '!elasticsearch/reindex.ts',
    '!email/**',
    '!glue/**',
    '!import-case-status-changes-from-csv.ts',
    '!irs-super-user.ts',
    '!jest-scripts.config.ts',
    '!set-maintenance-mode-locally.ts',
    '!judge/update-judge-titles.ts',
    '!judge/update-judge-isSeniorJudge.ts',
    '!reports/**',
    '!run-once-scripts/**',
    '!upload-practitioner-application-packages.ts',
    '!user/**',
  ],
  coverageDirectory: './coverage',
  coverageProvider: 'babel',
  coverageThreshold: {
    global: {
      branches: 97,
      functions: 99,
      lines: 99,
      statements: 99,
    },
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
      prefix: '<rootDir>/../',
    }),
    uuid: require.resolve('uuid'),
  },
  testEnvironment: 'node',
  testMatch: ['**/scripts/**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
  },
  transformIgnorePatterns: ['/node_modules/(?!uuid)'],
  verbose: false,
};

// eslint-disable-next-line import/no-default-export
export default config;
