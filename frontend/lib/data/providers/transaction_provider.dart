import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/transaction.dart' as transaction;
import '../repositories/transaction_repository.dart';

part 'transaction_provider.g.dart';

@riverpod
TransactionRepository transactionRepository(Ref ref) {
  return TransactionRepository();
}

@riverpod
class TransactionList extends _$TransactionList {
  @override
  Future<List<transaction.Transaction>> build() async {
    return await _loadTransactions();
  }

  Future<List<transaction.Transaction>> _loadTransactions({int limit = 100}) async {
    final repository = ref.read(transactionRepositoryProvider);
    return await repository.getTransactions(limit: limit);
  }

  Future<void> loadTransactions({int limit = 100}) async {
    state = const AsyncLoading();
    try {
      final transactions = await _loadTransactions(limit: limit);
      state = AsyncData(transactions);
    } catch (e, stack) {
      state = AsyncError(e, stack);
    }
  }

  Future<void> addTransaction({
    required String type,
    required String category,
    required double amount,
    String? note,
  }) async {
    final repository = ref.read(transactionRepositoryProvider);
    try {
      final newTransaction = await repository.createTransaction(
        type: type,
        category: category,
        amount: amount,
        note: note,
      );
      
      final current = state.value ?? [];
      state = AsyncData([newTransaction, ...current]);
    } catch (e, stack) {
      state = AsyncError(e, stack);
      rethrow;
    }
  }

  Future<void> refresh() async {
    await loadTransactions();
  }
}

@riverpod
class FinancialSummary extends _$FinancialSummary {
  @override
  Future<transaction.FinancialSummary> build() async {
    return await _loadSummary();
  }

  Future<transaction.FinancialSummary> _loadSummary({String period = 'month'}) async {
    final repository = ref.read(transactionRepositoryProvider);
    return await repository.getSummary(period: period);
  }

  Future<void> loadSummary({String period = 'month'}) async {
    state = const AsyncLoading();
    try {
      final summary = await _loadSummary(period: period);
      state = AsyncData(summary);
    } catch (e, stack) {
      state = AsyncError(e, stack);
    }
  }

  Future<void> refresh() async {
    await loadSummary();
  }
}
