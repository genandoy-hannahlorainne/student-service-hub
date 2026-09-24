import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

class PrintingServiceScreen extends StatelessWidget {
  const PrintingServiceScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Printing Service'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Create your printing order',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.neutral100),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Document Details'),
                    const SizedBox(height: 12),
                    TextFormField(
                      decoration: const InputDecoration(
                        labelText: 'Document title',
                        hintText: 'Thesis Chapter 3',
                      ),
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      maxLines: 3,
                      decoration: const InputDecoration(
                        labelText: 'Instructions',
                        hintText: 'Double-sided, color, staple binding',
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.neutral100),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Print Settings'),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: const [
                        ChoiceChip(label: Text('A4'), selected: true),
                        ChoiceChip(label: Text('Short Bond Paper'), selected: false),
                        ChoiceChip(label: Text('Colored'), selected: false),
                        ChoiceChip(label: Text('Black & White'), selected: false),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: const [
                        Expanded(
                          child: TextField(
                            decoration: InputDecoration(labelText: 'Qty'),
                          ),
                        ),
                        SizedBox(width: 12),
                        Expanded(
                          child: TextField(
                            decoration: InputDecoration(labelText: 'Pages'),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.primaryBlue.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.primaryBlue.withOpacity(0.15)),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Estimated Total',
                      style: TextStyle(
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    Text(
                      '₱180.00',
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
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {},
                  child: const Text('Confirm Order'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
