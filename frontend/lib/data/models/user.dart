class User {
  final String id;
  final String email;
  final String name;
  final bool isVerified;
  final DateTime createdAt;

  User({
    required this.id,
    required this.email,
    required this.name,
    required this.isVerified,
    required this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String,
      email: json['email'] as String,
      name: json['name'] as String,
      isVerified: json['isVerified'] as bool? ?? json['is_verified'] as bool? ?? true,
      createdAt: DateTime.parse(json['createdAt'] as String? ?? json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'isVerified': isVerified,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}

class AuthResponse {
  final bool success;
  final String message;
  final AuthData? data;

  AuthResponse({
    required this.success,
    required this.message,
    this.data,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      success: json['success'] as bool,
      message: json['message'] as String,
      data: json['data'] != null ? AuthData.fromJson(json['data'] as Map<String, dynamic>) : null,
    );
  }
}

class AuthData {
  final String? userId;
  final String? email;
  final String? name;
  final String? token;
  final String? refreshToken;
  final int? expiresAt;

  AuthData({
    this.userId,
    this.email,
    this.name,
    this.token,
    this.refreshToken,
    this.expiresAt,
  });

  factory AuthData.fromJson(Map<String, dynamic> json) {
    return AuthData(
      userId: json['userId'] as String?,
      email: json['email'] as String?,
      name: json['name'] as String?,
      token: json['token'] as String?,
      refreshToken: json['refreshToken'] as String?,
      expiresAt: json['expiresAt'] as int?,
    );
  }
}
