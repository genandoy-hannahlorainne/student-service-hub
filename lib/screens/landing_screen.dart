import 'package:flutter/material.dart';

import '../theme/app_theme.dart';
import 'role_selection_screen.dart';

class LandingScreen extends StatelessWidget {
  const LandingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: AppTheme.neutral50,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    width: 52,
                    height: 52,
                    decoration: BoxDecoration(
                      color: AppTheme.primaryBlue,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: const Center(
                      child: Text(
                        'P',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ),
                  ),
                  TextButton(
                    onPressed: () {},
                    child: const Text('Login'),
                  ),
                ],
              ),
              const SizedBox(height: 36),
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppTheme.primaryBlue,
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'PASOA STUDENT SERVICES',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 28,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'A student service and resource platform for PUP Taguig.',
                      style: TextStyle(
                        color: Colors.white70,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton(
                            onPressed: () {
                              Navigator.of(context).push(
                                MaterialPageRoute(
                                  builder: (_) => const RoleSelectionScreen(),
                                ),
                              );
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.primaryGold,
                              foregroundColor: AppTheme.neutral900,
                            ),
                            child: const Text('Get Started'),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () {},
                            style: OutlinedButton.styleFrom(
                              foregroundColor: Colors.white,
                              side: const BorderSide(color: Colors.white70),
                            ),
                            child: const Text('Browse Services'),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              Text(
                'Choose how to access',
                style: theme.textTheme.titleLarge,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),
              _RoleCard(
                title: 'PUPTian',
                subtitle: 'Registered Student',
                accent: AppTheme.primaryBlue,
                features: const [
                  'Order printing',
                  'Buy school supplies',
                  'Rent academic items',
                  'Track orders',
                ],
              ),
              const SizedBox(height: 12),
              _RoleCard(
                title: 'Guest',
                subtitle: 'Limited Access',
                accent: AppTheme.neutral700,
                features: const [
                  'Browse services',
                  'Post requests',
                  'View resource hub',
                ],
              ),
              const SizedBox(height: 12),
              _RoleCard(
                title: 'Service Provider',
                subtitle: 'Approved Partner',
                accent: AppTheme.primaryBlue,
                features: const [
                  'Receive student orders',
                  'Manage services',
                  'Update status',
                ],
              ),
              const SizedBox(height: 12),
              _RoleCard(
                title: 'Administrator',
                subtitle: 'Internal Access',
                accent: AppTheme.neutral900,
                features: const [
                  'Manage users',
                  'Approve providers',
                  'Moderate rentals',
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _RoleCard extends StatelessWidget {
  const _RoleCard({
    required this.title,
    required this.subtitle,
    required this.accent,
    required this.features,
  });

  final String title;
  final String subtitle;
  final Color accent;
  final List<String> features;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: accent,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                subtitle,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w700,
                  fontSize: 12,
                ),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              title,
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w800,
                color: AppTheme.neutral900,
              ),
            ),
            const SizedBox(height: 16),
            ...features.map(
              (feature) => Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Row(
                  children: [
                    const Icon(
                      Icons.check_circle,
                      size: 16,
                      color: AppTheme.primaryBlue,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        feature,
                        style: const TextStyle(
                          fontSize: 14,
                          color: AppTheme.neutral700,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => LoginScreen(
                        roleTitle: title,
                        roleSubtitle: subtitle,
                      ),
                    ),
                  );
                },
                child: Text(title == 'Administrator' ? 'Admin Portal' : 'Continue'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
