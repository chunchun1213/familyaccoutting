# Flutter 前端 UI 流程完整規格

**功能分支**: `001-member-accounting`  
**建立日期**: 2025-11-12  
**版本**: 1.0  
**基於**: [1-Flutter 前端設計規格書.md](../../../doc/SDD-Docs/1-Flutter前端設計規格書.md)

## 目錄

1. [狀態管理架構](#狀態管理架構)
2. [完整畫面流程](#完整畫面流程)
3. [導航邏輯](#導航邏輯)
4. [狀態轉換規則](#狀態轉換規則)
5. [錯誤處理流程](#錯誤處理流程)
6. [本地儲存策略](#本地儲存策略)

---

## 狀態管理架構

### Riverpod Providers 定義

```dart
// lib/providers/auth_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../repositories/auth_repository.dart';
import '../models/user.dart';

// 認證狀態
class AuthState {
  final User? user;
  final bool isLoading;
  final String? error;

  const AuthState({
    this.user,
    this.isLoading = false,
    this.error,
  });

  AuthState copyWith({
    User? user,
    bool? isLoading,
    String? error,
  }) {
    return AuthState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

// 認證狀態 Notifier
class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository _repository;

  AuthNotifier(this._repository) : super(const AuthState()) {
    _checkSession();
  }

  // 檢查本地會話
  Future<void> _checkSession() async {
    state = state.copyWith(isLoading: true);
    try {
      final user = await _repository.getCurrentUser();
      state = AuthState(user: user, isLoading: false);
    } catch (e) {
      state = AuthState(user: null, isLoading: false);
    }
  }

  // 註冊
  Future<bool> register({
    required String name,
    required String email,
    required String password,
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _repository.register(name: name, email: email, password: password);
      state = state.copyWith(isLoading: false);
      return true;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      return false;
    }
  }

  // 驗證 Email
  Future<bool> verifyEmail({
    required String email,
    required String code,
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final user = await _repository.verifyEmail(email: email, code: code);
      state = AuthState(user: user, isLoading: false);
      return true;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      return false;
    }
  }

  // 登入
  Future<bool> signIn({
    required String email,
    required String password,
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final user = await _repository.signIn(email: email, password: password);
      state = AuthState(user: user, isLoading: false);
      return true;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      return false;
    }
  }

  // 登出
  Future<void> signOut() async {
    await _repository.signOut();
    state = const AuthState();
  }
}

// Provider 定義
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository();
});

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref.watch(authRepositoryProvider));
});
```

```dart
// lib/providers/transaction_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/transaction.dart';
import '../repositories/transaction_repository.dart';

// 交易列表狀態
class TransactionState {
  final List<Transaction> transactions;
  final bool isLoading;
  final String? error;

  const TransactionState({
    this.transactions = const [],
    this.isLoading = false,
    this.error,
  });

  TransactionState copyWith({
    List<Transaction>? transactions,
    bool? isLoading,
    String? error,
  }) {
    return TransactionState(
      transactions: transactions ?? this.transactions,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }

  // 計算總收入
  double get totalIncome {
    return transactions
        .where((t) => t.type == 'income')
        .fold(0.0, (sum, t) => sum + t.amount);
  }

  // 計算總支出
  double get totalExpense {
    return transactions
        .where((t) => t.type == 'expense')
        .fold(0.0, (sum, t) => sum + t.amount);
  }

  // 計算結餘
  double get balance => totalIncome - totalExpense;
}

// 交易狀態 Notifier
class TransactionNotifier extends StateNotifier<TransactionState> {
  final TransactionRepository _repository;

  TransactionNotifier(this._repository) : super(const TransactionState()) {
    loadTransactions();
  }

  // 載入交易記錄
  Future<void> loadTransactions() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final transactions = await _repository.getTransactions();
      state = TransactionState(transactions: transactions, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  // 新增交易
  Future<bool> addTransaction(Transaction transaction) async {
    try {
      final newTransaction = await _repository.createTransaction(transaction);
      state = TransactionState(
        transactions: [newTransaction, ...state.transactions],
        isLoading: false,
      );
      return true;
    } catch (e) {
      state = state.copyWith(error: e.toString());
      return false;
    }
  }

  // 刪除交易
  Future<bool> deleteTransaction(String id) async {
    try {
      await _repository.deleteTransaction(id);
      state = TransactionState(
        transactions: state.transactions.where((t) => t.id != id).toList(),
        isLoading: false,
      );
      return true;
    } catch (e) {
      state = state.copyWith(error: e.toString());
      return false;
    }
  }
}

// Provider 定義
final transactionRepositoryProvider = Provider<TransactionRepository>((ref) {
  return TransactionRepository();
});

final transactionProvider =
    StateNotifierProvider<TransactionNotifier, TransactionState>((ref) {
  return TransactionNotifier(ref.watch(transactionRepositoryProvider));
});
```

---

## 完整畫面流程

### 1. 啟動流程 (SplashScreen → 自動導航)

```dart
// lib/screens/splash_screen.dart

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _checkAuthAndNavigate();
  }

  Future<void> _checkAuthAndNavigate() async {
    // 等待認證狀態載入
    await Future.delayed(const Duration(seconds: 1));

    if (!mounted) return;

    final authState = ref.read(authProvider);

    // 根據認證狀態導航
    if (authState.user != null) {
      // 已登入 → 記帳主頁
      Navigator.pushReplacementNamed(context, AppRoutes.home);
    } else {
      // 未登入 → 登入頁面
      Navigator.pushReplacementNamed(context, AppRoutes.signIn);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: AppGradients.headerGradient,
        ),
        child: Center(
          child: CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(AppColors.textPrimary),
            strokeWidth: 3.0,
          ),
        ),
      ),
    );
  }
}
```

### 2. 登入頁面流程

```dart
// lib/screens/sign_in_screen.dart

class SignInScreen extends ConsumerStatefulWidget {
  const SignInScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends ConsumerState<SignInScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleSignIn() async {
    if (!_formKey.currentState!.validate()) return;

    final success = await ref.read(authProvider.notifier).signIn(
          email: _emailController.text.trim(),
          password: _passwordController.text,
        );

    if (!mounted) return;

    if (success) {
      // 登入成功 → 記帳主頁
      Navigator.pushReplacementNamed(context, AppRoutes.home);
    } else {
      // 顯示錯誤訊息
      final error = ref.read(authProvider).error;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(error ?? '登入失敗,請稍後再試'),
          backgroundColor: AppColors.error,
        ),
      );
    }
  }

  void _navigateToSignUp() {
    Navigator.pushNamed(context, AppRoutes.signUp);
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              _buildHeader(),
              _buildFormContainer(authState),
            ],
          ),
        ),
      ),
    );
  }

  // ... Header 和 Form 實作 (參考設計規格書)
}
```

### 3. 註冊頁面流程

```dart
// lib/screens/sign_up_screen.dart

class SignUpScreen extends ConsumerStatefulWidget {
  const SignUpScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends ConsumerState<SignUpScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _handleSignUp() async {
    if (!_formKey.currentState!.validate()) return;

    // 檢查密碼是否一致
    if (_passwordController.text != _confirmPasswordController.text) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('兩次輸入的密碼不一致'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    final success = await ref.read(authProvider.notifier).register(
          name: _nameController.text.trim(),
          email: _emailController.text.trim(),
          password: _passwordController.text,
        );

    if (!mounted) return;

    if (success) {
      // 註冊成功 → 驗證頁面
      Navigator.pushReplacementNamed(
        context,
        AppRoutes.verification,
        arguments: {'email': _emailController.text.trim()},
      );
    } else {
      // 顯示錯誤訊息
      final error = ref.read(authProvider).error;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(error ?? '註冊失敗,請稍後再試'),
          backgroundColor: AppColors.error,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              _buildHeader(),
              _buildFormContainer(authState),
            ],
          ),
        ),
      ),
    );
  }

  // ... Header 和 Form 實作
}
```

### 4. 驗證頁面流程

```dart
// lib/screens/verification_screen.dart

class VerificationScreen extends ConsumerStatefulWidget {
  final String email;

  const VerificationScreen({
    Key? key,
    required this.email,
  }) : super(key: key);

  @override
  ConsumerState<VerificationScreen> createState() =>
      _VerificationScreenState();
}

class _VerificationScreenState extends ConsumerState<VerificationScreen> {
  final _codeController = TextEditingController();
  int _timeLeft = 300; // 5 分鐘 = 300 秒
  bool _canResend = false;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  @override
  void dispose() {
    _codeController.dispose();
    _timer?.cancel();
    super.dispose();
  }

  void _startTimer() {
    _timer?.cancel();
    setState(() {
      _timeLeft = 300;
      _canResend = false;
    });

    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_timeLeft > 0) {
        setState(() => _timeLeft--);
      } else {
        timer.cancel();
        setState(() => _canResend = true);
      }
    });
  }

  Future<void> _handleVerify() async {
    if (_codeController.text.length != 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('請輸入 6 位數驗證碼'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    final success = await ref.read(authProvider.notifier).verifyEmail(
          email: widget.email,
          code: _codeController.text,
        );

    if (!mounted) return;

    if (success) {
      // 驗證成功 → 自動登入 → 記帳主頁
      Navigator.pushNamedAndRemoveUntil(
        context,
        AppRoutes.home,
        (route) => false,
      );
    } else {
      // 顯示錯誤訊息
      final error = ref.read(authProvider).error;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(error ?? '驗證失敗,請檢查驗證碼'),
          backgroundColor: AppColors.error,
        ),
      );
      _codeController.clear();
    }
  }

  Future<void> _handleResend() async {
    if (!_canResend) return;

    // 重新發送驗證碼 (呼叫註冊 API)
    final success = await ref.read(authProvider.notifier).register(
          name: '', // 後端會忽略
          email: widget.email,
          password: '', // 後端會忽略
        );

    if (!mounted) return;

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('驗證碼已重新發送'),
          backgroundColor: AppColors.success,
        ),
      );
      _startTimer();
    } else {
      final error = ref.read(authProvider).error;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(error ?? '重新發送失敗'),
          backgroundColor: AppColors.error,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              _buildHeader(),
              _buildFormContainer(authState),
            ],
          ),
        ),
      ),
    );
  }

  // ... Header 和 Form 實作
}
```

### 5. 記帳主頁流程

```dart
// lib/screens/expense_tracker_screen.dart

class ExpenseTrackerScreen extends ConsumerStatefulWidget {
  const ExpenseTrackerScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<ExpenseTrackerScreen> createState() =>
      _ExpenseTrackerScreenState();
}

class _ExpenseTrackerScreenState extends ConsumerState<ExpenseTrackerScreen> {
  @override
  void initState() {
    super.initState();
    // 載入交易記錄
    Future.microtask(
      () => ref.read(transactionProvider.notifier).loadTransactions(),
    );
  }

  Future<void> _handleSignOut() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('確認登出'),
        content: Text('確定要登出嗎？'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: Text('取消'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: Text('確定'),
            style: TextButton.styleFrom(
              foregroundColor: AppColors.error,
            ),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      await ref.read(authProvider.notifier).signOut();
      if (!mounted) return;
      Navigator.pushReplacementNamed(context, AppRoutes.signIn);
    }
  }

  Future<void> _showAddTransactionModal() async {
    await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => AddTransactionModal(),
    );
  }

  Future<void> _handleDeleteTransaction(String id) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('確認刪除'),
        content: Text('確定要刪除這筆記錄嗎？'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: Text('取消'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: Text('確定'),
            style: TextButton.styleFrom(
              foregroundColor: AppColors.error,
            ),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      final success =
          await ref.read(transactionProvider.notifier).deleteTransaction(id);
      if (!mounted) return;

      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('已刪除'),
            backgroundColor: AppColors.success,
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('刪除失敗'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final transactionState = ref.watch(transactionProvider);

    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            Column(
              children: [
                _buildHeader(authState),
                Expanded(
                  child: Container(
                    color: AppColors.backgroundGray,
                    child: _buildTransactionList(transactionState),
                  ),
                ),
              ],
            ),
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: _buildAddButton(),
            ),
          ],
        ),
      ),
    );
  }

  // ... Header、TransactionList、AddButton 實作
}
```

### 6. 新增交易彈窗

```dart
// lib/widgets/add_transaction_modal.dart

class AddTransactionModal extends ConsumerStatefulWidget {
  const AddTransactionModal({Key? key}) : super(key: key);

  @override
  ConsumerState<AddTransactionModal> createState() =>
      _AddTransactionModalState();
}

class _AddTransactionModalState extends ConsumerState<AddTransactionModal> {
  final _formKey = GlobalKey<FormState>();
  final _amountController = TextEditingController();
  final _descriptionController = TextEditingController();

  String _selectedType = 'expense';
  String? _selectedCategory;

  @override
  void dispose() {
    _amountController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  List<String> get _categories {
    if (_selectedType == 'income') {
      return ['薪資', '獎金', '投資', '兼職', '其他'];
    } else {
      return ['餐飲', '交通', '購物', '娛樂', '醫療', '教育', '住宅', '其他'];
    }
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedCategory == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('請選擇分類'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    final transaction = Transaction(
      id: '', // 後端產生
      userId: '', // 後端自動填入
      type: _selectedType,
      category: _selectedCategory!,
      amount: double.parse(_amountController.text),
      description: _descriptionController.text.trim(),
      transactionDate: DateTime.now(),
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );

    final success =
        await ref.read(transactionProvider.notifier).addTransaction(transaction);

    if (!mounted) return;

    if (success) {
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('已新增'),
          backgroundColor: AppColors.success,
        ),
      );
    } else {
      final error = ref.read(transactionProvider).error;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(error ?? '新增失敗'),
          backgroundColor: AppColors.error,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppBorderRadius.radiusTopLg,
      ),
      padding: EdgeInsets.fromLTRB(
        24.0,
        24.0,
        24.0,
        MediaQuery.of(context).viewInsets.bottom + 24.0,
      ),
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildHeader(),
            SizedBox(height: 24.0),
            _buildTypeButtons(),
            SizedBox(height: 16.0),
            _buildAmountInput(),
            SizedBox(height: 16.0),
            _buildCategoryDropdown(),
            SizedBox(height: 16.0),
            _buildDescriptionInput(),
            SizedBox(height: 24.0),
            _buildSubmitButton(),
          ],
        ),
      ),
    );
  }

  // ... UI 元件實作
}
```

---

## 導航邏輯

### 路由定義

```dart
// lib/routes/app_routes.dart

class AppRoutes {
  static const String splash = '/';
  static const String signIn = '/signin';
  static const String signUp = '/signup';
  static const String verification = '/verification';
  static const String home = '/home';

  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case splash:
        return MaterialPageRoute(builder: (_) => SplashScreen());

      case signIn:
        return MaterialPageRoute(builder: (_) => SignInScreen());

      case signUp:
        return MaterialPageRoute(builder: (_) => SignUpScreen());

      case verification:
        final args = settings.arguments as Map<String, dynamic>?;
        final email = args?['email'] as String? ?? '';
        return MaterialPageRoute(
          builder: (_) => VerificationScreen(email: email),
        );

      case home:
        return MaterialPageRoute(builder: (_) => ExpenseTrackerScreen());

      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('頁面不存在: ${settings.name}'),
            ),
          ),
        );
    }
  }
}
```

### 導航規則

```
[啟動] → 檢查會話
  ├─ 有效會話 → [記帳主頁]
  └─ 無會話 → [登入頁面]

[登入頁面]
  ├─ 登入成功 → [記帳主頁] (pushReplacement)
  └─ 點擊註冊 → [註冊頁面] (push)

[註冊頁面]
  ├─ 註冊成功 → [驗證頁面] (pushReplacement,傳遞 email)
  └─ 返回 → [登入頁面] (pop)

[驗證頁面]
  ├─ 驗證成功 → [記帳主頁] (pushNamedAndRemoveUntil,清除所有歷史)
  └─ 返回 → [註冊頁面] (pop)

[記帳主頁]
  └─ 登出 → [登入頁面] (pushReplacement)
```

---

## 狀態轉換規則

### 認證狀態流程

```
[Initial]
  ↓ (checkSession)
  ├─ Session Valid → [Authenticated]
  └─ No Session → [Unauthenticated]

[Unauthenticated]
  ↓ (register)
  └─ [Pending Verification]
      ↓ (verifyEmail)
      └─ [Authenticated]

[Unauthenticated]
  ↓ (signIn)
  └─ [Authenticated]

[Authenticated]
  ↓ (signOut)
  └─ [Unauthenticated]
```

### 交易狀態流程

```
[Empty]
  ↓ (loadTransactions)
  └─ [Loaded]
      ↓ (addTransaction)
      └─ [Loaded] (更新列表)
      ↓ (deleteTransaction)
      └─ [Loaded] (移除項目)
```

---

## 錯誤處理流程

### API 錯誤對應

```dart
// lib/utils/error_handler.dart

class ErrorHandler {
  static String getErrorMessage(dynamic error) {
    if (error is DioException) {
      switch (error.response?.statusCode) {
        case 400:
          return _parseValidationError(error.response?.data);
        case 401:
          return 'Email 或密碼錯誤';
        case 403:
          return '請先完成 Email 驗證';
        case 404:
          return '請求的資源不存在';
        case 409:
          return '此 Email 已被註冊';
        case 429:
          return '操作過於頻繁,請稍後再試';
        case 500:
          return '伺服器錯誤,請稍後再試';
        default:
          return '網路連線失敗,請檢查您的網路';
      }
    }
    return error.toString();
  }

  static String _parseValidationError(dynamic data) {
    if (data is Map && data['error'] is Map) {
      return data['error']['message'] ?? '輸入格式不正確';
    }
    return '輸入格式不正確';
  }
}
```

### 錯誤顯示策略

```dart
// 使用 SnackBar 顯示錯誤
void showError(BuildContext context, String message) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Text(message),
      backgroundColor: AppColors.error,
      duration: Duration(seconds: 3),
      action: SnackBarAction(
        label: '關閉',
        textColor: Colors.white,
        onPressed: () {
          ScaffoldMessenger.of(context).hideCurrentSnackBar();
        },
      ),
    ),
  );
}

// 使用 Dialog 顯示重要錯誤
void showErrorDialog(BuildContext context, String title, String message) {
  showDialog(
    context: context,
    builder: (context) => AlertDialog(
      title: Text(title),
      content: Text(message),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: Text('確定'),
        ),
      ],
    ),
  );
}
```

---

## 本地儲存策略

### flutter_secure_storage 使用

```dart
// lib/services/storage_service.dart

import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class StorageService {
  static const _storage = FlutterSecureStorage();

  // 儲存 Token
  static Future<void> saveToken(String token) async {
    await _storage.write(key: 'auth_token', value: token);
  }

  // 讀取 Token
  static Future<String?> getToken() async {
    return await _storage.read(key: 'auth_token');
  }

  // 刪除 Token
  static Future<void> deleteToken() async {
    await _storage.delete(key: 'auth_token');
  }

  // 儲存使用者資訊
  static Future<void> saveUser(User user) async {
    await _storage.write(key: 'user_id', value: user.id);
    await _storage.write(key: 'user_name', value: user.name);
    await _storage.write(key: 'user_email', value: user.email);
  }

  // 讀取使用者資訊
  static Future<User?> getUser() async {
    final id = await _storage.read(key: 'user_id');
    final name = await _storage.read(key: 'user_name');
    final email = await _storage.read(key: 'user_email');

    if (id == null || email == null) return null;

    return User(
      id: id,
      name: name ?? '',
      email: email,
      isVerified: true,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );
  }

  // 清除所有資料
  static Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}
```

### 離線資料暫存

```dart
// lib/services/offline_queue_service.dart

import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class OfflineQueueService {
  static const String _queueKey = 'offline_queue';

  // 新增待同步交易
  static Future<void> enqueue(Transaction transaction) async {
    final prefs = await SharedPreferences.getInstance();
    final queue = await getQueue();
    queue.add(transaction);

    final jsonList = queue.map((t) => t.toJson()).toList();
    await prefs.setString(_queueKey, jsonEncode(jsonList));
  }

  // 取得待同步交易列表
  static Future<List<Transaction>> getQueue() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonString = prefs.getString(_queueKey);

    if (jsonString == null) return [];

    final jsonList = jsonDecode(jsonString) as List;
    return jsonList.map((json) => Transaction.fromJson(json)).toList();
  }

  // 移除已同步交易
  static Future<void> remove(String transactionId) async {
    final prefs = await SharedPreferences.getInstance();
    final queue = await getQueue();
    queue.removeWhere((t) => t.id == transactionId);

    final jsonList = queue.map((t) => t.toJson()).toList();
    await prefs.setString(_queueKey, jsonEncode(jsonList));
  }

  // 清空佇列
  static Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_queueKey);
  }
}
```

---

## 總結

本文件定義了完整的 Flutter 前端 UI 流程,包括:

- ✅ **Riverpod 狀態管理**: 認證狀態和交易狀態管理
- ✅ **完整畫面流程**: 6 個主要畫面的實作邏輯
- ✅ **導航邏輯**: 頁面間的導航規則和路由定義
- ✅ **狀態轉換**: 認證和交易狀態的轉換流程
- ✅ **錯誤處理**: 統一的錯誤處理和顯示策略
- ✅ **本地儲存**: Token 和離線資料的儲存策略

所有設計符合 Constitution 要求和 1-Flutter 前端設計規格書.md 的規範。
