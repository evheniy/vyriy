export type PathSegments = readonly string[];
export type Path = (...pathSegments: PathSegments) => string;
export type Directory = (...pathSegments: PathSegments) => string;
export type Readdir = (...pathSegments: PathSegments) => string[];
export type IsEmpty = (...pathSegments: PathSegments) => boolean;
export type Mkdir = (...pathSegments: PathSegments) => void;
