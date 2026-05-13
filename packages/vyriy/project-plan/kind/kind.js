export const getProjectKindFromPreset = (preset) => {
    switch (preset) {
        case 'react-csr':
            return 'csr';
        case 'react-ssr':
            return 'ssr';
        case 'react-ssg':
            return 'ssg';
        case 'openmfe':
        case 'mfe-bff':
        case 'openmfe-bff':
            return 'mfe';
        default:
            return preset;
    }
};
