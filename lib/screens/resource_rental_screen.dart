import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

class ResourceRentalScreen extends StatelessWidget {
  const ResourceRentalScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final resources = [
      _RentalItem(
        name: 'Scientific Calculator',
        category: 'Tools',
        price: '₱80 / day',
        owner: 'Student Owner',
      ),
      _RentalItem(
        name: 'Laptop Stand',
        category: 'Equipment',
        price: '₱60 / day',
        owner: 'PASOA Verified',
      ),
      _RentalItem(
        name: 'Engineering Book',
        category: 'Books',
        price: '₱120 / week',
        owner: 'Student Owner',
      ),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Resource Rental'),
      ),
      body: SafeArea(
        child: ListView.separated(
          padding: const EdgeInsets.all(20),
          itemCount: resources.length,
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (context, index) {
            final resource = resources[index];
            return Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.neutral100),
              ),
              child: Row(
                children: [
                  Container(
                    width: 62,
                    height: 62,
                    decoration: BoxDecoration(
                      color: AppTheme.primaryGold.withOpacity(0.18),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: const Icon(
                      Icons.inventory,
                      color: AppTheme.neutral900,
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          resource.name,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          resource.category,
                          style: const TextStyle(
                            color: AppTheme.neutral700,
                            fontSize: 12,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          resource.owner,
                          style: const TextStyle(
                            color: AppTheme.primaryBlue,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        resource.price,
                        style: const TextStyle(
                          color: AppTheme.primaryBlue,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(height: 10),
                      ElevatedButton(
                        onPressed: () {},
                        style: ElevatedButton.styleFrom(
                          minimumSize: const Size(90, 38),
                        ),
                        child: const Text('Rent'),
                      ),
                    ],
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}

class _RentalItem {
  const _RentalItem({
    required this.name,
    required this.category,
    required this.price,
    required this.owner,
  });

  final String name;
  final String category;
  final String price;
  final String owner;
}
