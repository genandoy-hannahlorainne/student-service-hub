import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

class TransactionReceiptScreen extends StatelessWidget {
  const TransactionReceiptScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final details = [
      _ReceiptRow(label: 'Transaction ID', value: 'TXN-2025-089'),
      _ReceiptRow(label: 'Order Reference', value: 'ORD-2025-001'),
      _ReceiptRow(label: 'Date', value: 'Dec 10, 2025 · 2:45 PM'),
      _ReceiptRow(label: 'Payment Status', value: 'Paid', highlight: true),
    ];

    final serviceDetails = [
      _ReceiptRow(label: 'Service Type', value: 'Printing Service'),
      _ReceiptRow(label: 'File', value: 'thesis_chapter1_final.pdf (12 pages)'),
      _ReceiptRow(label: 'Specifications', value: '2 copies • Black & White • Single-sided'),
      _ReceiptRow(label: 'Delivery', value: 'Room 201, PUP Taguig Main Building'),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Transaction Receipt'),
        actions: [
          IconButton(
            icon: const Icon(Icons.print_outlined),
            onPressed: () {},
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: AppTheme.neutral100),
                ),
                child: Column(
                  children: [
                    const Text(
                      'Official Receipt',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 1.4,
                        color: AppTheme.neutral700,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'PASOA Student Services',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'PUP Taguig Campus • Taguig City, Metro Manila',
                      style: TextStyle(
                        color: AppTheme.neutral700,
                        fontSize: 13,
                      ),
                    ),
                    const SizedBox(height: 20),
                    const Divider(),
                    const SizedBox(height: 18),
                    ...details.map(
                      (item) => Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              '${item.label}:',
                              style: const TextStyle(color: AppTheme.neutral700),
                            ),
                            item.highlight
                                ? Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 10,
                                      vertical: 5,
                                    ),
                                    decoration: BoxDecoration(
                                      color: Colors.green.shade50,
                                      borderRadius: BorderRadius.circular(999),
                                    ),
                                    child: Text(
                                      item.value,
                                      style: const TextStyle(
                                        color: Colors.green,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                  )
                                : Text(
                                    item.value,
                                    style: const TextStyle(
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: AppTheme.neutral100),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Service Details',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 14),
                    ...serviceDetails.map(
                      (item) => Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            SizedBox(
                              width: 120,
                              child: Text(
                                '${item.label}:',
                                style: const TextStyle(color: AppTheme.neutral700),
                              ),
                            ),
                            Expanded(
                              child: Text(
                                item.value,
                                style: const TextStyle(
                                  fontWeight: FontWeight.w600,
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
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: AppTheme.primaryBlue.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: AppTheme.primaryBlue.withOpacity(0.15)),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Total Amount Paid',
                      style: TextStyle(fontWeight: FontWeight.w700),
                    ),
                    Text(
                      '₱70.00',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.primaryBlue,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.of(context).pop(),
                      child: const Text('Back to Orders'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Print dialog is ready for PDF export.'),
                          ),
                        );
                      },
                      child: const Text('Print / Save'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ReceiptRow {
  const _ReceiptRow({
    required this.label,
    required this.value,
    this.highlight = false,
  });

  final String label;
  final String value;
  final bool highlight;
}
