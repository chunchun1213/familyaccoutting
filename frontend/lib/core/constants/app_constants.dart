class AppConstants {
  static const String appName = '家庭記帳';
  
  // Storage keys
  static const String tokenKey = 'auth_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String userKey = 'user_data';
  
  // Validation
  static const int minPasswordLength = 8;
  static const int maxPasswordLength = 20;
  static const int verificationCodeLength = 6;
  
  // UI
  static const double defaultPadding = 16.0;
  static const double defaultBorderRadius = 12.0;
}
