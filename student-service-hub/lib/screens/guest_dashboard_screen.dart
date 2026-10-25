import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

class GuestDashboardScreen extends StatelessWidget {
  const GuestDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final requests = [
      _RequestItem(title: 'Need printing help', status: 'Pending approval', date: 'Today'),
      _RequestItem(title: 'Looking for calculator', status: 'Approved', date: 'Yesterday'),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Guest Dashboard'),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Public requests',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800),
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.primaryBlue,
                  borderRadius: BorderRadius.circular(18),
                ),
                child: const Row(
                  children: [
                    Expanded(
                      child: Text(
                        'You can browse services and post public requests.',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {},
                  child: const Text('Post a Request'),
                ),
              ),
              const SizedBox(height: 20),
              const Text(
                'Recent requests',
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 18),
              ),
              const SizedBox(height: 12),
              ...requests.map(
                (request) => Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.neutral100),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            request.title,
                            style: const TextStyle(
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            request.date,
                            style: const TextStyle(
                              color: AppTheme.neutral700,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryBlue.withOpacity(0.10),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          request.status,
                          style: const TextStyle(
                            color: AppTheme.primaryBlue,
                            fontWeight: FontWeight.w700,
                            fontSize: 11,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _RequestItem {
  const _RequestItem({
    required this.title,
    required this.status,
    required this.date,
  });

  final String title;
  final String status;
  final String date;
}
