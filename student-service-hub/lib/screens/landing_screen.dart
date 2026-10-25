import 'package:flutter/material.dart';

import '../app/app_routes.dart';
import '../theme/app_spacing.dart';
import '../theme/app_theme.dart';
import 'login_screen.dart';
import 'role_selection_screen.dart';

class LandingScreen extends StatelessWidget {
  const LandingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            SliverToBoxAdapter(child: _LandingHeader(onLogin: () => _openLogin(context))),
            SliverPadding(
              padding: AppSpacing.pagePadding.copyWith(top: 16),
              sliver: SliverToBoxAdapter(child: _HeroBento(onGetStarted: () => _openRoles(context))),
            ),
            SliverPadding(
              padding: AppSpacing.pagePadding.copyWith(top: 40),
              sliver: SliverToBoxAdapter(child: _ServicesBento(onServiceTap: (route) => _openRoute(context, route))),
            ),
            SliverPadding(
              padding: AppSpacing.pagePadding.copyWith(top: 40),
              sliver: SliverToBoxAdapter(child: _RolesBento(onRoleTap: (title, subtitle) => _openRoleLogin(context, title, subtitle))),
            ),
            SliverPadding(
              padding: AppSpacing.pagePadding.copyWith(top: 40, bottom: 48),
              sliver: SliverToBoxAdapter(child: _ProcessBento()),
            ),
          ],
        ),
      ),
    );
  }

  void _openLogin(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => const LoginScreen(
          roleTitle: 'PUPTian',
          roleSubtitle: 'Student account',
        ),
      ),
    );
  }

  void _openRoles(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => const RoleSelectionScreen()),
    );
  }

  void _openRoleLogin(BuildContext context, String title, String subtitle) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => LoginScreen(
          roleTitle: title,
          roleSubtitle: subtitle,
        ),
      ),
    );
  }

  void _openRoute(BuildContext context, String route) {
    Navigator.of(context).pushNamed(route);
  }
}

class _LandingHeader extends StatelessWidget {
  const _LandingHeader({required this.onLogin});

  final VoidCallback onLogin;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 18, 20, 0),
      child: Row(
        children: [
          Container(
            width: 42,
            height: 42,
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: AppTheme.mango,
              borderRadius: BorderRadius.circular(14),
            ),
            child: Image.asset(
              'assets/images/org_ssh_logo.png',
              fit: BoxFit.contain,
            ),
          ),
          const SizedBox(width: 12),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'PUP TAGUIG',
                  style: TextStyle(
                    color: AppTheme.teal,
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 1.6,
                  ),
                ),
                Text(
                  'University Organization Student Services Hub',
                  style: TextStyle(
                    color: AppTheme.navy,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
          TextButton(
            onPressed: onLogin,
            child: const Text('Login'),
          ),
        ],
      ),
    );
  }
}

class _HeroBento extends StatelessWidget {
  const _HeroBento({required this.onGetStarted});

  final VoidCallback onGetStarted;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final isWide = constraints.maxWidth >= 680;
        final hero = Container(
          constraints: const BoxConstraints(minHeight: 460),
          padding: const EdgeInsets.all(28),
          decoration: BoxDecoration(
            color: AppTheme.navy,
            borderRadius: BorderRadius.circular(28),
          ),
          child: Stack(
            children: [
              Positioned(
                right: -90,
                top: -80,
                child: Container(
                  width: 240,
                  height: 240,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: AppTheme.teal.withOpacity(.5), width: 28),
                  ),
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const _Pill(label: 'ONE HUB FOR CAMPUS ESSENTIALS'),
                  const Spacer(),
                  Text(
                    'Make school days\na little easier.',
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                          color: Colors.white,
                          fontSize: isWide ? 44 : 36,
                        ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Printing, supplies, and academic resources brought together for the PUP Taguig community.',
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: const Color(0xFFDCE7EF)),
                  ),
                  const SizedBox(height: 24),
                  FilledButton(
                    onPressed: onGetStarted,
                    style: FilledButton.styleFrom(
                      backgroundColor: AppTheme.mango,
                      foregroundColor: AppTheme.ink,
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    child: const Text('Get started  ↗'),
                  ),
                  const Spacer(),
                  const Divider(color: Colors.white24),
                  const SizedBox(height: 14),
                  const Wrap(
                    spacing: 24,
                    runSpacing: 8,
                    children: [
                      _HeroStat(value: '3', label: 'core services'),
                      _HeroStat(value: 'Approved', label: 'providers'),
                      _HeroStat(value: 'Clear', label: 'order tracking'),
                    ],
                  ),
                ],
              ),
            ],
          ),
        );

        if (!isWide) return hero;

        return Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(flex: 7, child: hero),
            const SizedBox(width: 16),
            const Expanded(flex: 3, child: _WelcomeTile()),
          ],
        );
      },
    );
  }
}

