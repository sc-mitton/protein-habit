import ExpoModulesCore
import DeviceCheck

let appAttestService = DeviceCheck.DCAppAttestService.shared


public class AppIntegrityModule: Module {
  public func definition() -> ModuleDefinition {
    Name("AppIntegrity")

    AsyncFunction("asyncGenerateKey") { (challenge: String, promise: Promise) in
      // Check if App AppIntegrity is supported
      guard appAttestService.isSupported else {
        promise.reject(Exception(
          name: "APP_INTEGRITY_NOT_SUPPORTED",
          description: "App AppIntegrity is not supported on this device"
        ))
        return
      }

      // Generate a key
      appAttestService.generateKey { keyId, error in
        if let error = error {
          promise.reject(Exception(
            name: "KEY_GENERATION_ERROR",
            description: error.localizedDescription
          ))
          return
        }

        guard let keyId = keyId else {
          promise.reject(Exception(
            name: "KEY_GENERATION_ERROR",
            description: "Failed to generate key"
          ))
          return
        }

        // Generate attestation for the key
        appAttestService.attestKey(keyId, clientDataHash: challenge.data(using: .utf8)!) { attestation, error in
          if let error = error {
            promise.reject(Exception(
              name: "APP_INTEGRITY_ERROR",
                  description: error.localizedDescription
            ))
            return
          }

          guard let attestation = attestation else {
            promise.reject(Exception(
              name: "APP_INTEGRITY_ERROR",
              description: "Failed to generate attestation"
            ))
            return
          }

          // Convert attestation to base64 string and return both keyId and attestation
          let attestationString = attestation.base64EncodedString()
          promise.resolve([
            "keyId": keyId,
            "attestation": attestationString
          ])
        }
      }
    }

    AsyncFunction("asyncGenerateAssertion") { (keyId: String, clientData: String, promise: Promise) in
      // Check if App Attest is supported
      guard appAttestService.isSupported else {
        promise.reject(Exception(
          name: "APP_INTEGRITY_NOT_SUPPORTED",
          description: "App AppIntegrity is not supported on this device"
        ))
        return
      }

      // Generate assertion
      appAttestService.generateAssertion(keyId, clientDataHash: clientData.data(using: .utf8)!) { assertion, error in
        if let error = error {
          promise.reject(Exception(
            name: "ASSERTION_ERROR",
            description: error.localizedDescription
          ))
          return
        }

        guard let assertion = assertion else {
          promise.reject(Exception(
            name: "ASSERTION_ERROR",
            description: "Failed to generate assertion"
          ))
          return
        }

        // Convert assertion to base64 string
        let assertionString = assertion.base64EncodedString()
        promise.resolve(assertionString)
      }
    }
  }
}
