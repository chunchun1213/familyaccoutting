// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'transaction_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(transactionRepository)
const transactionRepositoryProvider = TransactionRepositoryProvider._();

final class TransactionRepositoryProvider extends $FunctionalProvider<
    TransactionRepository,
    TransactionRepository,
    TransactionRepository> with $Provider<TransactionRepository> {
  const TransactionRepositoryProvider._()
      : super(
          from: null,
          argument: null,
          retry: null,
          name: r'transactionRepositoryProvider',
          isAutoDispose: true,
          dependencies: null,
          $allTransitiveDependencies: null,
        );

  @override
  String debugGetCreateSourceHash() => _$transactionRepositoryHash();

  @$internal
  @override
  $ProviderElement<TransactionRepository> $createElement(
          $ProviderPointer pointer) =>
      $ProviderElement(pointer);

  @override
  TransactionRepository create(Ref ref) {
    return transactionRepository(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(TransactionRepository value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<TransactionRepository>(value),
    );
  }
}

String _$transactionRepositoryHash() =>
    r'31e53bde2cd20cda40a2b5caa9bc93a81d3478cd';

@ProviderFor(TransactionList)
const transactionListProvider = TransactionListProvider._();

final class TransactionListProvider extends $AsyncNotifierProvider<
    TransactionList, List<transaction.Transaction>> {
  const TransactionListProvider._()
      : super(
          from: null,
          argument: null,
          retry: null,
          name: r'transactionListProvider',
          isAutoDispose: true,
          dependencies: null,
          $allTransitiveDependencies: null,
        );

  @override
  String debugGetCreateSourceHash() => _$transactionListHash();

  @$internal
  @override
  TransactionList create() => TransactionList();
}

String _$transactionListHash() => r'63f46ed132221607e3be9a77f1c69a3acffd0166';

abstract class _$TransactionList
    extends $AsyncNotifier<List<transaction.Transaction>> {
  FutureOr<List<transaction.Transaction>> build();
  @$mustCallSuper
  @override
  void runBuild() {
    final created = build();
    final ref = this.ref as $Ref<AsyncValue<List<transaction.Transaction>>,
        List<transaction.Transaction>>;
    final element = ref.element as $ClassProviderElement<
        AnyNotifier<AsyncValue<List<transaction.Transaction>>,
            List<transaction.Transaction>>,
        AsyncValue<List<transaction.Transaction>>,
        Object?,
        Object?>;
    element.handleValue(ref, created);
  }
}

@ProviderFor(FinancialSummary)
const financialSummaryProvider = FinancialSummaryProvider._();

final class FinancialSummaryProvider extends $AsyncNotifierProvider<
    FinancialSummary, transaction.FinancialSummary> {
  const FinancialSummaryProvider._()
      : super(
          from: null,
          argument: null,
          retry: null,
          name: r'financialSummaryProvider',
          isAutoDispose: true,
          dependencies: null,
          $allTransitiveDependencies: null,
        );

  @override
  String debugGetCreateSourceHash() => _$financialSummaryHash();

  @$internal
  @override
  FinancialSummary create() => FinancialSummary();
}

String _$financialSummaryHash() => r'05d867055dcfbf24c7adc77eb06096fc02af5db5';

abstract class _$FinancialSummary
    extends $AsyncNotifier<transaction.FinancialSummary> {
  FutureOr<transaction.FinancialSummary> build();
  @$mustCallSuper
  @override
  void runBuild() {
    final created = build();
    final ref = this.ref as $Ref<AsyncValue<transaction.FinancialSummary>,
        transaction.FinancialSummary>;
    final element = ref.element as $ClassProviderElement<
        AnyNotifier<AsyncValue<transaction.FinancialSummary>,
            transaction.FinancialSummary>,
        AsyncValue<transaction.FinancialSummary>,
        Object?,
        Object?>;
    element.handleValue(ref, created);
  }
}
