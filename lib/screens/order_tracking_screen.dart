import 'package:flutter/material.dart';

import '../theme/app_theme.dart';
import 'transaction_receipt_screen.dart';

class OrderTrackingScreen extends StatelessWidget {
  const OrderTrackingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final steps = [
      _StepItem(label: 'Order Received', current: false),
      _StepItem(label: 'Processing', current: false),
      _StepItem(label: 'Ready for Pick-up', current: true),
      _StepItem(label: 'Completed', current: false),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Order Tracking'),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.neutral100),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Order #PST-2048',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    Text(
                      'Ready for pickup',
                      style: TextStyle(
                        color: AppTheme.primaryBlue,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              const Text(
                'Progress',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 18),
              ...steps.map(
                (step) => Padding(
                  padding: const EdgeInsets.only(bottom: 14),
                  child: Row(
                    children: [
                      Container(
                        width: 24,
                        height: 24,
                        decoration: BoxDecoration(
                          color: step.current ? AppTheme.primaryBlue : AppTheme.neutral300,
                          shape: BoxShape.circle,
                        ),
                        child: step.current
                            ? const Icon(
                                Icons.check,
                                size: 16,
                                color: Colors.white,
                              )
                            : null,
                      ),
                      const SizedBox(width: 12),
                      Text(
                        step.label,
                        style: TextStyle(
                          fontWeight: step.current ? FontWeight.w700 : FontWeight.w500,
                          color: step.current ? AppTheme.primaryBlue : AppTheme.neutral700,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => const TransactionReceiptScreen(),
                      ),
                    );
                  },
                  child: const Text('View Receipt'),
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: () {},
                  child: const Text('Contact Provider'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _StepItem {
  const _StepItem({required this.label, required this.current});

  final String label;
  final bool current;
}