class _WelcomeTile extends StatelessWidget {
  const _WelcomeTile();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppTheme.mango,
        borderRadius: BorderRadius.circular(28),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('✦', style: TextStyle(fontSize: 34)),
          const Spacer(),
          Text(
            'Everything you need, closer.',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(color: AppTheme.ink, fontSize: 25),
          ),
          const SizedBox(height: 10),
          const Text(
            'Skip the scattered searching. Start with one organized place for your next academic requirement.',
            style: TextStyle(color: Color(0xFF31506A), height: 1.45),
          ),
        ],
      ),
    );
  }
}

class _ServicesBento extends StatelessWidget {
  const _ServicesBento({required this.onServiceTap});

  final ValueChanged<String> onServiceTap;

  @override
  Widget build(BuildContext context) {
    final services = [
      ('▣', '01 / PRINT', 'Printing services', 'Send documents to an approved shop.', AppTheme.teal, Colors.white, AppRoutes.printing),
      ('✦', '02 / SUPPLY', 'School supplies', 'Find everyday academic essentials.', AppTheme.mango, AppTheme.ink, AppRoutes.supplies),
      ('↗', '03 / SHARE', 'Resource rental hub', 'Find or offer school-ready resources.', AppTheme.paleTeal, AppTheme.navy, AppRoutes.resources),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const _SectionEyebrow(label: 'THE SERVICE HUB'),
        const SizedBox(height: 8),
        Text('Built around student needs.', style: Theme.of(context).textTheme.headlineMedium),
        const SizedBox(height: 24),
        LayoutBuilder(
          builder: (context, constraints) {
            final columns = constraints.maxWidth >= 680 ? 3 : 1;
            return GridView.count(
              crossAxisCount: columns,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: columns == 1 ? 1.45 : .95,
              children: services.map((service) {
                return InkWell(
                  onTap: () => onServiceTap(service.$7),
                  borderRadius: BorderRadius.circular(24),
                  child: Ink(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: service.$5,
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(service.$1, style: TextStyle(color: service.$6, fontSize: 28)),
                            Text(service.$2, style: TextStyle(color: service.$6.withOpacity(.7), fontSize: 10, fontWeight: FontWeight.w800)),
                          ],
                        ),
                        const Spacer(),
                        Text(service.$3, style: TextStyle(color: service.$6, fontSize: 21, fontWeight: FontWeight.w800)),
                        const SizedBox(height: 8),
                        Text(service.$4, style: TextStyle(color: service.$6.withOpacity(.8), height: 1.4)),
                        const SizedBox(height: 16),
                        Text('Explore  â†’', style: TextStyle(color: service.$6, fontWeight: FontWeight.w800)),
                      ],
                    ),
                  ),
                );
              }).toList(),
            );
          },
        ),
      ],
    );
  }
}

class _RolesBento extends StatelessWidget {
  const _RolesBento({required this.onRoleTap});

  final void Function(String title, String subtitle) onRoleTap;

