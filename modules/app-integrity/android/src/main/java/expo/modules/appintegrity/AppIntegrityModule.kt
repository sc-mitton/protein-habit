package expo.modules.appintegrity

import com.google.android.play.core.integrity.IntegrityManagerFactory
import com.google.android.play.core.integrity.IntegrityTokenRequest
import com.google.android.play.core.integrity.IntegrityServiceException
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import android.util.Base64

private const val UNKNOWN_ERROR_CODE = "UNKNOWN_ERROR"

/**
 * Stub implementation of App Integrity module for Android
 *
 * This is a temporary solution that doesn't rely on the Google Play Integrity API
 * In production, this would need to be replaced with the actual implementation
 */
class AppIntegrityModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("AppIntegrity")

    AsyncFunction("asyncGenerateKey") { promise: Promise ->
      // Android doesn't support key generation, return null
      promise.resolve(null)
    }

    AsyncFunction("asyncAttestKey") { keyId: String, challenge: String, promise: Promise ->
      promise.resolve(null)
    }

    AsyncFunction("asyncGenerateAssertion") { requestJSON: String, promise: Promise ->
      promise.resolve(null)
    }

    AsyncFunction("asyncGenerateToken") { challenge: String, promise: Promise ->
      val manager = IntegrityManagerFactory.create(appContext.reactContext)

      manager.requestIntegrityToken(
        IntegrityTokenRequest.builder()
          .setNonce(challenge)
          .build()
      ).addOnCompleteListener { task ->
        if (task.isSuccessful) {
          val token: String? = task.result?.token()
          if (token != null) {
            promise.resolve(token)
          } else {
            promise.reject(CodedException("ERROR", "Failed to generate token: Invalid token response", null))
          }
        } else {
          val errorMessage = when (task.exception) {
            is IntegrityServiceException -> {
              when ((task.exception as IntegrityServiceException).errorCode) {
                1 -> "API not available"
                2 -> "App not installed"
                3 -> "App UID mismatch"
                4 -> "Cannot bind to service"
                5 -> "Client transient error"
                6 -> "Invalid cloud project number"
                7 -> "Google server unavailable"
                8 -> "Internal error"
                9 -> "Network error"
                10 -> "Nonce is not Base64"
                11 -> "Nonce too long"
                12 -> "Nonce too short"
                13 -> "Play Services not found"
                14 -> "Play Services version outdated"
                15 -> "Play Store not found"
                16 -> "Play Store account not found"
                17 -> "Play Store version outdated"
                18 -> "Too many requests"
                else -> "Unknown error: ${task.exception?.message}"
              }
            }
            else -> "Unknown error: ${task.exception?.message}"
          }
          promise.reject(CodedException("ERROR", "Failed to generate token: $errorMessage", task.exception))
        }
      }
    }
  }
}
