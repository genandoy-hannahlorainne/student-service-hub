import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

class CreateRentalPostScreen extends StatelessWidget {
  const CreateRentalPostScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Create Rental Post'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Post an item you want to rent out',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 20),
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Item name',
                  hintText: 'Laptop Stand',
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Category',
                  hintText: 'Books, Tools, Equipment',
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Rental price',
                  hintText: '₱60 / day',
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                maxLines: 4,
                decoration: const InputDecoration(
                  labelText: 'Description',
                  hintText: 'Include condition and availability details',
                ),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {},
                  child: const Text('Submit Post'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
