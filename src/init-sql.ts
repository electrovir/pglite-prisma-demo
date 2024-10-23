import {interpolationSafeWindowsPath, runShellCommand} from '@augment-vir/node';
import {readFile} from 'node:fs/promises';

/**
 * The Prisma CLI does not (yet) support initializing a PGLite database. Instead, we get Prisma to
 * dump a single migration file which can then be loaded by a PGLite instance to setup the
 * database.
 *
 * @see https://github.com/lucasthevenet/pglite-utils/issues/8#issuecomment-2147944548
 */
export async function generateDbInitSql({
    prismaSchemaPath,
    migrationOutputPath,
}: {
    prismaSchemaPath: string;
    migrationOutputPath: string;
}): Promise<string> {
    await runShellCommand(
        `npx prisma migrate diff --from-empty --to-schema-datamodel ${interpolationSafeWindowsPath(prismaSchemaPath)} --script > ${interpolationSafeWindowsPath(migrationOutputPath)}`,
        {
            rejectOnError: true,
        },
    );

    return String(await readFile(migrationOutputPath));
}
