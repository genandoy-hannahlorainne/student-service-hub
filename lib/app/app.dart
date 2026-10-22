import 'package:flutter/material.dart';

import 'app_routes.dart';
import '../screens/landing_screen.dart';
import '../theme/app_theme.dart';

class PasoaApp extends StatelessWidget {
  const PasoaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PASOA Student Service Hub',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme(),
      home: const LandingScreen(),
      onGenerateRoute: AppRoutes.onGenerateRoute,
    );
  }
}
