const printList = (values) => values.length === 0 ? '  - none' : values.map((value) => `  - ${value}`).join('\n');
const printCi = (plan) => plan.ci.enabled
    ? `CI/CD:
  enabled: yes
  providers:
${printList(plan.ci.providers)}
  pipelines:
${printList(plan.ci.pipelines)}
`
    : `CI/CD:
  enabled: no
`;
const printApi = (plan) => {
    if (!plan.api) {
        return '';
    }
    const rest = plan.api.rest
        ? `  REST:
    router: ${plan.api.rest.packageName}
`
        : '';
    const graphql = plan.api.graphql
        ? `  GraphQL:
    package: ${plan.api.graphql.packageName}
`
        : '';
    return `API:
  style: ${plan.api.style}
  runtime: ${plan.api.runtime}
${rest}${graphql}`;
};
export const printProjectPlan = (plan) => `Project summary:

Name: ${plan.projectName}
Target directory: ${plan.targetDirectory}
Scope: ${plan.packageScope}
Description: ${plan.description}
Preset: ${plan.preset}
Kind: ${plan.projectKind}
Features:
${printList(plan.features)}
Packages:
${printList(plan.packages.map((packagePlan) => `${packagePlan.name} (${packagePlan.kind})`))}
Workspaces:
${printList(plan.workspaces.map((workspacePlan) => `${workspacePlan.name} (${workspacePlan.kind})`))}
${printApi(plan)}${printCi(plan)}
`;
