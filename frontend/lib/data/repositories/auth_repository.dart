import 'package:dio/dio.dart';
import '../../services/api_service.dart';
import '../../services/storage_service.dart';
import '../../core/constants/api_constants.dart';
import '../models/user.dart';

class AuthRepository {
  final _api = ApiService();
  final _storage = StorageService();

  Future<AuthResponse> register({
    required String name,
    required String email,
    required String password,
    required String confirmPassword,
  }) async {
    try {
      final response = await _api.post(
        ApiConstants.register,
        data: {
          'name': name,
          'email': email,
          'password': password,
          'confirmPassword': confirmPassword,
        },
      );
      return AuthResponse.fromJson(response.data);
    } on DioException catch (e) {
      throw Exception(e.error ?? '註冊失敗');
    }
  }

  Future<AuthResponse> verifyEmail({
    required String email,
    required String code,
    required String name,
    required String password,
  }) async {
    try {
      final response = await _api.post(
        ApiConstants.verifyEmail,
        data: {
          'email': email,
          'code': code,
          'name': name,
          'password': password,
        },
      );
      
      final authResponse = AuthResponse.fromJson(response.data);
      
      if (authResponse.success && authResponse.data != null) {
        final data = authResponse.data!;
        if (data.token != null) {
          await _storage.saveToken(data.token!);
        }
        if (data.refreshToken != null) {
          await _storage.saveRefreshToken(data.refreshToken!);
        }
        if (data.userId != null && data.email != null && data.name != null) {
          await _storage.saveUser({
            'id': data.userId,
            'email': data.email,
            'name': data.name,
            'isVerified': true,
          });
        }
      }
      
      return authResponse;
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Email 驗證失敗');
    }
  }

  Future<AuthResponse> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _api.post(
        ApiConstants.login,
        data: {
          'email': email,
          'password': password,
        },
      );
      
      final authResponse = AuthResponse.fromJson(response.data);
      
      if (authResponse.success && authResponse.data != null) {
        final data = authResponse.data!;
        if (data.token != null) {
          await _storage.saveToken(data.token!);
        }
        if (data.refreshToken != null) {
          await _storage.saveRefreshToken(data.refreshToken!);
        }
        if (data.userId != null && data.email != null && data.name != null) {
          await _storage.saveUser({
            'id': data.userId,
            'email': data.email,
            'name': data.name,
            'isVerified': true,
          });
        }
      }
      
      return authResponse;
    } on DioException catch (e) {
      throw Exception(e.error ?? '登入失敗');
    }
  }

  Future<void> logout() async {
    try {
      await _api.post(ApiConstants.logout);
    } catch (e) {
      // Continue with local logout even if API call fails
    } finally {
      await _storage.clearAuth();
    }
  }

  Future<User?> getCurrentUser() async {
    final userData = await _storage.getUser();
    if (userData == null) return null;
    return User.fromJson(userData);
  }

  Future<bool> isLoggedIn() async {
    final token = await _storage.getToken();
    return token != null && token.isNotEmpty;
  }
}
