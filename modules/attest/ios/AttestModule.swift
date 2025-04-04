import ExpoModulesCore
import DCAppAttest

let appAttestService = DCAppAttestService.shared

public class AttestModule: Module {
  public func definition() -> ModuleDefinition {
    Name("AttestModule")

    AsyncFunction("asyncGenerateKey") { (challenge: String, promise: Promise) in
      // Check if App Attest is supported
      guard appAttestService.isSupported else {
        promise.reject([
          "code": "ATTEST_NOT_SUPPORTED",
          "message": "App Attest is not supported on this device"
        ])
        return
      }

      // Generate a key
      appAttestService.generateKey { keyId, error in
        if let error = error {
          promise.reject([
            "code": "KEY_GENERATION_ERROR",
            "message": error.localizedDescription
          ])
          return
        }

        guard let keyId = keyId else {
          promise.reject([
            "code": "KEY_GENERATION_ERROR",
            "message": "Failed to generate key"
          ])
          return
        }

        // Generate attestation for the key
        appAttestService.attestKey(keyId, clientDataHash: challenge.data(using: .utf8)!) { attestation, error in
          if let error = error {
            promise.reject([
              "code": "ATTESTATION_ERROR",
              "message": error.localizedDescription
            ])
            return
          }

          guard let attestation = attestation else {
            promise.reject([
              "code": "ATTESTATION_ERROR",
              "message": "Failed to generate attestation"
            ])
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
        promise.reject([
          "code": "ATTEST_NOT_SUPPORTED",
          "message": "App Attest is not supported on this device"
        ])
        return
      }

      // Generate assertion
      appAttestService.generateAssertion(keyId, clientDataHash: clientData.data(using: .utf8)!) { assertion, error in
        if let error = error {
          promise.reject([
            "code": "ASSERTION_ERROR",
            "message": error.localizedDescription
          ])
          return
        }

        guard let assertion = assertion else {
          promise.reject([
            "code": "ASSERTION_ERROR",
            "message": "Failed to generate assertion"
          ])
          return
        }

        // Convert assertion to base64 string
        let assertionString = assertion.base64EncodedString()
        promise.resolve(assertionString)
      }
    }
  }
}
