import 'package:flutter/material.dart';

class AppTheme {
  static const Color primaryBlue = Color(0xFF0057B8);
  static const Color primaryGold = Color(0xFFFFD700);
  static const Color neutral50 = Color(0xFFF8F9FA);
  static const Color neutral100 = Color(0xFFEAECEF);
  static const Color neutral300 = Color(0xFFCDD2D9);
  static const Color neutral700 = Color(0xFF475569);
  static const Color neutral900 = Color(0xFF111827);

  static ThemeData lightTheme() {
    final base = ThemeData.light(useMaterial3: true);

    return base.copyWith(
      scaffoldBackgroundColor: neutral50,
      colorScheme: const ColorScheme.light(
        primary: primaryBlue,
        secondary: primaryGold,
        surface: Colors.white,
        onPrimary: Colors.white,
        onSurface: neutral900,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        foregroundColor: neutral900,
        elevation: 0,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryBlue,
          foregroundColor: Colors.white,
          minimumSize: const Size.fromHeight(52),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: primaryBlue,
          minimumSize: const Size.fromHeight(52),
          side: const BorderSide(color: primaryBlue),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
      cardTheme: CardTheme(
        color: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: neutral100),
        ),
        margin: const EdgeInsets.all(0),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: neutral300),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: neutral300),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: primaryBlue, width: 2),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
      textTheme: base.textTheme.copyWith(
        headlineLarge: const TextStyle(
          fontSize: 32,
          fontWeight: FontWeight.w800,
          color: neutral900,
        ),
        headlineMedium: const TextStyle(
          fontSize: 26,
          fontWeight: FontWeight.w700,
          color: neutral900,
        ),
        titleLarge: const TextStyle(
          fontSize: 22,
          fontWeight: FontWeight.w700,
          color: neutral900,
        ),
        titleMedium: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: neutral900,
        ),
        bodyLarge: const TextStyle(
          fontSize: 16,
          color: neutral700,
        ),
        bodyMedium: const TextStyle(
          fontSize: 14,
          color: neutral700,
        ),
      ),
    );
  }
}
