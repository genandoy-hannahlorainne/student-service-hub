import 'package:flutter/material.dart';

import '../screens/admin_dashboard_screen.dart';
import '../screens/create_rental_post_screen.dart';
import '../screens/guest_dashboard_screen.dart';
import '../screens/landing_screen.dart';
import '../screens/login_screen.dart';
import '../screens/order_tracking_screen.dart';
import '../screens/printing_service_screen.dart';
import '../screens/provider_dashboard_screen.dart';
import '../screens/provider_profile_screen.dart';
import '../screens/resource_rental_screen.dart';
import '../screens/role_selection_screen.dart';
import '../screens/school_supplies_screen.dart';
import '../screens/student_dashboard_screen.dart';
import '../screens/transaction_receipt_screen.dart';

abstract final class AppRoutes {
  static const landing = '/';
  static const roleSelection = '/auth/roles';
  static const login = '/auth/login';
  static const studentDashboard = '/student';
  static const printing = '/student/printing';
  static const supplies = '/student/supplies';
  static const resources = '/student/resources';
  static const createRentalPost = '/student/resources/create';
  static const orderTracking = '/student/orders/tracking';
  static const receipt = '/student/orders/receipt';
  static const guestDashboard = '/guest';
  static const providerDashboard = '/provider';
  static const providerProfile = '/provider/profile';
  static const adminDashboard = '/admin';

  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case landing:
        return _page(const LandingScreen(), settings);
      case roleSelection:
        return _page(const RoleSelectionScreen(), settings);
      case login:
        final arguments = settings.arguments as LoginArguments?;
        return _page(
          LoginScreen(
            roleTitle: arguments?.roleTitle ?? 'PUPTian',
            roleSubtitle: arguments?.roleSubtitle ?? 'Student account',
          ),
          settings,
        );
      case studentDashboard:
        return _page(const StudentDashboardScreen(), settings);
      case printing:
        return _page(const PrintingServiceScreen(), settings);
      case supplies:
        return _page(const SchoolSuppliesScreen(), settings);
      case resources:
        return _page(const ResourceRentalScreen(), settings);
      case createRentalPost:
        return _page(const CreateRentalPostScreen(), settings);
      case orderTracking:
        return _page(const OrderTrackingScreen(), settings);
      case receipt:
        return _page(const TransactionReceiptScreen(), settings);
      case guestDashboard:
        return _page(const GuestDashboardScreen(), settings);
      case providerDashboard:
        return _page(const ProviderDashboardScreen(), settings);
      case providerProfile:
        return _page(const ProviderProfileScreen(), settings);
      case adminDashboard:
        return _page(const AdminDashboardScreen(), settings);
      default:
        return _page(const LandingScreen(), settings);
    }
  }

  static MaterialPageRoute<void> _page(Widget child, RouteSettings settings) {
    return MaterialPageRoute<void>(
      builder: (_) => child,
      settings: settings,
    );
  }
}

class LoginArguments {
  const LoginArguments({
    required this.roleTitle,
    required this.roleSubtitle,
  });

  final String roleTitle;
  final String roleSubtitle;
}
