import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
export { CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
export const createCertificate = (scope, id, props) => new Certificate(scope, id, props);
