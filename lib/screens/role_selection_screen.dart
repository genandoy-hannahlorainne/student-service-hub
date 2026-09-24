import 'package:flutter/material.dart';

import '../theme/app_theme.dart';
import 'login_screen.dart';

class RoleSelectionScreen extends StatelessWidget {
  const RoleSelectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final roles = [
      _RoleOption(
        title: 'PUPTian',
        subtitle: 'Student account',
        color: AppTheme.primaryBlue,
        routeLabel: 'Login as PUPTian',
      ),
      _RoleOption(
        title: 'Guest',
        subtitle: 'Limited access',
        color: AppTheme.neutral700,
        routeLabel: 'Login as Guest',
      ),
      _RoleOption(
        title: 'Provider',
        subtitle: 'Approved partner',
        color: AppTheme.primaryBlue,
        routeLabel: 'Provider Login',
      ),
      _RoleOption(
        title: 'Admin',
        subtitle: 'Internal only',
        color: AppTheme.neutral900,
        routeLabel: 'Admin Login',
      ),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Choose your role'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: ListView.separated(
            itemCount: roles.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final role = roles[index];
              return Card(
                child: InkWell(
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => LoginScreen(
                          roleTitle: role.title,
                          roleSubtitle: role.subtitle,
                        ),
                      ),
                    );
                  },
                  borderRadius: BorderRadius.circular(16),
                  child: Padding(
                    padding: const EdgeInsets.all(18),
                    child: Row(
                      children: [
                        Container(
                          width: 48,
                          height: 48,
                          decoration: BoxDecoration(
                            color: role.color,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Center(
                            child: Text(
                              role.title.substring(0, 1),
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w800,
                                fontSize: 22,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                role.title,
                                style: const TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                role.subtitle,
                                style: const TextStyle(
                                  color: AppTheme.neutral700,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const Icon(Icons.arrow_forward_ios, size: 18),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}

class _RoleOption {
  const _RoleOption({
    required this.title,
    required this.subtitle,
    required this.color,
    required this.routeLabel,
  });

  final String title;
  final String subtitle;
  final Color color;
  final String routeLabel;
}
