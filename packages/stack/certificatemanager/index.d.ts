import { Construct } from 'constructs';
import { Certificate, CertificateProps, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
export { CertificateValidation };
export declare const createCertificate: (scope: Construct, id: string, props: CertificateProps) => Certificate;
