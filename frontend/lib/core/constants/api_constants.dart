class ApiConstants {
  static const String baseUrl = 'http://127.0.0.1:54321/functions/v1';
  
  // Auth endpoints
  static const String register = '/auth/register';
  static const String verifyEmail = '/auth/verify-email';
  static const String login = '/auth/login';
  static const String logout = '/auth/logout';
  
  // Accounting endpoints
  static const String transactions = '/accounting/transactions';
  static const String summary = '/accounting/summary';
  
  // Timeouts
  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);
}
