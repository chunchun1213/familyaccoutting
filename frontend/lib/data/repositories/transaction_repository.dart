import 'package:dio/dio.dart';
import '../../services/api_service.dart';
import '../../core/constants/api_constants.dart';
import '../models/transaction.dart';

class TransactionRepository {
  final _api = ApiService();

  Future<List<Transaction>> getTransactions({
    int? limit,
    String? cursor,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (limit != null) queryParams['limit'] = limit;
      if (cursor != null) queryParams['cursor'] = cursor;

      final response = await _api.get(
        ApiConstants.transactions,
        queryParameters: queryParams,
      );

      final responseData = response.data as Map<String, dynamic>;
      if (responseData['success'] == true && responseData['data'] != null) {
        final dataList = responseData['data'] as List<dynamic>;
        return dataList
            .map((item) => Transaction.fromJson(item as Map<String, dynamic>))
            .toList();
      }
      return [];
    } on DioException catch (e) {
      throw Exception(e.error ?? '查詢交易記錄失敗');
    }
  }

  Future<Transaction> createTransaction({
    required String type,
    required String category,
    required double amount,
    String? note,
  }) async {
    try {
      final response = await _api.post(
        ApiConstants.transactions,
        data: {
          'type': type,
          'category': category,
          'amount': amount,
          if (note != null) 'note': note,
        },
      );

      final responseData = response.data as Map<String, dynamic>;
      if (responseData['success'] == true && responseData['data'] != null) {
        return Transaction.fromJson(responseData['data'] as Map<String, dynamic>);
      }
      throw Exception('建立交易記錄失敗');
    } on DioException catch (e) {
      throw Exception(e.error ?? '建立交易記錄失敗');
    }
  }

  Future<FinancialSummary> getSummary({String period = 'month'}) async {
    try {
      final response = await _api.get(
        ApiConstants.summary,
        queryParameters: {'period': period},
      );

      final responseData = response.data as Map<String, dynamic>;
      if (responseData['success'] == true && responseData['data'] != null) {
        return FinancialSummary.fromJson(responseData['data'] as Map<String, dynamic>);
      }
      return FinancialSummary(
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        incomeByCategory: {},
        expenseByCategory: {},
      );
    } on DioException catch (e) {
      throw Exception(e.error ?? '查詢財務概覽失敗');
    }
  }
}
