import { Construct } from 'constructs';
import { Certificate, CertificateProps } from 'aws-cdk-lib/aws-certificatemanager';
export { CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
export declare const createCertificate: (scope: Construct, id: string, props: CertificateProps) => Certificate;
