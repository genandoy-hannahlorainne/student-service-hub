import 'package:flutter/material.dart';

class AppTheme {
  static const Color navy = Color(0xFF4B3621);
  static const Color ink = Color(0xFF000000);
  static const Color teal = Color(0xFFE3C565);
  static const Color mango = Color(0xFFE3C565);
  static const Color mist = Color(0xFFFFFFFF);
  static const Color paleTeal = Color(0xFFE3C565);
  static const Color slate = Color(0xFF4B3621);
  static const Color border = Color(0xFF4B3621);

  // Compatibility aliases for existing screens while they migrate to the
  // shared PASOA token names.
  static const Color primaryBlue = navy;
  static const Color primaryGold = mango;
  static const Color neutral50 = mist;
  static const Color neutral100 = border;
  static const Color neutral300 = Color(0xFF4B3621);
  static const Color neutral700 = slate;
  static const Color neutral900 = ink;

  static ThemeData lightTheme() {
    final base = ThemeData.light(useMaterial3: true);
    final scheme = ColorScheme.fromSeed(
      seedColor: navy,
      brightness: Brightness.light,
    ).copyWith(
      primary: navy,
      onPrimary: Colors.white,
      secondary: teal,
      onSecondary: Colors.white,
      surface: Colors.white,
      onSurface: ink,
    );

    return base.copyWith(
      scaffoldBackgroundColor: mist,
      colorScheme: scheme,
      materialTapTargetSize: MaterialTapTargetSize.padded,
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        foregroundColor: ink,
        elevation: 0,
        centerTitle: false,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: navy,
          foregroundColor: Colors.white,
          minimumSize: const Size.fromHeight(52),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          textStyle: const TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: navy,
          minimumSize: const Size.fromHeight(52),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          side: const BorderSide(color: navy),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          textStyle: const TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      cardTheme: CardThemeData(
        color: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: const BorderSide(color: border),
        ),
        margin: EdgeInsets.zero,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        border: _inputBorder(border),
        enabledBorder: _inputBorder(border),
        focusedBorder: _inputBorder(teal, width: 2),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 14,
        ),
      ),
      textTheme: base.textTheme.apply(
        bodyColor: ink,
        displayColor: ink,
        fontFamily: 'Inter',
      ).copyWith(
        headlineLarge: const TextStyle(
          fontSize: 40,
          fontWeight: FontWeight.w800,
          letterSpacing: -1.2,
          color: ink,
        ),
        headlineMedium: const TextStyle(
          fontSize: 32,
          fontWeight: FontWeight.w800,
          letterSpacing: -0.8,
          color: ink,
        ),
        titleLarge: const TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.w700,
          letterSpacing: -0.3,
          color: navy,
        ),
        titleMedium: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w700,
          color: navy,
        ),
        bodyLarge: const TextStyle(
          fontSize: 16,
          height: 1.5,
          color: slate,
        ),
        bodyMedium: const TextStyle(
          fontSize: 14,
          height: 1.45,
          color: slate,
        ),
      ),
    );
  }

  static OutlineInputBorder _inputBorder(Color color, {double width = 1}) {
    return OutlineInputBorder(
      borderRadius: BorderRadius.circular(14),
      borderSide: BorderSide(color: color, width: width),
    );
  }
}
