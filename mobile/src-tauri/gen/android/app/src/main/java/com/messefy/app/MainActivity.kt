package com.messefy.app

import android.os.Bundle
import android.view.View
import androidx.activity.enableEdgeToEdge
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : TauriActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    enableEdgeToEdge()
    super.onCreate(savedInstanceState)

    val rootView = findViewById<View>(android.R.id.content)
    ViewCompat.setOnApplyWindowInsetsListener(rootView) { v, insets ->
      val ime = insets.getInsets(WindowInsetsCompat.Type.ime())
      val imeVisible = insets.isVisible(WindowInsetsCompat.Type.ime())
      // When soft keyboard (IME) is visible, push view up by keyboard height.
      // Otherwise, keep 0 padding so CSS env(safe-area-inset-*) provides clean single-layer edge-to-edge padding.
      if (imeVisible && ime.bottom > 0) {
        v.setPadding(0, 0, 0, ime.bottom)
      } else {
        v.setPadding(0, 0, 0, 0)
      }
      insets
    }
  }
}
