/**
 * Email 發送服務
 * 
 * 整合 Resend API 發送各類通知 Email
 */

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';
const RESEND_API_URL = 'https://api.resend.com/emails';
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'noreply@familyaccounting.com';
const APP_NAME = '家庭記帳 APP';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * 發送 Email
 * 
 * @param options - Email 選項(收件者、主旨、HTML 內容)
 * @returns 是否發送成功
 */
async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // 開發環境:使用 console 輸出模擬發送
    if (!RESEND_API_KEY || RESEND_API_KEY === 'test_key') {
      console.log('[Email] 開發模式 - 模擬發送 Email:');
      console.log(`收件者: ${options.to}`);
      console.log(`主旨: ${options.subject}`);
      console.log(`內容: ${options.html}`);
      return true;
    }

    // 正式環境:使用 Resend API
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    });

    if (!response.ok) {
      console.error('[Email] 發送失敗:', await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Email] 發送錯誤:', error);
    return false;
  }
}

/**
 * 發送驗證碼 Email
 * 
 * @param email - 收件者 Email
 * @param code - 6 位數驗證碼
 * @param name - 使用者姓名
 * @returns 是否發送成功
 */
export async function sendVerificationCode(
  email: string,
  code: string,
  name: string
): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .code { font-size: 32px; font-weight: bold; color: #4CAF50; text-align: center; padding: 20px; letter-spacing: 8px; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${APP_NAME}</h1>
    </div>
    <div class="content">
      <p>親愛的 ${name},</p>
      <p>感謝您註冊${APP_NAME}!您的驗證碼是:</p>
      <div class="code">${code}</div>
      <p>此驗證碼將在 <strong>5 分鐘</strong>後過期,請盡快完成驗證。</p>
      <p>如果您沒有註冊此帳號,請忽略此 Email。</p>
    </div>
    <div class="footer">
      <p>此郵件為系統自動發送,請勿直接回覆。</p>
      <p>&copy; 2025 ${APP_NAME}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  return await sendEmail({
    to: email,
    subject: `${APP_NAME} - Email 驗證碼`,
    html,
  });
}

/**
 * 產生 6 位數驗證碼
 * 
 * @returns 6 位數驗證碼字串
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
