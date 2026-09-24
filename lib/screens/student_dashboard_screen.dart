import 'package:flutter/material.dart';

import '../theme/app_theme.dart';
import 'create_rental_post_screen.dart';
import 'order_tracking_screen.dart';
import 'printing_service_screen.dart';
import 'resource_rental_screen.dart';
import 'school_supplies_screen.dart';

class StudentDashboardScreen extends StatelessWidget {
  const StudentDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final quickServices = [
      _ServiceItem(
        title: 'Printing',
        subtitle: 'Upload files',
        color: AppTheme.primaryBlue,
        icon: Icons.print_outlined,
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute(builder: (_) => const PrintingServiceScreen()),
          );
        },
      ),
      _ServiceItem(
        title: 'Supplies',
        subtitle: 'Stationery & notes',
        color: AppTheme.primaryGold,
        icon: Icons.school_outlined,
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute(builder: (_) => const SchoolSuppliesScreen()),
          );
        },
      ),
      _ServiceItem(
        title: 'Rental',
        subtitle: 'Borrow tools',
        color: AppTheme.neutral700,
        icon: Icons.inventory_2_outlined,
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute(builder: (_) => const ResourceRentalScreen()),
          );
        },
      ),
    ];

    final recentOrders = [
      _RecentOrder(
        service: 'Printing Service',
        status: 'Processing',
        amount: '₱180.00',
      ),
      _RecentOrder(
        service: 'Book Rental',
        status: 'Confirmed',
        amount: '₱120.00',
      ),
    ];

    return Scaffold(
      backgroundColor: AppTheme.neutral50,
      appBar: AppBar(
        title: const Text('Student Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none_outlined),
            onPressed: () {},
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Welcome back,',
                          style: TextStyle(
                            fontSize: 14,
                            color: AppTheme.neutral700,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Janelle D.',
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                      ],
                    ),
                  ),
                  CircleAvatar(
                    radius: 26,
                    backgroundColor: AppTheme.primaryBlue,
                    child: const Text(
                      'JD',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [AppTheme.primaryBlue, Color(0xFF0F4EA8)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Available Balance',
                      style: TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      '₱1,250.00',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 30,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton(
                            onPressed: () {
                              Navigator.of(context).push(
                                MaterialPageRoute(
                                  builder: (_) => const PrintingServiceScreen(),
                                ),
                              );
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.primaryGold,
                              foregroundColor: AppTheme.neutral900,
                            ),
                            child: const Text('Order Now'),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Quick Services',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 12),
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: quickServices.length,
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  childAspectRatio: 0.9,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                ),
                itemBuilder: (context, index) {
                  final item = quickServices[index];
                  return InkWell(
                    onTap: item.onTap,
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppTheme.neutral100),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            width: 42,
                            height: 42,
                            decoration: BoxDecoration(
                              color: item.color.withOpacity(0.12),
                              shape: BoxShape.circle,
                            ),
                            child: Icon(item.icon, color: item.color),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            item.title,
                            style: const TextStyle(
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            item.subtitle,
                            style: const TextStyle(
                              fontSize: 11,
                              color: AppTheme.neutral700,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
              const SizedBox(height: 24),
              Text(
                'Recent orders',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 12),
              ...recentOrders.map(
                (order) => InkWell(
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => const OrderTrackingScreen(),
                      ),
                    );
                  },
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppTheme.neutral100),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                order.service,
                                style: const TextStyle(
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              const SizedBox(height: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                  vertical: 4,
                                ),
                                decoration: BoxDecoration(
                                  color: AppTheme.primaryBlue.withOpacity(0.10),
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: Text(
                                  order.status,
                                  style: const TextStyle(
                                    color: AppTheme.primaryBlue,
                                    fontSize: 12,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        Text(
                          order.amount,
                          style: const TextStyle(
                            fontWeight: FontWeight.w800,
                            color: AppTheme.neutral900,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => const CreateRentalPostScreen(),
                      ),
                    );
                  },
                  child: const Text('Create Rental Post'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ServiceItem {
  const _ServiceItem({
    required this.title,
    required this.subtitle,
    required this.color,
    required this.icon,
    required this.onTap,
  });

  final String title;
  final String subtitle;
  final Color color;
  final IconData icon;
  final VoidCallback onTap;
}

class _RecentOrder {
  const _RecentOrder({
    required this.service,
    required this.status,
    required this.amount,
  });

  final String service;
  final String status;
  final String amount;
}
