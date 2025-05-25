package com.example.healthyhelper

import android.content.Context
import android.os.Bundle
import android.view.View
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.NavOptions
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.setupWithNavController
import com.google.android.material.bottomnavigation.BottomNavigationView

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)

        val navHostFragment = supportFragmentManager.findFragmentById(R.id.fragmentContainerView) as NavHostFragment
        val navController = navHostFragment.navController
        val bottomNav = findViewById<BottomNavigationView>(R.id.bottomNavigationView)

        val prefs = getSharedPreferences("prefs", Context.MODE_PRIVATE)
        val token = prefs.getString("jwt_token", null)
        val role = prefs.getString("user_role", "unknown")

        if (role == "staff") {
            bottomNav.menu.clear()
            bottomNav.inflateMenu(R.menu.bottom_nav_menu_staff)
        }

        if (token != null) {
            val navOptions = NavOptions.Builder()
                .setPopUpTo(navController.graph.startDestinationId, true)
                .build()

            if (role == "staff") {
                navController.navigate(R.id.homeStaffFragment, null, navOptions)
            } else {
                navController.navigate(R.id.homeFragment, null, navOptions)
            }
        }
        bottomNav.setupWithNavController(navController)

        navController.addOnDestinationChangedListener { _, destination, _ ->
            when (destination.id) {
                R.id.mainFragment, R.id.loginFragment -> {
                    bottomNav.visibility = View.GONE
                }
                else -> {
                    bottomNav.visibility = View.VISIBLE
                }
            }
        }
    }
}
