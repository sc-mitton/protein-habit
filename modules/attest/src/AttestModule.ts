import { NativeModule, requireNativeModule } from "expo";
import { AttestModule } from "./Attest.types";

// This call loads the native module object from the JSI.
export default requireNativeModule<AttestModule>("Attest");
