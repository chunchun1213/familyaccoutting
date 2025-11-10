import 'package:flutter/material.dart';
import '../../../data/models/transaction.dart';
import '../../../core/constants/app_constants.dart';

class FinancialSummaryWidget extends StatelessWidget {
  final FinancialSummary summary;

  const FinancialSummaryWidget({super.key, required this.summary});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        child: Column(
          children: [
            _buildSummaryRow(
              context,
              '總收入',
              summary.totalIncome,
              Colors.green,
              Icons.arrow_upward,
            ),
            const Divider(height: 32),
            _buildSummaryRow(
              context,
              '總支出',
              summary.totalExpense,
              Colors.red,
              Icons.arrow_downward,
            ),
            const Divider(height: 32),
            _buildSummaryRow(
              context,
              '結餘',
              summary.balance,
              summary.balance >= 0 ? Colors.blue : Colors.orange,
              Icons.account_balance_wallet,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryRow(
    BuildContext context,
    String label,
    double amount,
    Color color,
    IconData icon,
  ) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(width: 12),
            Text(
              label,
              style: Theme.of(context).textTheme.titleMedium,
            ),
          ],
        ),
        Text(
          '¥${amount.toStringAsFixed(2)}',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                color: color,
                fontWeight: FontWeight.bold,
              ),
        ),
      ],
    );
  }
}
