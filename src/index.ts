import {log} from '@augment-vir/common';
import {PGlite} from '@electric-sql/pglite';
import {PrismaClient} from '@prisma/client';
import {mkdir, rm} from 'node:fs/promises';
import {relative} from 'node:path';
import {PrismaPGlite} from 'pglite-prisma-adapter';
import {migrationSqlFilePath, pgliteDirPath, prismaSchemaFilePath} from './file-paths.js';
import {generateDbInitSql} from './init-sql.js';

export async function runPgliteScript() {
    log.faint(`Starting PGlite at ${relative(process.cwd(), pgliteDirPath)}`);

    /** Wipe the PGlite database so we're starting with a clean slate for this demo. */
    await rm(pgliteDirPath, {force: true, recursive: true});
    await mkdir(pgliteDirPath, {recursive: true});

    /** Setup the PGlite database. */
    const pglite = new PGlite(pgliteDirPath);
    await pglite.exec(
        /** To use this in the frontend, you could simply serve up the generated SQL file. */
        await generateDbInitSql({
            migrationOutputPath: migrationSqlFilePath,
            prismaSchemaPath: prismaSchemaFilePath,
        }),
    );

    /** Run some example queries through the Prisma client, proving that it works. */

    const prismaClient = new PrismaClient({
        adapter: new PrismaPGlite(pglite),
    });
    console.info(
        await prismaClient.user.create({
            data: {
                email: 'test@example.com',
                // eslint-disable-next-line sonarjs/no-hardcoded-credentials
                password: 'fake password here',
                settings: {
                    create: {
                        receivesMarketingEmails: true,
                    },
                },
            },
        }),
    );
    console.info(
        await prismaClient.user.findMany({
            include: {
                settings: true,
            },
        }),
    );
}
