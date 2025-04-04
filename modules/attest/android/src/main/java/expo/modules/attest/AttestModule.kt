package expo.modules.attest

import com.google.android.play.core.integrity.IntegrityManager
import com.google.android.play.core.integrity.IntegrityManagerFactory
import com.google.android.play.core.integrity.IntegrityTokenRequest
import com.google.android.play.core.integrity.IntegrityTokenResponse
import com.google.android.play.core.tasks.Task
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL
import java.util.Base64

class AttestModule : Module() {
  private val integrityManager: IntegrityManager by lazy {
    IntegrityManagerFactory.create(context)
  }

  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('Attest')` in JavaScript.
    Name("Attest")

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

    // Enables the module to be used as a native view. Definition components that are accepted as part of
    // the view definition: Prop, Events.
    View(AttestView::class) {
      // Defines a setter for the `url` prop.
      Prop("url") { view: AttestView, url: URL ->
        view.webView.loadUrl(url.toString())
      }
      // Defines an event that the view can send to JavaScript.
      Events("onLoad")
    }
  }
}
