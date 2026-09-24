import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

class SchoolSuppliesScreen extends StatelessWidget {
  const SchoolSuppliesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final supplies = [
      _SupplyItem(
        name: 'Bond Paper A4',
        price: '₱80 / pack',
        stock: 'In stock',
      ),
      _SupplyItem(
        name: 'Yellow Pad',
        price: '₱65 / pack',
        stock: 'Low stock',
      ),
      _SupplyItem(
        name: 'Index Cards',
        price: '₱40 / pack',
        stock: 'In stock',
      ),
      _SupplyItem(
        name: 'Ballpoint Pen',
        price: '₱25 / box',
        stock: 'In stock',
      ),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('School Supplies'),
      ),
      body: SafeArea(
        child: ListView.separated(
          padding: const EdgeInsets.all(20),
          itemCount: supplies.length,
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (context, index) {
            final item = supplies[index];
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
                      color: AppTheme.primaryBlue.withOpacity(0.09),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: const Icon(
                      Icons.inventory_2_outlined,
                      color: AppTheme.primaryBlue,
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          item.name,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          item.price,
                          style: const TextStyle(
                            color: AppTheme.primaryBlue,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          item.stock,
                          style: const TextStyle(
                            fontSize: 12,
                            color: AppTheme.neutral700,
                          ),
                        ),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryGold,
                      foregroundColor: AppTheme.neutral900,
                    ),
                    child: const Text('Add'),
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

class _SupplyItem {
  const _SupplyItem({
    required this.name,
    required this.price,
    required this.stock,
  });

  final String name;
  final String price;
  final String stock;
}
