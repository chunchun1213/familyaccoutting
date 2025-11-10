import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/constants/app_constants.dart';
import '../../core/constants/error_messages.dart';
import '../../data/providers/auth_provider.dart';
import '../common/widgets/loading_indicator.dart';
import '../accounting/home_screen.dart';

class VerifyEmailScreen extends ConsumerStatefulWidget {
  final String email;
  final String name;
  final String password;

  const VerifyEmailScreen({
    super.key,
    required this.email,
    required this.name,
    required this.password,
  });

  @override
  ConsumerState<VerifyEmailScreen> createState() => _VerifyEmailScreenState();
}

class _VerifyEmailScreenState extends ConsumerState<VerifyEmailScreen> {
  final _formKey = GlobalKey<FormState>();
  final _codeController = TextEditingController();
  bool _isLoading = false;
  int _resendCooldown = 0;
  Timer? _timer;

  @override
  void dispose() {
    _codeController.dispose();
    _timer?.cancel();
    super.dispose();
  }

  void _startCooldown() {
    setState(() => _resendCooldown = 60);
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        if (_resendCooldown > 0) {
          _resendCooldown--;
        } else {
          timer.cancel();
        }
      });
    });
  }

  Future<void> _handleVerify() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final response = await ref.read(authStateProvider.notifier).verifyEmail(
            email: widget.email,
            code: _codeController.text.trim(),
            name: widget.name,
            password: widget.password,
          );

      if (!mounted) return;

      if (response.success) {
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (_) => const HomeScreen()),
          (route) => false,
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(response.message), backgroundColor: Colors.red),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString()), backgroundColor: Colors.red),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _handleResend() async {
    if (_resendCooldown > 0) return;

    setState(() => _isLoading = true);

    try {
      final response = await ref.read(authStateProvider.notifier).register(
            name: widget.name,
            email: widget.email,
            password: widget.password,
            confirmPassword: widget.password,
          );

      if (!mounted) return;

      if (response.success) {
        _startCooldown();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('驗證碼已重新發送'),
            backgroundColor: Colors.green,
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(response.message), backgroundColor: Colors.red),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString()), backgroundColor: Colors.red),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('驗證 Email'),
      ),
      body: SafeArea(
        child: LoadingOverlay(
          isLoading: _isLoading,
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(AppConstants.defaultPadding),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const SizedBox(height: 24),
                  const Icon(
                    Icons.email_outlined,
                    size: 64,
                    color: Colors.blue,
                  ),
                  const SizedBox(height: 24),
                  Text(
                    '驗證碼已發送',
                    style: Theme.of(context).textTheme.headlineSmall,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '我們已經發送 6 位數驗證碼到\n${widget.email}',
                    style: Theme.of(context).textTheme.bodyMedium,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 32),
                  TextFormField(
                    controller: _codeController,
                    decoration: const InputDecoration(
                      labelText: '驗證碼',
                      prefixIcon: Icon(Icons.pin_outlined),
                      hintText: '請輸入 6 位數驗證碼',
                    ),
                    keyboardType: TextInputType.number,
                    maxLength: AppConstants.verificationCodeLength,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return ErrorMessages.requiredField;
                      }
                      if (value.length != AppConstants.verificationCodeLength) {
                        return '請輸入 ${AppConstants.verificationCodeLength} 位數驗證碼';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: _isLoading ? null : _handleVerify,
                    child: const Text('驗證'),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text('沒有收到驗證碼?'),
                      TextButton(
                        onPressed: _resendCooldown > 0 || _isLoading ? null : _handleResend,
                        child: Text(
                          _resendCooldown > 0 ? '重新發送 ($_resendCooldown秒)' : '重新發送',
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    '提示: 請檢查垃圾郵件資料夾,或前往 http://127.0.0.1:54324 查看測試郵件',
                    style: Theme.of(context).textTheme.bodySmall,
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
