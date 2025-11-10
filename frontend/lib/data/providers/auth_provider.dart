import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/user.dart';
import '../repositories/auth_repository.dart';

part 'auth_provider.g.dart';

@riverpod
AuthRepository authRepository(Ref ref) {
  return AuthRepository();
}

@riverpod
class AuthState extends _$AuthState {
  @override
  Future<User?> build() async {
    try {
      final repository = ref.read(authRepositoryProvider);
      return await repository.getCurrentUser();
    } catch (e) {
      return null;
    }
  }

  Future<AuthResponse> register({
    required String name,
    required String email,
    required String password,
    required String confirmPassword,
  }) async {
    final repository = ref.read(authRepositoryProvider);
    return await repository.register(
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    );
  }

  Future<AuthResponse> verifyEmail({
    required String email,
    required String code,
    required String name,
    required String password,
  }) async {
    final repository = ref.read(authRepositoryProvider);
    final response = await repository.verifyEmail(
      email: email,
      code: code,
      name: name,
      password: password,
    );
    
    if (response.success) {
      final user = await repository.getCurrentUser();
      state = AsyncData(user);
    }
    
    return response;
  }

  Future<AuthResponse> login({
    required String email,
    required String password,
  }) async {
    final repository = ref.read(authRepositoryProvider);
    final response = await repository.login(
      email: email,
      password: password,
    );
    
    if (response.success) {
      final user = await repository.getCurrentUser();
      state = AsyncData(user);
    }
    
    return response;
  }

  Future<void> logout() async {
    final repository = ref.read(authRepositoryProvider);
    await repository.logout();
    state = const AsyncData(null);
  }

  Future<void> checkAuthStatus() async {
    final repository = ref.read(authRepositoryProvider);
    final isLoggedIn = await repository.isLoggedIn();
    if (isLoggedIn) {
      final user = await repository.getCurrentUser();
      state = AsyncData(user);
    } else {
      state = const AsyncData(null);
    }
  }
}
