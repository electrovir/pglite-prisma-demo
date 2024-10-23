import {describe, it} from '@augment-vir/test';
import {runPgliteScript} from './index.js';

describe(runPgliteScript.name, () => {
    it('works', async () => {
        await runPgliteScript();
    });
});
