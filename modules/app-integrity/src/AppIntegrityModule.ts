import { requireNativeModule } from "expo";
import type { AppIntegrityModule } from "./AppIntegrity.types";
// This call loads the native module object from the JSI.
export default requireNativeModule<AppIntegrityModule>("AppIntegrity");
