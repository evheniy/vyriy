export const prompt = async (question, label, defaultValue) => {
    const answer = (await question(`${label} (${defaultValue}): `)).trim();
    return answer || defaultValue;
};
