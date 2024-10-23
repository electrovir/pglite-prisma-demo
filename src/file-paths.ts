import {join, resolve} from 'node:path';

export const repoDirPath = resolve(import.meta.dirname, '..');

const notCommittedDirPath = join(repoDirPath, '.not-committed');

export const prismaSchemaFilePath = join(repoDirPath, 'prisma', 'schema.prisma');

export const migrationSqlFilePath = join(notCommittedDirPath, 'migration.sql');
export const pgliteDirPath = join(notCommittedDirPath, 'pglite');
