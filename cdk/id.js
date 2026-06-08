import { DEV, DEVELOP, FEATURE, HOTFIX, PREPROD, PREPRODUCTION, PRODUCTION, QA, STAGING, TEST, TESTING, UAT, getCiMergeRequestId, getCiProjectName, getStage, isLocal, } from '@vyriy/env';
import { getPackage } from '@vyriy/package';
const supportedStages = new Set([
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
]);
export const id = () => {
    const { name } = getPackage();
    const stage = getStage();
    if (!(isLocal() || supportedStages.has(stage))) {
        throw new Error('Wrong stage!');
    }
    return stage === HOTFIX || stage === FEATURE
        ? `${getCiProjectName()}-mr-${getCiMergeRequestId()}`
        : `${name}-${stage}`;
};