  @override
  Widget build(BuildContext context) {
    final roles = [
      ('ðŸŽ“', 'PUPTian', 'Full student access', 'Order, rent, buy, and track.', 'Student account'),
      ('◌', 'Guest', 'Explore first', 'Browse approved services and posts.', 'Guest account'),
      ('â–¤', 'Provider', 'University Organization collaborator', 'Manage services and orders.', 'Provider account'),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const _SectionEyebrow(label: 'CHOOSE YOUR PATH'),
        const SizedBox(height: 8),
        Text('The right tools for your role.', style: Theme.of(context).textTheme.headlineMedium),
        const SizedBox(height: 24),
        LayoutBuilder(
          builder: (context, constraints) {
            final columns = constraints.maxWidth >= 680 ? 3 : 1;
            return GridView.count(
              crossAxisCount: columns,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: columns == 1 ? 1.4 : .9,
              children: roles.map((role) {
                return InkWell(
                  onTap: () => onRoleTap(role.$2, role.$5),
                  borderRadius: BorderRadius.circular(24),
                  child: Ink(
                    padding: const EdgeInsets.all(22),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: AppTheme.border),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        CircleAvatar(
                          radius: 24,
                          backgroundColor: AppTheme.navy,
                          child: Text(role.$1, style: const TextStyle(fontSize: 20)),
                        ),
                        const SizedBox(height: 18),
                        Text(role.$3.toUpperCase(), style: const TextStyle(color: AppTheme.teal, fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 1.2)),
                        const SizedBox(height: 6),
                        Text(role.$2, style: Theme.of(context).textTheme.titleLarge),
                        const Spacer(),
                        Text(role.$4, style: Theme.of(context).textTheme.bodyMedium),
                        const SizedBox(height: 14),
                        const Text('Continue  â†’', style: TextStyle(color: AppTheme.navy, fontWeight: FontWeight.w800)),
                      ],
                    ),
                  ),
                );
              }).toList(),
            );
          },
        ),
      ],
    );
  }
}

class _ProcessBento extends StatelessWidget {
  const _ProcessBento();

  @override
  Widget build(BuildContext context) {
    const steps = [
      ('01', 'Browse', 'Find a service or resource.'),
      ('02', 'Configure', 'Add the details we need.'),
      ('03', 'Confirm', 'Review the complete total.'),
      ('04', 'Track', 'Follow progress to completion.'),
    ];

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppTheme.ink,
        borderRadius: BorderRadius.circular(28),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const _SectionEyebrow(label: 'A CLEARER WAY FORWARD', light: true),
          const SizedBox(height: 8),
          Text('From â€œI need this” to â€œDone.”', style: Theme.of(context).textTheme.headlineMedium?.copyWith(color: Colors.white)),
          const SizedBox(height: 24),
          LayoutBuilder(
            builder: (context, constraints) {
              final columns = constraints.maxWidth >= 680 ? 4 : 2;
              return GridView.count(
                crossAxisCount: columns,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                childAspectRatio: 1.3,
                children: steps.map((step) {
                  return Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.white12),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(step.$1, style: const TextStyle(color: AppTheme.mango, fontWeight: FontWeight.w800)),
                        const Spacer(),
                        Text(step.$2, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800)),
                        const SizedBox(height: 6),
                        Text(step.$3, style: const TextStyle(color: Color(0xFFB8CAD8), fontSize: 12, height: 1.35)),
                      ],
                    ),
                  );
                }).toList(),
              );
            },
          ),
        ],
      ),
    );
  }
}

class _SectionEyebrow extends StatelessWidget {
  const _SectionEyebrow({required this.label, this.light = false});

  final String label;
  final bool light;

  @override
  Widget build(BuildContext context) {
    return Text(
      label,
      style: TextStyle(
        color: light ? AppTheme.mango : AppTheme.teal,
        fontSize: 10,
        fontWeight: FontWeight.w800,
        letterSpacing: 1.8,
      ),
    );
  }
}

class _Pill extends StatelessWidget {
  const _Pill({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white10,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: Colors.white24),
      ),
      child: Text(
        label,
        style: TextStyle(color: AppTheme.mango, fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: .8),
      ),
    );
  }
}

class _HeroStat extends StatelessWidget {
  const _HeroStat({required this.value, required this.label});

  final String value;
  final String label;

  @override
  Widget build(BuildContext context) {
    return RichText(
      text: TextSpan(
        style: const TextStyle(color: Color(0xFFB8CAD8), fontSize: 12),
        children: [
          TextSpan(text: value, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800)),
          TextSpan(text: ' $label'),
        ],
      ),
    );
  }
}
