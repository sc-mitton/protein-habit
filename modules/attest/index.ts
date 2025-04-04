// Reexport the native module. On web, it will be resolved to AttestModule.web.ts
// and on native platforms to AttestModule.ts
export { default } from './src/AttestModule';
export { default as AttestView } from './src/AttestView';
export * from  './src/Attest.types';
