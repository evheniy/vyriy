import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
export { CertificateValidation };
export const createCertificate = (scope, id, props) => new Certificate(scope, id, props);
