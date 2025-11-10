class ErrorMessages {
  // Network errors
  static const String networkError = '網路連線失敗,請檢查您的網路設定';
  static const String timeoutError = '請求逾時,請稍後再試';
  static const String serverError = '伺服器錯誤,請稍後再試';
  
  // Auth errors
  static const String invalidEmail = '請輸入有效的 Email 地址';
  static const String invalidPassword = '密碼必須為 8-20 碼,包含大小寫英文字母和數字';
  static const String passwordMismatch = '兩次輸入的密碼不一致';
  static const String emailAlreadyExists = '此 Email 已被註冊';
  static const String invalidCredentials = 'Email 或密碼錯誤';
  static const String accountNotVerified = '帳號尚未驗證,請檢查您的 Email';
  
  // Verification errors
  static const String invalidVerificationCode = '驗證碼錯誤';
  static const String expiredVerificationCode = '驗證碼已過期,請重新發送';
  static const String tooManyAttempts = '驗證碼錯誤次數過多,請稍後再試';
  
  // Transaction errors
  static const String invalidAmount = '請輸入有效的金額';
  static const String amountTooLarge = '金額超過上限 (¥1,000,000)';
  static const String invalidCategory = '請選擇交易類別';
  
  // General errors
  static const String unknownError = '發生未知錯誤,請稍後再試';
  static const String requiredField = '此欄位為必填';
}
