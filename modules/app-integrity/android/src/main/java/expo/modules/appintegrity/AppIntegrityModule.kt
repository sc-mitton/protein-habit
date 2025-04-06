package expo.modules.appintegrity

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import android.util.Base64

/**
 * Stub implementation of App Integrity module for Android
 * 
 * This is a temporary solution that doesn't rely on the Google Play Integrity API
 * In production, this would need to be replaced with the actual implementation
 */
class AppIntegrityModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("AppIntegrity")

    AsyncFunction("asyncGenerateKey") { _: String, promise: Promise ->
      // Android doesn't support key generation, return null
      promise.resolve(null)
    }

    AsyncFunction("asyncGenerateAssertion") { clientData: String, promise: Promise ->
      try {
        // Return a placeholder token based on the client data
        val timestamp = System.currentTimeMillis().toString()
        val placeholderToken = "stub-integrity-token-${clientData.hashCode()}-$timestamp"
        promise.resolve(Base64.encodeToString(placeholderToken.toByteArray(), Base64.DEFAULT))
      } catch (e: Exception) {
        promise.reject("ASSERTION_ERROR", e.message, e)
      }
    }
  }
}
