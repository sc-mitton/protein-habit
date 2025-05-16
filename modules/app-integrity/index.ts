// Reexport the native module. On web, it will be resolved to AppIntegrityModule.web.ts
// and on native platforms to AppIntegrityModule.ts
export { default } from "./src/AppIntegrityModule";
export * from "./src/AppIntegrity.types";
export * from "./src/init";
