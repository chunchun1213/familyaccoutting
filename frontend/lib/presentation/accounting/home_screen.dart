import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/constants/app_constants.dart';
import '../../data/providers/auth_provider.dart';
import '../../data/providers/transaction_provider.dart';
import '../common/widgets/loading_indicator.dart';
import '../common/widgets/error_display.dart';
import '../auth/login_screen.dart';
import 'widgets/financial_summary.dart';
import 'widgets/transaction_list.dart';
import 'add_transaction_screen.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(financialSummaryProvider.notifier).loadSummary();
      ref.read(transactionListProvider.notifier).loadTransactions();
    });
  }

  Future<void> _handleRefresh() async {
    await Future.wait([
      ref.read(financialSummaryProvider.notifier).refresh(),
      ref.read(transactionListProvider.notifier).refresh(),
    ]);
  }

  Future<void> _handleLogout() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('確認登出'),
        content: const Text('您確定要登出嗎?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('取消'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('登出'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      await ref.read(authStateProvider.notifier).logout();
      if (mounted) {
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (_) => const LoginScreen()),
          (route) => false,
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final userState = ref.watch(authStateProvider);
    final summaryState = ref.watch(financialSummaryProvider);
    final transactionsState = ref.watch(transactionListProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text(AppConstants.appName),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _handleLogout,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _handleRefresh,
        child: CustomScrollView(
          slivers: [
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(AppConstants.defaultPadding),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    userState.when(
                      data: (user) {
                        if (user != null) {
                          return Text(
                            '您好, ${user.name}',
                            style: Theme.of(context).textTheme.headlineSmall,
                          );
                        }
                        return const SizedBox.shrink();
                      },
                      loading: () => const SizedBox.shrink(),
                      error: (_, __) => const SizedBox.shrink(),
                    ),
                    const SizedBox(height: 24),
                    summaryState.when(
                      data: (summary) => FinancialSummaryWidget(summary: summary),
                      loading: () => const LoadingIndicator(),
                      error: (error, _) => ErrorDisplay(
                        message: error.toString(),
                        onRetry: () => ref.read(financialSummaryProvider.notifier).refresh(),
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      '最近交易',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                  ],
                ),
              ),
            ),
            transactionsState.when(
              data: (transactions) => TransactionListWidget(transactions: transactions),
              loading: () => const SliverToBoxAdapter(child: LoadingIndicator()),
              error: (error, _) => SliverToBoxAdapter(
                child: ErrorDisplay(
                  message: error.toString(),
                  onRetry: () => ref.read(transactionListProvider.notifier).refresh(),
                ),
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          final result = await Navigator.of(context).push<bool>(
            MaterialPageRoute(builder: (_) => const AddTransactionScreen()),
          );
          if (result == true) {
            _handleRefresh();
          }
        },
        icon: const Icon(Icons.add),
        label: const Text('新增記錄'),
      ),
    );
  }
}
