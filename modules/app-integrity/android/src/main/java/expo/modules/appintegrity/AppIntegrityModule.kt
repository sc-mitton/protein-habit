package expo.modules.appintegrity

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL

class AppIntegrityModule : Module() {
  private val integrityManager: IntegrityManager by lazy {
    IntegrityManagerFactory.create(context)
  }

  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('AppIntegrity')` in JavaScript.
    Name("AppIntegrity")

    AsyncFunction("asyncGenerateKey") { challenge: String ->
      // Android doesn't support key generation, return undefined
      undefined
    }

    AsyncFunction("asyncGenerateAssertion") { clientData: String ->
      try {
        val request = IntegrityTokenRequest.builder()
          .setNonce(clientData.toByteArray())
          .build()

        val task: Task<IntegrityTokenResponse> = integrityManager.requestIntegrityToken(request)

        val response = task.result
        val token = response.token()

        // Convert token to base64 string
        Base64.getEncoder().encodeToString(token)
      } catch (e: Exception) {
        throw mapOf(
          "code" to "ASSERTION_ERROR",
          "message" to (e.message ?: "Unknown error occurred")
        )
      }
    }
  }
}
