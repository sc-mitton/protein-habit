import CryptoKit
import DeviceCheck
import ExpoModulesCore

enum AppAttestSuccessResult {
    case assertion(data: Data)
    case error(Error)
}

let appAttestService = DeviceCheck.DCAppAttestService.shared

public class AppIntegrityModule: Module {
    private func appAttestCompletion<T>(
        result: T, error: Error?, continuation: CheckedContinuation<AppAttestSuccessResult, Never>
    ) {
        if let error = error {
            continuation.resume(returning: .error(error))
            return
        }

        if let data = result as? Data {
            continuation.resume(returning: .assertion(data: data))
        } else {
            continuation.resume(
                returning: .error(
                    NSError(
                        domain: "AppIntegrity", code: -1,
                        userInfo: [NSLocalizedDescriptionKey: "Invalid result type"])))
        }
    }

    public func definition() -> ModuleDefinition {
        Name("AppIntegrity")

        // Dummy function for android
        AsyncFunction("asyncGenerateToken") { (challenge: String, promise: Promise) in
            promise.resolve(nil)
        }

        AsyncFunction("asyncGenerateKey") { (promise: Promise) in
            // Check if App AppIntegrity is supported
            guard appAttestService.isSupported else {
                promise.reject(
                    Exception(
                        name: "APP_INTEGRITY_NOT_SUPPORTED",
                        description: "App AppIntegrity is not supported on this device"
                    ))
                return
            }

            // Generate a key
            appAttestService.generateKey { keyId, error in
                if let error = error {
                    promise.reject(
                        Exception(
                            name: "KEY_GENERATION_ERROR",
                            description: error.localizedDescription
                        ))
                    return
                }

                guard let keyId = keyId else {
                    promise.reject(
                        Exception(
                            name: "KEY_GENERATION_ERROR",
                            description: "Failed to generate key"
                        ))
                    return
                }

                // Return just the keyId
                promise.resolve([
                    "keyId": keyId
                ])
            }
        }

        AsyncFunction("asyncAttestKey") { (keyId: String, challenge: String, promise: Promise) in
            // Check if App AppIntegrity is supported
            guard appAttestService.isSupported else {
                promise.reject(
                    Exception(
                        name: "APP_INTEGRITY_NOT_SUPPORTED",
                        description: "App AppIntegrity is not supported on this device"
                    ))
                return
            }

            // Generate attestation for the key
            let hash = Data(SHA256.hash(data: Data(challenge.utf8)))
            appAttestService.attestKey(keyId, clientDataHash: hash) { attestation, error in
                if let error = error {
                    promise.reject(
                        Exception(
                            name: "APP_INTEGRITY_ERROR",
                            description: error.localizedDescription
                        ))
                    return
                }

                guard let attestation = attestation else {
                    promise.reject(
                        Exception(
                            name: "APP_INTEGRITY_ERROR",
                            description: "Failed to generate attestation"
                        ))
                    return
                }

                // Convert attestation to base64 string and return
                promise.resolve([
                    "attestation": attestation.base64EncodedString()
                ])
            }
        }

        AsyncFunction("asyncGenerateAssertion") {
            (requestJSON: String, keyId: String, promise: Promise) in
            // Check if App Attest is supported
            guard appAttestService.isSupported else {
                promise.reject(
                    Exception(
                        name: "APP_INTEGRITY_NOT_SUPPORTED",
                        description: "App AppIntegrity is not supported on this device"
                    ))
                return
            }

            let hash = Data(SHA256.hash(data: Data(requestJSON.utf8)))

            appAttestService.generateAssertion(keyId, clientDataHash: hash) { assertion, error in
                if let error = error {
                    promise.reject(
                        Exception(
                            name: "APP_INTEGRITY_ERROR",
                            description: error.localizedDescription
                        ))
                    return
                }

                guard let assertion = assertion else {
                    promise.reject(
                        Exception(
                            name: "APP_INTEGRITY_ERROR",
                            description: "Failed to generate assertion"
                        ))
                    return
                }

                // Convert assertion to base64 string and return
                promise.resolve(assertion.base64EncodedString())
            }
        }
    }
}
