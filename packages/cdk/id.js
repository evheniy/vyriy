import { DEV, DEVELOP, FEATURE, HOTFIX, PREPROD, PREPRODUCTION, PRODUCTION, QA, STAGING, TEST, TESTING, UAT, getCiMergeRequestId, getCiProjectName, getStage, isLocal, } from '@vyriy/env';
import { getPackage } from '@vyriy/package';
export const id = () => {
    const { name } = getPackage();
    const stage = getStage();
    if (!(isLocal() ||
        [
            DEV,
            DEVELOP,
            PREPRODUCTION,
            PREPROD,
            PRODUCTION,
            FEATURE,
            QA,
            STAGING,
            TEST,
            TESTING,
            UAT,
            HOTFIX,
        ].includes(stage))) {
        throw new Error('Wrong stage!');
    }
    return [HOTFIX, FEATURE].includes(stage) ? `${getCiProjectName()}-mr-${getCiMergeRequestId()}` : `${name}-${stage}`;
};
