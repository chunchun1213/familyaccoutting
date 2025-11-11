# 家庭記帳 APP - Flutter 前端設計規格書 v1.0

> **專案名稱**: 家庭記帳 APP  
> **設計版本**: 1.0.0  
> **最後更新**: 2025-11-11  
> **目標平台**: Flutter (iOS & Android)  
> **Flutter 版本**: 3.0+

---

## 目錄

1. [設計系統](#1-設計系統)
2. [畫面流程圖](#2-畫面流程圖)
3. [頁面規格](#3-頁面規格)
4. [組件規格](#4-組件規格)
5. [互動規範](#5-互動規範)
6. [響應式設計](#6-響應式設計)
7. [動畫效果](#7-動畫效果)
8. [圖標使用](#8-圖標使用)
9. [測試檢查清單](#9-測試檢查清單)

---

## 1. 設計系統

### 1.1 色彩系統

#### 主題色彩定義

```dart
// lib/constants/colors.dart

import 'package:flutter/material.dart';

class AppColors {
  // 主題色
  static const Color primaryLight = Color(0xFF86EFCC);
  static const Color primaryMid = Color(0xFF5FE3B8);
  static const Color primaryDark = Color(0xFF70E3BC);
  static const Color primaryDeeper = Color(0xFF4AD6A8);

  // 背景色
  static const Color backgroundWhite = Color(0xFFFFFFFF);
  static const Color backgroundGray = Color(0xFFF9FAFB);
  static const Color inputBackground = Color(0xFFF3F3F5);

  // 文字色
  static const Color textPrimary = Color(0xFF1F2937);
  static const Color textSecondary = Color(0xFF4B5563);
  static const Color textTertiary = Color(0xFF6B7280);
  static const Color textLight = Color(0xFF9CA3AF);
  static const Color textDisabled = Color(0xFFD1D5DB);

  // 功能色
  static const Color success = Color(0xFF16A34A); // 收入
  static const Color successLight = Color(0xFFDCFCE7);
  static const Color error = Color(0xFFDC2626); // 支出
  static const Color errorLight = Color(0xFFFEE2E2);
  static const Color errorBorder = Color(0xFFFECACA);
  static const Color warning = Color(0xFFF59E0B);
  static const Color info = Color(0xFF3B82F6);

  // 邊框色
  static const Color borderDefault = Color(0xFFE5E7EB);
  static const Color borderFocus = Color(0xFF5FE3B8);

  // 透明度顏色
  static Color primaryLight20 = const Color(0xFF86EFCC).withOpacity(0.2);
  static Color primaryLight10 = const Color(0xFF86EFCC).withOpacity(0.1);
  static Color black50 = Colors.black.withOpacity(0.5);
  static Color white20 = Colors.white.withOpacity(0.2);
}
```

#### 漸層定義

```dart
// lib/constants/gradients.dart

import 'package:flutter/material.dart';
import 'colors.dart';

class AppGradients {
  // Header 背景漸層
  static const LinearGradient headerGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      AppColors.primaryLight,
      AppColors.primaryMid,
    ],
  );

  // 按鈕漸��
  static const LinearGradient buttonGradient = LinearGradient(
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
    colors: [
      AppColors.primaryLight,
      AppColors.primaryMid,
    ],
  );

  // 按鈕 Hover 漸層
  static const LinearGradient buttonHoverGradient = LinearGradient(
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
    colors: [
      AppColors.primaryDark,
      AppColors.primaryDeeper,
    ],
  );

  // 底部漸層遮罩
  static const LinearGradient bottomMaskGradient = LinearGradient(
    begin: Alignment.bottomCenter,
    end: Alignment.topCenter,
    colors: [
      AppColors.backgroundGray,
      AppColors.backgroundGray,
      Colors.transparent,
    ],
    stops: [0.0, 0.5, 1.0],
  );
}
```

### 1.2 文字樣式系統

```dart
// lib/constants/text_styles.dart

import 'package:flutter/material.dart';
import 'colors.dart';

class AppTextStyles {
  // 字體家族
  static const String fontFamily = 'System'; // 使用系統預設字體

  // 標題樣式
  static const TextStyle h1 = TextStyle(
    fontSize: 30.0, // 3xl
    fontWeight: FontWeight.w500,
    height: 1.5,
    color: AppColors.textPrimary,
  );

  static const TextStyle h2 = TextStyle(
    fontSize: 24.0, // 2xl
    fontWeight: FontWeight.w500,
    height: 1.5,
    color: AppColors.textPrimary,
  );

  static const TextStyle h3 = TextStyle(
    fontSize: 20.0, // xl
    fontWeight: FontWeight.w500,
    height: 1.5,
    color: AppColors.textPrimary,
  );

  static const TextStyle h4 = TextStyle(
    fontSize: 18.0, // lg
    fontWeight: FontWeight.w500,
    height: 1.5,
    color: AppColors.textPrimary,
  );

  // 正文樣式
  static const TextStyle body = TextStyle(
    fontSize: 16.0, // base
    fontWeight: FontWeight.w400,
    height: 1.5,
    color: AppColors.textPrimary,
  );

  static const TextStyle bodyMedium = TextStyle(
    fontSize: 16.0,
    fontWeight: FontWeight.w500,
    height: 1.5,
    color: AppColors.textPrimary,
  );

  static const TextStyle caption = TextStyle(
    fontSize: 14.0, // sm
    fontWeight: FontWeight.w400,
    height: 1.5,
    color: AppColors.textSecondary,
  );

  // 特殊樣式
  static const TextStyle amount = TextStyle(
    fontSize: 40.0, // 4xl
    fontWeight: FontWeight.w500,
    height: 1.5,
  );

  static const TextStyle amountMedium = TextStyle(
    fontSize: 20.0, // xl
    fontWeight: FontWeight.w500,
    height: 1.5,
  );

  static const TextStyle verificationCode = TextStyle(
    fontSize: 30.0, // 3xl
    fontWeight: FontWeight.w400,
    letterSpacing: 16.0, // 0.5em
    height: 1.5,
  );

  static const TextStyle buttonText = TextStyle(
    fontSize: 16.0,
    fontWeight: FontWeight.w500,
    height: 1.5,
    color: AppColors.textPrimary,
  );
}
```

### 1.3 間距系統

```dart
// lib/constants/spacing.dart

class AppSpacing {
  // 基礎間距
  static const double xs = 4.0;    // px-1
  static const double sm = 8.0;    // px-2
  static const double md = 12.0;   // px-3
  static const double lg = 16.0;   // px-4
  static const double xl = 20.0;   // px-5
  static const double xxl = 24.0;  // px-6
  static const double xxxl = 32.0; // px-8

  // 特殊間距
  static const double spacing12 = 12.0;
  static const double spacing16 = 16.0;
  static const double spacing20 = 20.0;
  static const double spacing24 = 24.0;
  static const double spacing32 = 32.0;
  static const double spacing48 = 48.0;
  static const double spacing64 = 64.0;
  static const double spacing80 = 80.0;
  static const double spacing96 = 96.0;
  static const double spacing128 = 128.0;

  // EdgeInsets 預設值
  static const EdgeInsets paddingAll4 = EdgeInsets.all(4.0);
  static const EdgeInsets paddingAll8 = EdgeInsets.all(8.0);
  static const EdgeInsets paddingAll16 = EdgeInsets.all(16.0);
  static const EdgeInsets paddingAll24 = EdgeInsets.all(24.0);

  static const EdgeInsets paddingH24 = EdgeInsets.symmetric(horizontal: 24.0);
  static const EdgeInsets paddingV8 = EdgeInsets.symmetric(vertical: 8.0);
  static const EdgeInsets paddingV16 = EdgeInsets.symmetric(vertical: 16.0);

  // 頁面內距
  static const EdgeInsets pagePadding = EdgeInsets.symmetric(horizontal: 24.0);

  // 表單間距
  static const double formSpacing = 20.0; // space-y-5
  static const double formSpacingSmall = 16.0; // space-y-4
}
```

### 1.4 圓角系統

```dart
// lib/constants/border_radius.dart

import 'package:flutter/material.dart';

class AppBorderRadius {
  // 基礎圓角
  static const double xs = 8.0;
  static const double sm = 12.0;
  static const double md = 16.0;  // rounded-2xl
  static const double lg = 24.0;  // rounded-3xl
  static const double xl = 48.0;

  // BorderRadius 預設值
  static const BorderRadius radiusSm = BorderRadius.all(Radius.circular(8.0));
  static const BorderRadius radiusMd = BorderRadius.all(Radius.circular(16.0));
  static const BorderRadius radiusLg = BorderRadius.all(Radius.circular(24.0));
  static const BorderRadius radiusCircular = BorderRadius.all(Radius.circular(9999.0));

  // 頂部圓角（表單容器）
  static const BorderRadius radiusTopLg = BorderRadius.only(
    topLeft: Radius.circular(24.0),
    topRight: Radius.circular(24.0),
  );
}
```

### 1.5 陰影系統

```dart
// lib/constants/shadows.dart

import 'package:flutter/material.dart';
import 'colors.dart';

class AppShadows {
  // 小陰影 - 交易卡片
  static final List<BoxShadow> shadowSm = [
    BoxShadow(
      color: Colors.black.withOpacity(0.05),
      blurRadius: 2.0,
      offset: const Offset(0, 1),
    ),
  ];

  // 中陰影 - 普通卡片
  static final List<BoxShadow> shadowMd = [
    BoxShadow(
      color: Colors.black.withOpacity(0.1),
      blurRadius: 4.0,
      offset: const Offset(0, 2),
    ),
  ];

  // 大陰影 - 主要按鈕、Logo
  static final List<BoxShadow> shadowLg = [
    BoxShadow(
      color: Colors.black.withOpacity(0.1),
      blurRadius: 10.0,
      offset: const Offset(0, 4),
    ),
  ];

  // 超大陰影 - 餘額卡片
  static final List<BoxShadow> shadowXl = [
    BoxShadow(
      color: Colors.black.withOpacity(0.1),
      blurRadius: 20.0,
      offset: const Offset(0, 10),
    ),
  ];

  // 主題色陰影 - 主要按鈕
  static final List<BoxShadow> shadowPrimary = [
    BoxShadow(
      color: AppColors.primaryLight.withOpacity(0.3),
      blurRadius: 10.0,
      offset: const Offset(0, 4),
    ),
  ];
}
```

### 1.6 尺寸規範

```dart
// lib/constants/sizes.dart

class AppSizes {
  // 按鈕高度
  static const double buttonHeight = 56.0; // h-14
  static const double buttonHeightMedium = 48.0; // h-12

  // 輸入框高度
  static const double inputHeight = 56.0; // h-14
  static const double inputHeightLarge = 64.0; // h-16 驗證碼

  // 圖標尺寸
  static const double iconXl = 48.0; // h-12 w-12
  static const double iconLg = 32.0; // h-8 w-8
  static const double iconMd = 20.0; // h-5 w-5
  static const double iconSm = 16.0; // h-4 w-4

  // 圖標容器內距
  static const double iconPaddingSm = 8.0;
  static const double iconPaddingMd = 16.0;

  // 最大寬度（桌面端）
  static const double maxWidthMd = 448.0; // max-w-md
}
```

---

## 2. 畫面流程圖

### 2.1 完整流程圖

```
[啟動畫面 - SplashScreen]
    |
    v
[檢查會話]
    |
    ├─ 有會話 ────> [記帳主頁 - ExpenseTrackerPage]
    |                    |
    |                    v
    |              [登出] -> [登入頁面 - SignInPage]
    |
    └─ 無會話 ────> [登入頁面 - SignInPage]
                         |
                         ├─ [登入按鈕] ──> [驗證成功] -> [記帳主頁]
                         |                      |
                         |                      └─ [需要驗證] -> [驗證頁面]
                         |
                         └─ [註冊新帳號] ──> [註冊頁面 - SignUpPage]
                                                   |
                                                   v
                                             [驗證頁面 - VerificationPage]
                                                   |
                                                   ├─ [驗證成功] -> [自動登入] -> [記帳主頁]
                                                   |
                                                   ├─ [重新發送] -> [新驗證碼]
                                                   |
                                                   └─ [返回] -> [註冊頁面]
```

### 2.2 頁面路由

```dart
// lib/routes/app_routes.dart

class AppRoutes {
  static const String splash = '/';
  static const String signIn = '/signin';
  static const String signUp = '/signup';
  static const String verification = '/verification';
  static const String home = '/home';
}
```

---

## 3. 頁面規格

### 3.1 啟動/載入頁面 (SplashScreen)

#### Widget 結構

```dart
Scaffold(
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
)
```

#### 規格說明

- 全屏垂直居中
- 背景使用主題漸層
- 載入指示器顏色：`AppColors.textPrimary`
- 載入指示器寬度：3.0

---

### 3.2 登入頁面 (SignInPage)

#### Widget 結構

```dart
Scaffold(
  body: SafeArea(
    child: SingleChildScrollView(
      child: Column(
        children: [
          // Header 區域
          _buildHeader(),
          // 表單容器
          _buildFormContainer(),
        ],
      ),
    ),
  ),
)
```

#### Header 區域 (\_buildHeader)

```dart
Container(
  width: double.infinity,
  decoration: BoxDecoration(
    gradient: AppGradients.headerGradient,
  ),
  padding: EdgeInsets.only(
    top: 64.0,  // pt-16
    bottom: 128.0, // pb-32
    left: 24.0,  // px-6
    right: 24.0,
  ),
  child: Column(
    children: [
      // Logo 圖標容器
      Container(
        padding: EdgeInsets.all(16.0), // p-4
        decoration: BoxDecoration(
          color: Colors.white,
          shape: BoxShape.circle,
          boxShadow: AppShadows.shadowLg,
        ),
        child: Icon(
          Icons.account_balance_wallet,
          size: 48.0, // h-12 w-12
          color: AppColors.primaryMid,
        ),
      ),
      SizedBox(height: 24.0), // mb-6

      // 主標題
      Text(
        '家庭記帳',
        style: AppTextStyles.h1.copyWith(color: AppColors.textPrimary),
        textAlign: TextAlign.center,
      ),
      SizedBox(height: 8.0), // mb-2

      // 副標題
      Text(
        '輕鬆管理您的每一筆收支',
        style: AppTextStyles.body.copyWith(color: AppColors.textSecondary),
        textAlign: TextAlign.center,
      ),
    ],
  ),
)
```

#### 表單容器 (\_buildFormContainer)

```dart
Transform.translate(
  offset: Offset(0, -80), // -mt-20
  child: Container(
    width: double.infinity,
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: AppBorderRadius.radiusTopLg,
    ),
    padding: EdgeInsets.fromLTRB(24.0, 32.0, 24.0, 24.0), // px-6 pt-8 pb-6
    child: Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // 錯誤提示（條件顯示）
          if (_errorMessage.isNotEmpty) _buildErrorAlert(),
          SizedBox(height: 20.0),

          // Email 輸入框
          _buildEmailInput(),
          SizedBox(height: 20.0),

          // 密碼輸入框
          _buildPasswordInput(),
          SizedBox(height: 32.0), // mt-8

          // 登入按鈕
          _buildSignInButton(),

          // 分隔線
          _buildDivider(),

          // 註冊按鈕
          _buildSignUpButton(),
        ],
      ),
    ),
  ),
)
```

#### 輸入框規格 - Email

```dart
Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [
    // 標籤
    Padding(
      padding: EdgeInsets.only(left: 4.0),
      child: Text(
        '電子郵件',
        style: AppTextStyles.caption.copyWith(
          color: AppColors.textSecondary,
        ),
      ),
    ),
    SizedBox(height: 8.0),

    // 輸入框
    Container(
      height: AppSizes.inputHeight,
      decoration: BoxDecoration(
        borderRadius: AppBorderRadius.radiusMd,
        border: Border.all(
          color: _emailFocused ? AppColors.borderFocus : AppColors.borderDefault,
          width: 1.0,
        ),
      ),
      child: Row(
        children: [
          // 左側圖標
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 16.0),
            child: Icon(
              Icons.mail_outline,
              size: AppSizes.iconMd,
              color: AppColors.textLight,
            ),
          ),
          // 輸入框
          Expanded(
            child: TextFormField(
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              decoration: InputDecoration(
                hintText: '請輸入您的Email',
                border: InputBorder.none,
                contentPadding: EdgeInsets.zero,
              ),
              style: AppTextStyles.body,
              onTap: () => setState(() => _emailFocused = true),
              onFieldSubmitted: (_) => setState(() => _emailFocused = false),
            ),
          ),
          SizedBox(width: 16.0),
        ],
      ),
    ),
  ],
)
```

#### 輸入框規格 - 密碼

```dart
// 結構同 Email，但使用以下差異：
// 圖標: Icons.lock_outline
// keyboardType: TextInputType.visiblePassword
// obscureText: true
// hintText: '請輸入您的密碼'
```

#### 主要按鈕 - 登入

```dart
Container(
  height: AppSizes.buttonHeight,
  decoration: BoxDecoration(
    gradient: _isPressed
        ? AppGradients.buttonHoverGradient
        : AppGradients.buttonGradient,
    borderRadius: AppBorderRadius.radiusMd,
    boxShadow: AppShadows.shadowPrimary,
  ),
  child: Material(
    color: Colors.transparent,
    child: InkWell(
      onTap: _loading ? null : _handleSignIn,
      onTapDown: (_) => setState(() => _isPressed = true),
      onTapUp: (_) => setState(() => _isPressed = false),
      onTapCancel: () => setState(() => _isPressed = false),
      borderRadius: AppBorderRadius.radiusMd,
      child: Center(
        child: _loading
            ? Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  SizedBox(
                    width: 20.0,
                    height: 20.0,
                    child: CircularProgressIndicator(
                      strokeWidth: 2.0,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        AppColors.textPrimary,
                      ),
                    ),
                  ),
                  SizedBox(width: 8.0),
                  Text('登入中...', style: AppTextStyles.buttonText),
                ],
              )
            : Text('登入', style: AppTextStyles.buttonText),
      ),
    ),
  ),
)
```

#### 分隔線

```dart
Padding(
  padding: EdgeInsets.symmetric(vertical: 16.0),
  child: Row(
    children: [
      Expanded(child: Divider(color: AppColors.borderDefault, height: 1)),
      Padding(
        padding: EdgeInsets.symmetric(horizontal: 16.0),
        child: Text(
          '或',
          style: AppTextStyles.caption.copyWith(color: AppColors.textLight),
        ),
      ),
      Expanded(child: Divider(color: AppColors.borderDefault, height: 1)),
    ],
  ),
)
```

#### 次要按鈕 - 註冊

```dart
Container(
  height: AppSizes.buttonHeight,
  decoration: BoxDecoration(
    border: Border.all(
      color: AppColors.primaryMid,
      width: 2.0,
    ),
    borderRadius: AppBorderRadius.radiusMd,
  ),
  child: Material(
    color: _isSecondaryPressed
        ? AppColors.primaryLight10
        : Colors.transparent,
    borderRadius: AppBorderRadius.radiusMd,
    child: InkWell(
      onTap: _loading ? null : _navigateToSignUp,
      onTapDown: (_) => setState(() => _isSecondaryPressed = true),
      onTapUp: (_) => setState(() => _isSecondaryPressed = false),
      onTapCancel: () => setState(() => _isSecondaryPressed = false),
      borderRadius: AppBorderRadius.radiusMd,
      child: Center(
        child: Text(
          '註冊新帳號',
          style: AppTextStyles.buttonText.copyWith(
            color: AppColors.primaryDeeper,
          ),
        ),
      ),
    ),
  ),
)
```

---

### 3.3 註冊頁面 (SignUpPage)

#### Widget 結構

```dart
Scaffold(
  body: SafeArea(
    child: SingleChildScrollView(
      child: Column(
        children: [
          _buildHeader(),
          _buildFormContainer(),
        ],
      ),
    ),
  ),
)
```

#### Header 區域

```dart
Container(
  width: double.infinity,
  decoration: BoxDecoration(
    gradient: AppGradients.headerGradient,
  ),
  padding: EdgeInsets.only(
    top: 48.0,  // pt-12
    bottom: 80.0, // pb-20
    left: 24.0,
    right: 24.0,
  ),
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      // 返回按鈕
      GestureDetector(
        onTap: () => Navigator.pop(context),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.arrow_back,
              size: AppSizes.iconMd,
              color: AppColors.textPrimary,
            ),
            SizedBox(width: 8.0),
            Text(
              '返回登入',
              style: AppTextStyles.body.copyWith(
                color: AppColors.textPrimary,
              ),
            ),
          ],
        ),
      ),
      SizedBox(height: 24.0), // mb-6

      // 主標題
      Text(
        '建立帳號',
        style: AppTextStyles.h1.copyWith(color: AppColors.textPrimary),
      ),
      SizedBox(height: 8.0),

      // 副標題
      Text(
        '開始您的記帳之旅',
        style: AppTextStyles.body.copyWith(color: AppColors.textSecondary),
      ),
    ],
  ),
)
```

#### 表單容器

```dart
Transform.translate(
  offset: Offset(0, -48), // -mt-12
  child: Container(
    width: double.infinity,
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: AppBorderRadius.radiusTopLg,
    ),
    padding: EdgeInsets.fromLTRB(24.0, 32.0, 24.0, 24.0),
    child: Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (_errorMessage.isNotEmpty) _buildErrorAlert(),
          SizedBox(height: 16.0),

          // 姓名輸入框（選填）
          _buildNameInput(),
          SizedBox(height: 16.0),

          // Email 輸入框
          _buildEmailInput(),
          SizedBox(height: 16.0),

          // 密碼輸入框
          _buildPasswordInput(),
          SizedBox(height: 16.0),

          // 確認密碼輸入框
          _buildConfirmPasswordInput(),
          SizedBox(height: 24.0),

          // 建立帳號按鈕
          _buildSignUpButton(),
        ],
      ),
    ),
  ),
)
```

#### 姓名輸入框

```dart
// 標籤文字: "姓名（選填）"
// 圖標: Icons.person_outline
// hintText: '請輸入您的姓名'
// required: false
// 其他規格同 Email 輸入框
```

#### 密碼輸入框（註冊專用）

```dart
// 標籤文字: "密碼 *"
// hintText: '8-20碼，含大小寫字母和數字'
// obscureText: true
// 其他規格同一般密碼輸入框
```

#### 確認密碼輸入框

```dart
// 標籤文字: "確認密碼 *"
// hintText: '請再次輸入密碼'
// obscureText: true
// validator: 檢查是否與密碼欄位一致
```

---

### 3.4 驗證頁面 (VerificationPage)

#### Widget 結構

```dart
Scaffold(
  body: SafeArea(
    child: SingleChildScrollView(
      child: Column(
        children: [
          _buildHeader(),
          _buildFormContainer(),
        ],
      ),
    ),
  ),
)
```

#### Header 區域

```dart
Container(
  width: double.infinity,
  decoration: BoxDecoration(
    gradient: AppGradients.headerGradient,
  ),
  padding: EdgeInsets.only(
    top: 48.0,
    bottom: 80.0,
    left: 24.0,
    right: 24.0,
  ),
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      // 返回按鈕（同註冊頁面）
      GestureDetector(
        onTap: () => Navigator.pop(context),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.arrow_back, size: 20, color: AppColors.textPrimary),
            SizedBox(width: 8.0),
            Text('返回', style: AppTextStyles.body),
          ],
        ),
      ),
      SizedBox(height: 24.0),

      Text('驗證電子郵件', style: AppTextStyles.h1),
      SizedBox(height: 8.0),
      Text('請查看您的收件箱', style: AppTextStyles.body.copyWith(
        color: AppColors.textSecondary,
      )),
    ],
  ),
)
```

#### 表單容器

```dart
Transform.translate(
  offset: Offset(0, -48),
  child: Container(
    width: double.infinity,
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: AppBorderRadius.radiusTopLg,
    ),
    padding: EdgeInsets.fromLTRB(24.0, 32.0, 24.0, 24.0),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        if (_errorMessage.isNotEmpty) _buildErrorAlert(),
        SizedBox(height: 24.0),

        // Email 資訊卡片
        _buildEmailInfoCard(),
        SizedBox(height: 24.0),

        // 驗證碼輸入框
        _buildCodeInput(),
        SizedBox(height: 12.0),

        // 計時器
        _buildTimer(),
        SizedBox(height: 24.0),

        // 確認驗證按鈕
        _buildVerifyButton(),
        SizedBox(height: 16.0),

        // 重新發送按鈕
        _buildResendButton(),
      ],
    ),
  ),
)
```

#### Email 資訊卡片

```dart
Container(
  padding: EdgeInsets.all(20.0), // p-5
  decoration: BoxDecoration(
    color: AppColors.primaryLight20,
    borderRadius: AppBorderRadius.radiusMd,
    border: Border.all(
      color: AppColors.primaryMid.withOpacity(0.3),
      width: 1.0,
    ),
  ),
  child: Row(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      // 圖標容器
      Container(
        padding: EdgeInsets.all(8.0),
        margin: EdgeInsets.only(top: 4.0),
        decoration: BoxDecoration(
          color: AppColors.primaryMid,
          shape: BoxShape.circle,
        ),
        child: Icon(
          Icons.mail_outline,
          size: AppSizes.iconMd,
          color: AppColors.textPrimary,
        ),
      ),
      SizedBox(width: 12.0),

      // 文字區域
      Expanded(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '驗證碼已發送至',
              style: AppTextStyles.caption.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
            SizedBox(height: 4.0),
            Text(
              widget.email,
              style: AppTextStyles.body.copyWith(
                color: AppColors.textPrimary,
              ),
            ),
          ],
        ),
      ),
    ],
  ),
)
```

#### 驗證碼輸入框

```dart
Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [
    Padding(
      padding: EdgeInsets.only(left: 4.0),
      child: Text(
        '請輸入6位數驗證碼',
        style: AppTextStyles.caption.copyWith(
          color: AppColors.textSecondary,
        ),
      ),
    ),
    SizedBox(height: 12.0),

    Container(
      height: AppSizes.inputHeightLarge, // 64px
      decoration: BoxDecoration(
        borderRadius: AppBorderRadius.radiusMd,
        border: Border.all(
          color: _codeFocused ? AppColors.borderFocus : AppColors.borderDefault,
          width: 1.0,
        ),
      ),
      child: Center(
        child: TextField(
          controller: _codeController,
          textAlign: TextAlign.center,
          keyboardType: TextInputType.number,
          maxLength: 6,
          style: AppTextStyles.verificationCode,
          decoration: InputDecoration(
            hintText: '000000',
            border: InputBorder.none,
            counterText: '', // 隱藏字數統計
            contentPadding: EdgeInsets.zero,
          ),
          inputFormatters: [
            FilteringTextInputFormatter.digitsOnly, // 只允許數字
          ],
        ),
      ),
    ),
  ],
)
```

#### 計時器顯示

```dart
Container(
  padding: EdgeInsets.symmetric(vertical: 8.0),
  child: Row(
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
      Icon(
        Icons.access_time,
        size: AppSizes.iconMd,
        color: _timeLeft > 0 ? AppColors.primaryDeeper : AppColors.error,
      ),
      SizedBox(width: 8.0),

      _timeLeft > 0
          ? RichText(
              text: TextSpan(
                style: AppTextStyles.body.copyWith(
                  color: AppColors.textSecondary,
                ),
                children: [
                  TextSpan(text: '驗證碼將在 '),
                  TextSpan(
                    text: _formatTime(_timeLeft),
                    style: TextStyle(color: AppColors.primaryDeeper),
                  ),
                  TextSpan(text: ' 後過期'),
                ],
              ),
            )
          : Text(
              '驗證碼已過期',
              style: AppTextStyles.body.copyWith(color: AppColors.error),
            ),
    ],
  ),
)

// 格式化時間函數
String _formatTime(int seconds) {
  int minutes = seconds ~/ 60;
  int secs = seconds % 60;
  return '$minutes:${secs.toString().padLeft(2, '0')}';
}
```

#### 重新發送按鈕

```dart
Container(
  height: AppSizes.buttonHeight,
  decoration: BoxDecoration(
    border: Border.all(
      color: AppColors.borderDefault,
      width: 2.0,
    ),
    borderRadius: AppBorderRadius.radiusMd,
  ),
  child: Material(
    color: _canResend && !_resending
        ? (_isResendPressed ? AppColors.backgroundGray : Colors.transparent)
        : Colors.transparent,
    borderRadius: AppBorderRadius.radiusMd,
    child: InkWell(
      onTap: (_canResend && !_loading && !_resending)
          ? _handleResend
          : null,
      onTapDown: (_) => setState(() => _isResendPressed = true),
      onTapUp: (_) => setState(() => _isResendPressed = false),
      onTapCancel: () => setState(() => _isResendPressed = false),
      borderRadius: AppBorderRadius.radiusMd,
      child: Center(
        child: _resending
            ? Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  SizedBox(
                    width: 16.0,
                    height: 16.0,
                    child: CircularProgressIndicator(strokeWidth: 2.0),
                  ),
                  SizedBox(width: 8.0),
                  Text('發送中...', style: AppTextStyles.buttonText.copyWith(
                    color: AppColors.textSecondary,
                  )),
                ],
              )
            : Text(
                '重新發送驗證碼',
                style: AppTextStyles.buttonText.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
      ),
    ),
  ),
)
```

---

### 3.5 記帳主頁 (ExpenseTrackerPage)

#### Widget 結構

```dart
Scaffold(
  body: SafeArea(
    child: Stack(
      children: [
        // 主內容區
        Column(
          children: [
            _buildHeader(),
            Expanded(
              child: Container(
                color: AppColors.backgroundGray,
                child: _buildTransactionList(),
              ),
            ),
          ],
        ),

        // 底部新增按鈕（固定）
        Positioned(
          left: 0,
          right: 0,
          bottom: 0,
          child: _buildAddButton(),
        ),
      ],
    ),
  ),
)
```

#### Header 區域

```dart
Container(
  decoration: BoxDecoration(
    gradient: AppGradients.headerGradient,
  ),
  padding: EdgeInsets.fromLTRB(24.0, 48.0, 24.0, 32.0),
  child: Column(
    children: [
      // 頂部橫條
      Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 用戶資訊
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '您好',
                style: AppTextStyles.caption.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
              SizedBox(height: 4.0),
              Text(
                widget.userName ?? widget.userEmail,
                style: AppTextStyles.h2.copyWith(
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),

          // 登出按鈕
          GestureDetector(
            onTap: _handleSignOut,
            child: Container(
              padding: EdgeInsets.all(8.0),
              decoration: BoxDecoration(
                color: AppColors.white20,
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.logout,
                size: AppSizes.iconMd,
                color: AppColors.textPrimary,
              ),
            ),
          ),
        ],
      ),
      SizedBox(height: 32.0), // mb-8

      // 餘額卡片
      _buildBalanceCard(),
    ],
  ),
)
```

#### 餘額卡片

```dart
Container(
  padding: EdgeInsets.all(24.0), // p-6
  decoration: BoxDecoration(
    color: Colors.white,
    borderRadius: AppBorderRadius.radiusLg,
    boxShadow: AppShadows.shadowXl,
  ),
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      // 標籤
      Text(
        '總餘額',
        style: AppTextStyles.caption.copyWith(
          color: AppColors.textTertiary,
        ),
      ),
      SizedBox(height: 8.0), // mb-2

      // 餘額顯示
      Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Text(
            '\$${_formatAmount(_balance)}',
            style: AppTextStyles.amount.copyWith(
              color: _balance >= 0
                  ? AppColors.primaryDeeper
                  : AppColors.error,
            ),
          ),
          Icon(
            Icons.account_balance_wallet_outlined,
            size: AppSizes.iconLg,
            color: AppColors.textDisabled,
          ),
        ],
      ),
      SizedBox(height: 16.0), // mb-4

      // 分隔線
      Divider(
        color: AppColors.borderDefault,
        height: 1,
      ),
      SizedBox(height: 16.0), // pt-4

      // 收支摘要
      Row(
        children: [
          // 收入欄
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(
                      Icons.trending_up,
                      size: AppSizes.iconSm,
                      color: AppColors.success,
                    ),
                    SizedBox(width: 8.0),
                    Text(
                      '收入',
                      style: AppTextStyles.caption.copyWith(
                        color: AppColors.success,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 4.0),
                Text(
                  '\$${_formatAmount(_totalIncome)}',
                  style: AppTextStyles.amountMedium.copyWith(
                    color: AppColors.success,
                  ),
                ),
              ],
            ),
          ),

          // 支出欄
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(
                      Icons.trending_down,
                      size: AppSizes.iconSm,
                      color: AppColors.error,
                    ),
                    SizedBox(width: 8.0),
                    Text(
                      '支出',
                      style: AppTextStyles.caption.copyWith(
                        color: AppColors.error,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 4.0),
                Text(
                  '\$${_formatAmount(_totalExpense)}',
                  style: AppTextStyles.amountMedium.copyWith(
                    color: AppColors.error,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    ],
  ),
)

// 金額格式化函數
String _formatAmount(double amount) {
  return amount.toStringAsFixed(0).replaceAllMapped(
    RegExp(r'(\d)(?=(\d{3})+(?!\d))'),
    (Match m) => '${m[1]},',
  );
}
```

#### 交易記錄列表

```dart
Container(
  padding: EdgeInsets.fromLTRB(24.0, 24.0, 24.0, 120.0), // 底部預留按鈕空間
  child: Column(
    children: [
      // 標題列
      Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            '交易記錄',
            style: AppTextStyles.h4.copyWith(color: AppColors.textPrimary),
          ),
          Text(
            '${_transactions.length} 筆',
            style: AppTextStyles.caption.copyWith(color: AppColors.textTertiary),
          ),
        ],
      ),
      SizedBox(height: 16.0), // mb-4

      // 列表內容
      _transactions.isEmpty
          ? _buildEmptyState()
          : _buildTransactionItems(),
    ],
  ),
)
```

#### 空狀態

```dart
Container(
  padding: EdgeInsets.symmetric(vertical: 64.0), // py-16
  child: Column(
    children: [
      Icon(
        Icons.account_balance_wallet_outlined,
        size: 64.0, // h-16 w-16
        color: AppColors.textDisabled,
      ),
      SizedBox(height: 16.0), // mb-4
      Text(
        '尚無交易記錄',
        style: AppTextStyles.body.copyWith(color: AppColors.textLight),
      ),
      SizedBox(height: 4.0),
      Text(
        '點擊下方按鈕開始記帳',
        style: AppTextStyles.caption.copyWith(color: AppColors.textLight),
      ),
    ],
  ),
)
```

#### 交易卡片

```dart
Container(
  margin: EdgeInsets.only(bottom: 12.0), // space-y-3
  padding: EdgeInsets.all(16.0), // p-4
  decoration: BoxDecoration(
    color: Colors.white,
    borderRadius: AppBorderRadius.radiusMd,
    border: Border.all(
      color: AppColors.borderDefault,
      width: 1.0,
    ),
    boxShadow: AppShadows.shadowSm,
  ),
  child: Column(
    children: [
      // 上半部
      Row(
        children: [
          // 圖標容器
          Container(
            padding: EdgeInsets.all(8.0), // p-2
            decoration: BoxDecoration(
              color: transaction.type == 'income'
                  ? AppColors.successLight
                  : AppColors.errorLight,
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.attach_money,
              size: AppSizes.iconSm,
              color: transaction.type == 'income'
                  ? AppColors.success
                  : AppColors.error,
            ),
          ),
          SizedBox(width: 12.0), // gap-3

          // 文字區
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  transaction.category,
                  style: AppTextStyles.body.copyWith(
                    color: AppColors.textPrimary,
                  ),
                ),
                if (transaction.description.isNotEmpty)
                  Padding(
                    padding: EdgeInsets.only(top: 2.0),
                    child: Text(
                      transaction.description,
                      style: AppTextStyles.caption.copyWith(
                        color: AppColors.textTertiary,
                      ),
                    ),
                  ),
              ],
            ),
          ),

          // 刪除按鈕
          GestureDetector(
            onTap: () => _handleDelete(transaction.id),
            child: Padding(
              padding: EdgeInsets.all(4.0),
              child: Icon(
                Icons.delete_outline,
                size: AppSizes.iconMd,
                color: AppColors.textLight,
              ),
            ),
          ),
        ],
      ),
      SizedBox(height: 8.0), // mb-2

      // 下半部
      Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            _formatDate(transaction.date),
            style: AppTextStyles.caption.copyWith(
              color: AppColors.textLight,
            ),
          ),
          Text(
            '${transaction.type == "income" ? "+" : "-"}\$${_formatAmount(transaction.amount)}',
            style: AppTextStyles.amountMedium.copyWith(
              color: transaction.type == 'income'
                  ? AppColors.success
                  : AppColors.error,
            ),
          ),
        ],
      ),
    ],
  ),
)

// 日期格式化函數
String _formatDate(DateTime date) {
  return '${date.year}/${date.month.toString().padLeft(2, '0')}/${date.day.toString().padLeft(2, '0')}';
}
```

#### 底部新增按鈕

```dart
Container(
  padding: EdgeInsets.all(24.0), // p-6
  decoration: BoxDecoration(
    gradient: AppGradients.bottomMaskGradient,
  ),
  child: Container(
    height: AppSizes.buttonHeight,
    decoration: BoxDecoration(
      gradient: AppGradients.buttonGradient,
      borderRadius: AppBorderRadius.radiusMd,
      boxShadow: AppShadows.shadowPrimary,
    ),
    child: Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: _showAddTransactionModal,
        borderRadius: AppBorderRadius.radiusMd,
        child: Center(
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.add,
                size: AppSizes.iconMd,
                color: AppColors.textPrimary,
              ),
              SizedBox(width: 8.0),
              Text(
                '新增交易記錄',
                style: AppTextStyles.buttonText,
              ),
            ],
          ),
        ),
      ),
    ),
  ),
)
```

#### 新增交易彈窗 (BottomSheet)

```dart
void _showAddTransactionModal() {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (context) => Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppBorderRadius.radiusTopLg,
      ),
      padding: EdgeInsets.fromLTRB(
        24.0,
        24.0,
        24.0,
        MediaQuery.of(context).viewInsets.bottom + 24.0, // 鍵盤自適應
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // 標題列
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '新增交易',
                style: AppTextStyles.h3.copyWith(color: AppColors.textPrimary),
              ),
              GestureDetector(
                onTap: () => Navigator.pop(context),
                child: Icon(
                  Icons.close,
                  size: 24.0,
                  color: AppColors.textLight,
                ),
              ),
            ],
          ),
          SizedBox(height: 24.0), // mb-6

          // 表單內容
          _buildModalForm(),
        ],
      ),
    ),
  );
}
```

#### 彈窗表單內容

```dart
Column(
  crossAxisAlignment: CrossAxisAlignment.stretch,
  children: [
    // 類型切換按鈕
    Row(
      children: [
        Expanded(
          child: _buildTypeButton('支出', 'expense'),
        ),
        SizedBox(width: 12.0), // gap-3
        Expanded(
          child: _buildTypeButton('收入', 'income'),
        ),
      ],
    ),
    SizedBox(height: 16.0),

    // 金額輸入
    _buildAmountInput(),
    SizedBox(height: 16.0),

    // 分類選擇
    _buildCategoryDropdown(),
    SizedBox(height: 16.0),

    // 備註輸入
    _buildDescriptionInput(),
    SizedBox(height: 24.0),

    // 確認按鈕
    _buildConfirmButton(),
  ],
)
```

#### 類型切換按鈕

```dart
Container(
  height: AppSizes.buttonHeightMedium, // 48px
  decoration: BoxDecoration(
    color: _selectedType == type
        ? (type == 'expense' ? AppColors.error : AppColors.success)
        : AppColors.backgroundGray,
    borderRadius: BorderRadius.circular(12.0), // rounded-xl
  ),
  child: Material(
    color: Colors.transparent,
    child: InkWell(
      onTap: () => setState(() {
        _selectedType = type;
        _selectedCategory = null; // 切換類型時重置分類
      }),
      borderRadius: BorderRadius.circular(12.0),
      child: Center(
        child: Text(
          label,
          style: AppTextStyles.buttonText.copyWith(
            color: _selectedType == type
                ? Colors.white
                : AppColors.textTertiary,
          ),
        ),
      ),
    ),
  ),
)
```

#### 分類下拉選單

```dart
Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [
    Padding(
      padding: EdgeInsets.only(left: 4.0),
      child: Text(
        '分類',
        style: AppTextStyles.caption.copyWith(
          color: AppColors.textSecondary,
        ),
      ),
    ),
    SizedBox(height: 8.0),

    Container(
      height: AppSizes.inputHeight,
      padding: EdgeInsets.symmetric(horizontal: 16.0),
      decoration: BoxDecoration(
        borderRadius: AppBorderRadius.radiusMd,
        border: Border.all(
          color: AppColors.borderDefault,
          width: 1.0,
        ),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: _selectedCategory,
          hint: Text(
            '請選擇分類',
            style: AppTextStyles.body.copyWith(color: AppColors.textLight),
          ),
          isExpanded: true,
          icon: Icon(Icons.keyboard_arrow_down, color: AppColors.textLight),
          style: AppTextStyles.body,
          items: (_selectedType == 'income'
              ? ['薪資', '獎金', '投資', '副業', '其他']
              : ['餐飲', '交通', '購物', '娛樂', '醫療', '教育', '住宅', '其他']
          ).map((String category) {
            return DropdownMenuItem<String>(
              value: category,
              child: Text(category),
            );
          }).toList(),
          onChanged: (String? newValue) {
            setState(() {
              _selectedCategory = newValue;
            });
          },
        ),
      ),
    ),
  ],
)
```

---

## 4. 組件規格

### 4.1 錯誤提示組件

```dart
// lib/widgets/error_alert.dart

Container(
  padding: EdgeInsets.all(16.0), // p-4
  decoration: BoxDecoration(
    color: AppColors.errorLight,
    borderRadius: AppBorderRadius.radiusSm,
    border: Border.all(
      color: AppColors.errorBorder,
      width: 1.0,
    ),
  ),
  child: Row(
    children: [
      Icon(
        Icons.error_outline,
        size: AppSizes.iconMd,
        color: AppColors.error,
      ),
      SizedBox(width: 12.0),
      Expanded(
        child: Text(
          errorMessage,
          style: AppTextStyles.body.copyWith(
            color: AppColors.error,
          ),
        ),
      ),
    ],
  ),
)
```

### 4.2 載入按鈕組件

```dart
// lib/widgets/loading_button.dart

class LoadingButton extends StatefulWidget {
  final String text;
  final String loadingText;
  final VoidCallback onPressed;
  final bool isLoading;
  final bool isPrimary;

  const LoadingButton({
    required this.text,
    required this.loadingText,
    required this.onPressed,
    required this.isLoading,
    this.isPrimary = true,
  });

  @override
  _LoadingButtonState createState() => _LoadingButtonState();
}

class _LoadingButtonState extends State<LoadingButton> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: AppSizes.buttonHeight,
      decoration: widget.isPrimary
          ? BoxDecoration(
              gradient: _isPressed
                  ? AppGradients.buttonHoverGradient
                  : AppGradients.buttonGradient,
              borderRadius: AppBorderRadius.radiusMd,
              boxShadow: AppShadows.shadowPrimary,
            )
          : BoxDecoration(
              border: Border.all(
                color: widget.isPrimary
                    ? AppColors.primaryMid
                    : AppColors.borderDefault,
                width: 2.0,
              ),
              color: _isPressed
                  ? (widget.isPrimary
                      ? AppColors.primaryLight10
                      : AppColors.backgroundGray)
                  : Colors.transparent,
              borderRadius: AppBorderRadius.radiusMd,
            ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: widget.isLoading ? null : widget.onPressed,
          onTapDown: (_) => setState(() => _isPressed = true),
          onTapUp: (_) => setState(() => _isPressed = false),
          onTapCancel: () => setState(() => _isPressed = false),
          borderRadius: AppBorderRadius.radiusMd,
          child: Center(
            child: widget.isLoading
                ? Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      SizedBox(
                        width: 20.0,
                        height: 20.0,
                        child: CircularProgressIndicator(
                          strokeWidth: 2.0,
                          valueColor: AlwaysStoppedAnimation<Color>(
                            widget.isPrimary
                                ? AppColors.textPrimary
                                : AppColors.textSecondary,
                          ),
                        ),
                      ),
                      SizedBox(width: 8.0),
                      Text(
                        widget.loadingText,
                        style: AppTextStyles.buttonText.copyWith(
                          color: widget.isPrimary
                              ? AppColors.textPrimary
                              : AppColors.textSecondary,
                        ),
                      ),
                    ],
                  )
                : Text(
                    widget.text,
                    style: AppTextStyles.buttonText.copyWith(
                      color: widget.isPrimary
                          ? AppColors.textPrimary
                          : AppColors.primaryDeeper,
                    ),
                  ),
          ),
        ),
      ),
    );
  }
}
```

### 4.3 輸入框組件

```dart
// lib/widgets/custom_text_field.dart

class CustomTextField extends StatefulWidget {
  final String label;
  final String hintText;
  final IconData icon;
  final TextEditingController controller;
  final TextInputType keyboardType;
  final bool obscureText;
  final bool required;
  final String? Function(String?)? validator;

  const CustomTextField({
    required this.label,
    required this.hintText,
    required this.icon,
    required this.controller,
    this.keyboardType = TextInputType.text,
    this.obscureText = false,
    this.required = false,
    this.validator,
  });

  @override
  _CustomTextFieldState createState() => _CustomTextFieldState();
}

class _CustomTextFieldState extends State<CustomTextField> {
  bool _isFocused = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.only(left: 4.0),
          child: Text(
            widget.label,
            style: AppTextStyles.caption.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
        ),
        SizedBox(height: 8.0),

        Container(
          height: AppSizes.inputHeight,
          decoration: BoxDecoration(
            borderRadius: AppBorderRadius.radiusMd,
            border: Border.all(
              color: _isFocused
                  ? AppColors.borderFocus
                  : AppColors.borderDefault,
              width: 1.0,
            ),
          ),
          child: Row(
            children: [
              Padding(
                padding: EdgeInsets.symmetric(horizontal: 16.0),
                child: Icon(
                  widget.icon,
                  size: AppSizes.iconMd,
                  color: AppColors.textLight,
                ),
              ),
              Expanded(
                child: TextFormField(
                  controller: widget.controller,
                  keyboardType: widget.keyboardType,
                  obscureText: widget.obscureText,
                  decoration: InputDecoration(
                    hintText: widget.hintText,
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.zero,
                  ),
                  style: AppTextStyles.body,
                  validator: widget.validator,
                  onTap: () => setState(() => _isFocused = true),
                  onFieldSubmitted: (_) => setState(() => _isFocused = false),
                ),
              ),
              SizedBox(width: 16.0),
            ],
          ),
        ),
      ],
    );
  }
}
```

---

## 5. 互動規範

### 5.1 表單驗證

#### 即時驗證規則

```dart
// Email 驗證
String? validateEmail(String? value) {
  if (value == null || value.isEmpty) {
    return '請填寫Email';
  }

  final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
  if (!emailRegex.hasMatch(value)) {
    return 'Email格式不正確';
  }

  return null;
}

// 密碼驗證（註冊）
String? validatePassword(String? value) {
  if (value == null || value.isEmpty) {
    return '請填寫密碼';
  }

  if (value.length < 8 || value.length > 20) {
    return '密碼必須為8到20碼';
  }

  final hasUpperCase = RegExp(r'[A-Z]').hasMatch(value);
  final hasLowerCase = RegExp(r'[a-z]').hasMatch(value);
  final hasNumber = RegExp(r'[0-9]').hasMatch(value);

  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return '密碼必須包含英文大小寫與數字';
  }

  return null;
}

// 確認密碼驗證
String? validateConfirmPassword(String? value, String password) {
  if (value == null || value.isEmpty) {
    return '請再次輸入密碼';
  }

  if (value != password) {
    return '兩次輸入的密碼不一致';
  }

  return null;
}

// 驗證碼驗證
String? validateCode(String? value) {
  if (value == null || value.isEmpty) {
    return '請輸入驗證碼';
  }

  if (value.length != 6) {
    return '請輸入6位數驗證碼';
  }

  return null;
}
```

#### 錯誤訊息文案

```dart
// lib/constants/error_messages.dart

class ErrorMessages {
  // 登入
  static const String signInEmptyFields = '請填寫所有欄位';
  static const String signInInvalidCredentials = 'Email或密碼錯誤';
  static const String signInNeedsVerification = '請先完成Email驗證';
  static const String signInNetworkError = '無法連接到伺服器，請檢查網路連接或稍後再試';

  // 註冊
  static const String signUpEmptyFields = '請填寫所有必填欄位';
  static const String signUpPasswordMismatch = '兩次輸入的密碼不一致';
  static const String signUpPasswordLength = '密碼必須為8到20碼';
  static const String signUpPasswordComplexity = '密碼必須包含英文大小寫與數字';
  static const String signUpEmailExists = '此Email已被註冊，請直接登入或使用其他Email';
  static const String signUpNetworkError = '無法連接到伺服器，請檢查網路連接或稍後再試';

  // 驗證
  static const String verificationInvalidCode = '請輸入6位數驗證碼';
  static const String verificationCodeExpired = '驗證碼已過期';
  static const String verificationCodeWrong = '驗證碼錯誤';
  static const String verificationError = '驗證過程發生錯誤，請稍後再試';
  static const String verificationResendError = '重新發送過程發生錯誤';

  // 記帳
  static const String transactionEmptyFields = '請填寫金額和分類';
  static const String transactionDeleteConfirm = '確定要刪除這筆記錄嗎？';
}
```

### 5.2 按鈕互動狀態

#### 狀態定義

```dart
enum ButtonState {
  normal,    // 正常狀態
  pressed,   // 按下狀態
  loading,   // 載入狀態
  disabled,  // 禁用狀態
}
```

#### 視覺反饋

```
Normal State:
- 顯示正常顏色
- 可點擊
- 無特殊效果

Pressed State (onTapDown):
- 主要按鈕：顯示 hover 漸層
- 次要按鈕：背景變為 primaryLight10 或 backgroundGray
- 過渡時間：立即

Released State (onTapUp/onTapCancel):
- 恢復到 Normal State
- 過渡時間：立即

Loading State:
- 顯示 CircularProgressIndicator
- 文字變更為 "[動作]中..."
- 禁用點擊
- 透明度不變

Disabled State:
- onTap 設為 null
- 視覺上與 Normal 相同（Flutter 原生行為）
```

### 5.3 輸入框焦點

```dart
// 焦點狀態管理
bool _isFocused = false;

// 邊框顏色
border: Border.all(
  color: _isFocused
      ? AppColors.borderFocus
      : AppColors.borderDefault,
  width: 1.0,
),

// 焦點事件
onTap: () => setState(() => _isFocused = true),
onFieldSubmitted: (_) => setState(() => _isFocused = false),
```

### 5.4 頁面導航

```dart
// 前往頁面（無動畫）
Navigator.pushNamed(context, AppRoutes.signUp);

// 替換頁面
Navigator.pushReplacementNamed(context, AppRoutes.home);

// 返回上一頁
Navigator.pop(context);

// 清除所有頁面並導航
Navigator.pushNamedAndRemoveUntil(
  context,
  AppRoutes.home,
  (route) => false,
);
```

### 5.5 彈窗互動

#### 顯示 BottomSheet

```dart
showModalBottomSheet(
  context: context,
  isScrollControlled: true, // 允許自定義高度
  backgroundColor: Colors.transparent, // 透明背景以顯示圓角
  builder: (context) => Container(...),
);
```

#### 顯示確認對話框

```dart
Future<bool> showDeleteConfirmDialog(BuildContext context) async {
  return await showDialog<bool>(
    context: context,
    builder: (context) => AlertDialog(
      title: Text('確認刪除'),
      content: Text(ErrorMessages.transactionDeleteConfirm),
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
  ) ?? false;
}
```

---

## 6. 響應式設計

### 6.1 斷點定義

```dart
// lib/constants/breakpoints.dart

class Breakpoints {
  static const double mobile = 768.0;
  static const double tablet = 1024.0;
  static const double desktop = 1440.0;
}

// 使用 MediaQuery 判斷
bool isMobile(BuildContext context) {
  return MediaQuery.of(context).size.width < Breakpoints.mobile;
}

bool isTablet(BuildContext context) {
  return MediaQuery.of(context).size.width >= Breakpoints.mobile &&
         MediaQuery.of(context).size.width < Breakpoints.tablet;
}

bool isDesktop(BuildContext context) {
  return MediaQuery.of(context).size.width >= Breakpoints.tablet;
}
```

### 6.2 自適應佈局

```dart
// 桌面端最大寬度限制
Widget _buildResponsiveContainer(Widget child) {
  return LayoutBuilder(
    builder: (context, constraints) {
      if (constraints.maxWidth > AppSizes.maxWidthMd) {
        return Center(
          child: Container(
            width: AppSizes.maxWidthMd,
            child: child,
          ),
        );
      }
      return child;
    },
  );
}
```

### 6.3 鍵盤自適應

```dart
// BottomSheet 自動調整內距以適應鍵盤
padding: EdgeInsets.fromLTRB(
  24.0,
  24.0,
  24.0,
  MediaQuery.of(context).viewInsets.bottom + 24.0,
),

// 可滾動頁面
SingleChildScrollView(
  child: Column(...),
)
```

### 6.4 SafeArea 使用

```dart
// 所有頁面都應包裹在 SafeArea 中
Scaffold(
  body: SafeArea(
    child: ...,
  ),
)
```

---

## 7. 動畫效果

### 7.1 載入動畫

```dart
// CircularProgressIndicator
CircularProgressIndicator(
  strokeWidth: 2.0,
  valueColor: AlwaysStoppedAnimation<Color>(AppColors.textPrimary),
)

// 使用場景：
// - 頁面初始載入
// - 按鈕載入狀態
```

### 7.2 按鈕按壓效果

```dart
// 使用 InkWell 提供原生 Material 波紋效果
InkWell(
  onTap: () {},
  onTapDown: (_) => setState(() => _isPressed = true),
  onTapUp: (_) => setState(() => _isPressed = false),
  onTapCancel: () => setState(() => _isPressed = false),
  borderRadius: AppBorderRadius.radiusMd,
  child: ...,
)
```

### 7.3 BottomSheet 滑入動畫

```dart
// showModalBottomSheet 自帶滑入動畫
// 從底部滑入，持續時間約 300ms
showModalBottomSheet(
  context: context,
  isScrollControlled: true,
  backgroundColor: Colors.transparent,
  builder: (context) => ...,
);
```

### 7.4 頁面切換

```dart
// 無動畫頁面切換
Navigator.pushNamed(context, routeName);

// 如需自定義動畫
Navigator.push(
  context,
  PageRouteBuilder(
    pageBuilder: (context, animation, secondaryAnimation) => NextPage(),
    transitionDuration: Duration.zero, // 無動畫
  ),
);
```

---

## 8. 圖標使用

### 8.1 Material Icons

```dart
// Flutter 內建 Material Icons
// 無需額外安裝

import 'package:flutter/material.dart';

// 使用範例
Icon(Icons.account_balance_wallet, size: 48.0, color: AppColors.primaryMid)
```

### 8.2 圖標清單

```dart
// 認證流程
Icons.account_balance_wallet      // 錢包（Logo）
Icons.mail_outline                // 郵件（Email 輸入框、驗證資訊）
Icons.lock_outline                // 鎖（密碼輸入框）
Icons.person_outline              // 用戶（姓名輸入框）
Icons.arrow_back                  // 左箭頭（返回按鈕）
Icons.access_time                 // 時鐘（倒計時）

// 記帳功能
Icons.logout                      // 登出
Icons.account_balance_wallet_outlined  // 錢包（餘額、空狀態）
Icons.trending_up                 // 向上趨勢（收入）
Icons.trending_down               // 向下趨勢（支出）
Icons.add                         // 加號（新增按鈕）
Icons.close                       // 關閉（彈窗關閉）
Icons.attach_money                // 美元符號（交易圖標）
Icons.delete_outline              // 垃圾桶（刪除）
Icons.keyboard_arrow_down         // 下拉箭頭（下拉選單）
Icons.error_outline               // 錯誤圖標（錯誤提示）
```

---

## 9. 測試檢查清單

### 9.1 功能測試

```
□ 註冊流程
  □ 密碼驗證（長度、複雜度）
  □ 確認密碼驗證
  □ Email 格式驗證
  □ 成功後導航到驗證頁面

□ 驗證流程
  □ 驗證碼輸入（只能輸入數字）
  □ 倒計時功能
  □ 重新發送功能
  □ 驗證成功後自動登入

□ 登入流程
  □ Email 和密碼驗證
  □ 記住登入狀態
  □ 未驗證提示

□ 記帳功能
  □ 新增收入/支出
  □ 刪除交易記錄
  □ 餘額計算正確
  □ 登出功能
```

### 9.2 UI 測試

```
□ 所有按鈕可點擊
□ 所有輸入框可輸入
□ 錯誤訊息正確顯示
□ 載入狀態正確顯示
□ BottomSheet 正確開關
□ 顏色符合設計規範
□ 間距符合設計規範
□ 圓角符合設計規範
□ 字體大小正確
```

### 9.3 設備測試

```
□ Android
  □ Android 10+
  □ 各種螢幕尺寸
  □ 不同 DPI

□ iOS
  □ iOS 13+
  □ iPhone SE
  □ iPhone 14 Pro Max
  □ iPad
```

### 9.4 互動測試

```
□ 按鈕按壓效果
□ 輸入框焦點效果
□ 表單提交
□ 頁面導航
□ BottomSheet 動畫
□ 載入動畫
□ 鍵盤彈出時佈局調整
```

---

## 附錄 A: 完整色彩參考（Dart 格式）

```dart
class AppColors {
  // 主題色
  static const Color primaryLight = Color(0xFF86EFCC);
  static const Color primaryMid = Color(0xFF5FE3B8);
  static const Color primaryDark = Color(0xFF70E3BC);
  static const Color primaryDeeper = Color(0xFF4AD6A8);

  // 背景色
  static const Color backgroundWhite = Color(0xFFFFFFFF);
  static const Color backgroundGray = Color(0xFFF9FAFB);
  static const Color inputBackground = Color(0xFFF3F3F5);

  // 文字色
  static const Color textPrimary = Color(0xFF1F2937);
  static const Color textSecondary = Color(0xFF4B5563);
  static const Color textTertiary = Color(0xFF6B7280);
  static const Color textLight = Color(0xFF9CA3AF);
  static const Color textDisabled = Color(0xFFD1D5DB);

  // 功能色
  static const Color success = Color(0xFF16A34A);
  static const Color successLight = Color(0xFFDCFCE7);
  static const Color error = Color(0xFFDC2626);
  static const Color errorLight = Color(0xFFFEE2E2);
  static const Color errorBorder = Color(0xFFFECACA);

  // 邊框色
  static const Color borderDefault = Color(0xFFE5E7EB);
  static const Color borderFocus = Color(0xFF5FE3B8);

  // 透明度顏色
  static Color primaryLight20 = const Color(0xFF86EFCC).withOpacity(0.2);
  static Color primaryLight10 = const Color(0xFF86EFCC).withOpacity(0.1);
  static Color black50 = Colors.black.withOpacity(0.5);
  static Color white20 = Colors.white.withOpacity(0.2);
}
```

---

## 附錄 B: 快速參考表

| 元素         | 高度 | 圓角 | 字號 | Dart 常數                   |
| ------------ | ---- | ---- | ---- | --------------------------- |
| 主要按鈕     | 56px | 16px | 16px | AppSizes.buttonHeight       |
| 次要按鈕     | 56px | 16px | 16px | AppSizes.buttonHeight       |
| 標準輸入框   | 56px | 16px | 16px | AppSizes.inputHeight        |
| 驗證碼輸入框 | 64px | 16px | 30px | AppSizes.inputHeightLarge   |
| 類型切換按鈕 | 48px | 12px | 16px | AppSizes.buttonHeightMedium |
| 餘額卡片     | auto | 24px | -    | AppBorderRadius.radiusLg    |
| 交易卡片     | auto | 16px | -    | AppBorderRadius.radiusMd    |

---

**文件結束**

此規格書完整適配 Flutter 開發，包含所有必要的程式碼範例和設計細節。工程師可依此文件進行像素級還原。
