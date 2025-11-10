/**
 * 共用驗證工具
 * 
 * 提供 Email、密碼等常用欄位的驗證功能
 */

/**
 * Email 格式驗證
 * 
 * @param email - 待驗證的 Email
 * @returns 是否為有效的 Email 格式
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 密碼規則驗證
 * 
 * 規則: 8-20 碼,必須包含大寫英文、小寫英文、數字
 * 
 * @param password - 待驗證的密碼
 * @returns 是否符合密碼規則
 */
export function isValidPassword(password: string): boolean {
  if (password.length < 8 || password.length > 20) {
    return false;
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return hasUpperCase && hasLowerCase && hasNumber;
}

/**
 * 驗證碼格式驗證
 * 
 * @param code - 待驗證的驗證碼
 * @returns 是否為有效的 6 位數驗證碼
 */
export function isValidVerificationCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}

/**
 * 金額驗證
 * 
 * @param amount - 待驗證的金額
 * @param max - 最大金額限制(預設 1,000,000)
 * @returns 是否為有效的金額
 */
export function isValidAmount(amount: number, max = 1000000): boolean {
  return amount > 0 && amount <= max && Number.isFinite(amount);
}

/**
 * 驗證必要欄位
 * 
 * @param data - 待驗證的資料物件
 * @param requiredFields - 必要欄位名稱陣列
 * @returns 缺少的欄位名稱陣列(空陣列表示全部欄位存在)
 */
export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): string[] {
  return requiredFields.filter(field => {
    const value = data[field];
    return value === undefined || value === null || value === '';
  });
}
