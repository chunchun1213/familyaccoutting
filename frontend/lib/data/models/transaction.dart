class Transaction {
  final String id;
  final String userId;
  final String type;
  final String category;
  final double amount;
  final String? note;
  final DateTime createdAt;
  final bool synced;

  Transaction({
    required this.id,
    required this.userId,
    required this.type,
    required this.category,
    required this.amount,
    this.note,
    required this.createdAt,
    this.synced = true,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'] as String,
      userId: json['userId'] as String? ?? json['user_id'] as String,
      type: json['type'] as String,
      category: json['category'] as String,
      amount: (json['amount'] as num).toDouble(),
      note: json['note'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String? ?? json['created_at'] as String),
      synced: json['synced'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'type': type,
      'category': category,
      'amount': amount,
      'note': note,
      'createdAt': createdAt.toIso8601String(),
      'synced': synced,
    };
  }
}

class TransactionListResponse {
  final bool success;
  final String? message;
  final List<Transaction> data;

  TransactionListResponse({
    required this.success,
    this.message,
    required this.data,
  });

  factory TransactionListResponse.fromJson(Map<String, dynamic> json) {
    final dataList = json['data'] as List<dynamic>;
    return TransactionListResponse(
      success: json['success'] as bool,
      message: json['message'] as String?,
      data: dataList.map((item) => Transaction.fromJson(item as Map<String, dynamic>)).toList(),
    );
  }
}

class FinancialSummary {
  final double totalIncome;
  final double totalExpense;
  final double balance;
  final Map<String, double> incomeByCategory;
  final Map<String, double> expenseByCategory;

  FinancialSummary({
    required this.totalIncome,
    required this.totalExpense,
    required this.balance,
    required this.incomeByCategory,
    required this.expenseByCategory,
  });

  factory FinancialSummary.fromJson(Map<String, dynamic> json) {
    return FinancialSummary(
      totalIncome: (json['totalIncome'] as num?)?.toDouble() ?? 0.0,
      totalExpense: (json['totalExpense'] as num?)?.toDouble() ?? 0.0,
      balance: (json['balance'] as num?)?.toDouble() ?? 0.0,
      incomeByCategory: Map<String, double>.from(json['incomeByCategory'] as Map? ?? {}),
      expenseByCategory: Map<String, double>.from(json['expenseByCategory'] as Map? ?? {}),
    );
  }
}
