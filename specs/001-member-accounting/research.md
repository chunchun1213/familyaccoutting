# 研究文件:會員註冊與登入系統以及記帳主頁功能

**日期**: 2025-11-05  
**階段**: Phase 0 - 技術研究與決策

## 研究目標

本文件記錄所有技術選型決策、架構模式研究和最佳實踐探索,以解決實作過程中的未知項目和技術不確定性。

## 技術選型決策

### 1. 前端框架:Flutter

**決策**: 採用 Flutter 3.16+ 作為跨平台前端框架

**理由**:
- 單一程式碼庫同時支援 iOS 和 Android,開發效率高
- Material 3 提供符合現代設計趨勢的 UI 元件庫
- 熱重載(Hot Reload)加速開發迭代
- 強型別 Dart 語言提供更好的程式碼品質和維護性
- 成熟的生態系統(flutter_riverpod, dio, flutter_secure_storage 等套件)
- 優秀的效能表現(原生編譯,60fps 流暢動畫)

**考慮的替代方案**:
- React Native: 生態系統更大但效能稍遜,橋接開銷較高
- Native(Swift/Kotlin): 效能最佳但需維護兩套程式碼庫,成本過高
- Ionic/Cordova: 基於 WebView,效能和使用者體驗不佳

**風險與緩解**:
- 風險:Flutter 3.16+ 相對較新,可能有未知 bug
- 緩解:使用穩定版本,參考官方文件和社群最佳實踐

### 2. 狀態管理:Riverpod

**決策**: 採用 flutter_riverpod 2.4.0+ 作為狀態管理方案

**理由**:
- 編譯期安全,Provider 無需 context 依賴
- 優秀的測試支援,狀態可完全隔離測試
- 自動處理狀態生命週期,防止記憶體洩漏
- 支援非同步狀態(FutureProvider, StreamProvider)
- 內建快取和重複請求消除
- 與 Flutter hooks 整合良好

**考慮的替代方案**:
- Provider: Riverpod 的前身,但需要 BuildContext,測試較困難
- Bloc: 更重量級,樣板程式碼較多,學習曲線陡峭
- GetX: 過於魔術化,不夠顯式,維護性問題

**最佳實踐**:
- 使用 StateNotifierProvider 處理複雜狀態邏輯
- 使用 FutureProvider 處理一次性非同步操作
- 使用 StreamProvider 處理即時資料流(如交易列表更新)
- 將 Provider 定義在獨立檔案中,避免循環依賴

### 3. 後端服務:Supabase

**決策**: 採用 Supabase 作為 Backend-as-a-Service 平台

**理由**:
- Supabase Auth 提供完整的認證解決方案(JWT, session 管理)
- PostgreSQL 提供強大的關聯式資料庫功能和 ACID 保證
- Edge Functions(Deno runtime)支援自訂業務邏輯
- Row Level Security (RLS)提供細緻的資料存取控制
- 即時訂閱(Realtime)支援多裝置資料同步
- 內建 API 自動生成(PostgREST),減少樣板程式碼
- 免費額度足夠 MVP 階段使用

**考慮的替代方案**:
- Firebase: 生態系統成熟但 NoSQL 不適合財務資料,查詢能力受限
- AWS Amplify: 功能強大但學習曲線陡峭,配置複雜
- 自建後端(Node.js/Express): 完全客製化但開發成本高,需處理基礎設施

**Supabase 核心功能使用**:
- **Supabase Auth**: 處理使用者註冊、登入、session 管理
- **PostgreSQL**: 儲存使用者、交易、驗證碼資料
- **Edge Functions**: 實作自訂業務邏輯(驗證碼驗證、Email 發送)
- **KV Store**: 快取驗證碼和 session 資料,提升效能

### 4. API 框架:Hono

**決策**: 在 Supabase Edge Functions 中使用 Hono 作為 HTTP 框架

**理由**:
- 輕量級,專為 Edge Runtime 優化
- Express-like 語法,學習曲線平緩
- 內建中介軟體系統(CORS, JWT 驗證, 請求驗證)
- TypeScript 優先,型別安全
- 效能優異,適合無伺服器環境
- 支援多種執行環境(Deno, Cloudflare Workers, Node.js)

**考慮的替代方案**:
- Oak(Deno): 較重量級,功能過多對 Edge Functions 來說不必要
- 直接使用 Deno.serve: 缺乏路由和中介軟體抽象,樣板程式碼多

**Hono 路由設計模式**:
```typescript
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'

const app = new Hono()

app.use('/api/*', cors())
app.use('/api/auth/*', jwt({ secret: Deno.env.get('JWT_SECRET')! }))

app.post('/api/register', registerHandler)
app.post('/api/verify-email', verifyEmailHandler)
app.post('/api/login', loginHandler)
```

### 5. Email 服務:Resend

**決策**: 採用 Resend Email API 發送驗證碼郵件

**理由**:
- 現代化 API 設計,開發者友善
- 優秀的送達率和速度(< 30 秒送達)
- 簡潔的 SDK,易於整合
- 合理的定價(每月 3000 封免費額度)
- 內建郵件範本系統
- 詳細的郵件追蹤和分析

**考慮的替代方案**:
- SendGrid: 功能完整但 API 複雜,設定繁瑣
- AWS SES: 價格便宜但需處理 AWS 基礎設施,初始設定複雜
- SMTP(Gmail): 免費但送達率不穩定,有每日發送限制

**Resend 整合範例**:
```typescript
import { Resend } from 'resend'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

await resend.emails.send({
  from: 'noreply@familyaccounting.app',
  to: userEmail,
  subject: '驗證您的 Email',
  html: `您的驗證碼是: <strong>${code}</strong>`,
})
```

### 6. 本地儲存:flutter_secure_storage

**決策**: 採用 flutter_secure_storage 儲存敏感資料(Token, 暫存交易)

**理由**:
- 使用平台原生加密機制(iOS Keychain, Android KeyStore)
- 自動處理加密金鑰管理
- 簡潔的 API(get/write/delete)
- 支援跨平台
- 符合安全最佳實踐

**考慮的替代方案**:
- shared_preferences: 無加密,不適合敏感資料
- Hive: 需手動處理加密,複雜度較高
- sqflite: 過於重量級,對簡單鍵值儲存來說不必要

**使用場景**:
- 儲存 JWT Token(自動登入)
- 暫存網路中斷時的交易記錄
- 快取使用者基本資訊

### 7. HTTP 客戶端:Dio

**決策**: 採用 dio 5.4.0+ 作為 HTTP 客戶端

**理由**:
- 強大的攔截器(Interceptor)系統,易於實作認證、錯誤處理
- 內建請求取消和逾時處理
- 支援檔案上傳/下載進度追蹤
- 完整的錯誤處理機制
- 自動請求/回應轉換(JSON 序列化)
- 優秀的測試支援(MockAdapter)

**考慮的替代方案**:
- http(官方套件): 功能陽春,需手動處理許多細節
- Chopper: 過於重量級,產生程式碼較多

**Dio 設定最佳實踐**:
```dart
// TODO: 部署至正式環境時,將 baseUrl 更新為實際的 Supabase Project URL
// 本地開發: http://localhost:54321
// 正式部署: 從 Supabase Project Settings > API 取得
// 範例: https://abcdefghijk.supabase.co
final dio = Dio(BaseOptions(
  baseUrl: 'https://your-project.supabase.co',
  connectTimeout: Duration(seconds: 10),
  receiveTimeout: Duration(seconds: 10),
));

// 認證攔截器
dio.interceptors.add(InterceptorsWrapper(
  onRequest: (options, handler) async {
    final token = await storage.read(key: 'auth_token');
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  },
));

// 錯誤處理攔截器
dio.interceptors.add(InterceptorsWrapper(
  onError: (error, handler) {
    // 統一錯誤處理邏輯
    handler.next(error);
  },
));
```

## 架構模式研究

### 1. Clean Architecture 分層

**決策**: 採用 Clean Architecture 三層分離(Data, Domain, Presentation)

**理由**:
- 關注點分離,易於測試和維護
- 業務邏輯與 UI 和資料來源解耦
- 支援依賴反轉,Repository 模式提供抽象
- 便於未來替換資料來源或 UI 框架

**層級職責**:
- **Data Layer**: 處理資料存取(API, 本地儲存),實作 Repository
- **Domain Layer**: 定義實體(Models)和業務邏輯(Use Cases)
- **Presentation Layer**: UI 元件和狀態管理(Screens, Widgets, Providers)

**範例結構**:
```
lib/
├── data/
│   ├── models/          # 資料模型(JSON 序列化)
│   ├── repositories/    # Repository 實作
│   └── providers/       # Riverpod providers
├── domain/
│   └── entities/        # 業務實體
└── presentation/
    ├── screens/         # 頁面
    └── widgets/         # UI 元件
```

### 2. Repository 模式

**決策**: 使用 Repository 模式封裝資料存取邏輯

**理由**:
- 提供統一的資料存取介面
- 隱藏資料來源細節(API, 本地儲存, 快取)
- 支援離線優先策略(本地優先,同步到雲端)
- 易於 mock,測試友善

**範例實作**:
```dart
abstract class AuthRepository {
  Future<User> register(String name, String email, String password);
  Future<void> verifyEmail(String email, String code);
  Future<User> login(String email, String password);
  Future<void> logout();
}

class AuthRepositoryImpl implements AuthRepository {
  final ApiService apiService;
  final StorageService storageService;
  
  AuthRepositoryImpl(this.apiService, this.storageService);
  
  @override
  Future<User> login(String email, String password) async {
    final response = await apiService.post('/login', {
      'email': email,
      'password': password,
    });
    
    // 儲存 token 到本地
    await storageService.saveToken(response.data['token']);
    
    return User.fromJson(response.data['user']);
  }
}
```

### 3. 錯誤處理策略

**決策**: 採用統一的錯誤處理機制

**設計原則**:
- 所有 API 錯誤轉換為具體的領域錯誤類別
- 使用 Either<Failure, Success> 模式明確表達成功/失敗
- UI 層顯示使用者友善的繁體中文錯誤訊息
- 記錄詳細錯誤日誌供除錯使用

**錯誤類別**:
```dart
sealed class Failure {
  final String message;
  const Failure(this.message);
}

class NetworkFailure extends Failure {
  const NetworkFailure() : super('網路連線失敗,請檢查您的網路設定');
}

class AuthFailure extends Failure {
  const AuthFailure(String message) : super(message);
}

class ValidationFailure extends Failure {
  const ValidationFailure(String message) : super(message);
}
```

### 4. 表單驗證模式

**決策**: 使用 flutter_form_builder 搭配自訂驗證器

**理由**:
- 宣告式表單定義,程式碼清晰
- 內建常用驗證器(email, 必填, 長度)
- 支援即時驗證和提交驗證
- 易於客製化錯誤訊息(繁體中文)

**範例實作**:
```dart
FormBuilderTextField(
  name: 'email',
  decoration: InputDecoration(labelText: 'Email'),
  validator: FormBuilderValidators.compose([
    FormBuilderValidators.required(errorText: 'Email 為必填欄位'),
    FormBuilderValidators.email(errorText: 'Email 格式不正確'),
  ]),
)

FormBuilderTextField(
  name: 'password',
  decoration: InputDecoration(labelText: '密碼'),
  obscureText: true,
  validator: (value) {
    if (value == null || value.isEmpty) {
      return '密碼為必填欄位';
    }
    if (value.length < 8 || value.length > 20) {
      return '密碼長度必須為 8-20 碼';
    }
    if (!RegExp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)').hasMatch(value)) {
      return '密碼必須包含大寫、小寫英文和數字';
    }
    return null;
  },
)
```

## 安全性研究

### 1. 密碼處理

**決策**: 
- 前端:僅進行格式驗證,不儲存明文密碼
- 後端:使用 bcrypt 雜湊(cost factor: 12)

**理由**:
- bcrypt 設計用於密碼雜湊,抗暴力破解
- cost factor 12 平衡安全性和效能
- 自動處理 salt 生成和驗證

**Supabase 實作**:
```typescript
import * as bcrypt from 'bcrypt'

// 註冊時雜湊密碼
const hashedPassword = await bcrypt.hash(password, 12)

// 登入時驗證
const isValid = await bcrypt.compare(password, user.hashed_password)
```

### 2. JWT Token 安全

**決策**: 
- Token 包含:user_id, email, 發行時間, 過期時間(7 天)
- 使用 HS256 演算法簽署
- Token 儲存在 flutter_secure_storage(加密)

**理由**:
- JWT 無狀態,適合分散式系統
- 7 天過期時間平衡安全性和使用者體驗
- 加密儲存防止本地攻擊

**Token 結構**:
```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "iat": 1699200000,
  "exp": 1699804800
}
```

### 3. 驗證碼安全

**決策**:
- 6 位數數字驗證碼
- 5 分鐘有效期限
- 60 秒重發冷卻
- 5 次錯誤後鎖定
- 使用加密安全隨機數產生器

**理由**:
- 6 位數提供 100 萬種組合,足夠安全且使用者友善
- 短有效期限和重試限制防止暴力破解
- 冷卻時間防止簡訊轟炸(未來擴充)

**產生驗證碼**:
```typescript
function generateVerificationCode(): string {
  const code = crypto.getRandomValues(new Uint32Array(1))[0] % 1000000
  return code.toString().padStart(6, '0')
}
```

### 4. SQL Injection 防護

**決策**: 使用 Supabase 的參數化查詢和 ORM

**理由**:
- Supabase client 自動處理參數轉義
- Row Level Security (RLS)提供額外防護層
- 永不直接拼接 SQL 字串

**範例**:
```typescript
// ✅ 安全:使用參數化查詢
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', email)

// ❌ 危險:字串拼接(永不使用)
// const query = `SELECT * FROM users WHERE email = '${email}'`
```

## 效能優化研究

### 1. API 回應時間優化

**策略**:
- 使用 Supabase KV Store 快取驗證碼(避免資料庫查詢)
- 資料庫索引:email, user_id, created_at
- Edge Functions 部署在靠近使用者的邊緣節點
- 使用連線池減少資料庫連線開銷

**預期效果**:
- 登入 API: 100-200ms (KV cache hit)
- 註冊 API: 200-400ms (資料庫寫入 + Email 發送)
- 查詢交易: 50-100ms (使用索引)

### 2. 前端載入優化

**策略**:
- 延遲載入(Lazy loading)非關鍵頁面
- 圖片使用 cached_network_image 快取
- 交易列表使用虛擬滾動(ListView.builder)
- 預先載入下一頁資料(分頁)

**範例**:
```dart
ListView.builder(
  itemCount: transactions.length + 1,
  itemBuilder: (context, index) {
    if (index == transactions.length - 10) {
      // 提前 10 項載入下一頁
      ref.read(transactionProvider.notifier).loadMore();
    }
    return TransactionTile(transaction: transactions[index]);
  },
)
```

### 3. 離線優先策略

**策略**:
- 寫入操作先儲存到本地,返回即時回饋
- 背景同步到伺服器(工作佇列)
- 使用樂觀 UI 更新(optimistic updates)
- 同步失敗時重試(指數退避)

**實作**:
```dart
Future<void> createTransaction(Transaction transaction) async {
  // 1. 立即更新本地狀態(樂觀更新)
  state = AsyncData([...state.value!, transaction]);
  
  // 2. 儲存到本地佇列
  await _storageService.queueTransaction(transaction);
  
  // 3. 嘗試同步到伺服器
  try {
    await _apiService.createTransaction(transaction);
    await _storageService.removeFromQueue(transaction.id);
  } catch (e) {
    // 同步失敗,保留在佇列中稍後重試
    _scheduleRetry();
  }
}
```

## 測試策略研究

### 1. TDD 工作流程

**決策**: 嚴格遵循 Red-Green-Refactor 循環

**流程**:
1. **Red**: 撰寫失敗的測試(定義期望行為)
2. **Green**: 實作最簡程式碼讓測試通過
3. **Refactor**: 重構程式碼,保持測試通過

**範例**:
```dart
// Step 1: Red - 撰寫失敗測試
test('註冊成功後應返回使用者物件', () async {
  final repository = AuthRepository(mockApiService, mockStorage);
  
  final user = await repository.register('測試', 'test@example.com', 'Password123');
  
  expect(user.email, 'test@example.com');
  expect(user.name, '測試');
});

// Step 2: Green - 實作功能
// (實作 register 方法)

// Step 3: Refactor - 重構改善
// (優化程式碼結構)
```

### 2. 測試覆蓋率目標

**決策**: 維持 >80% 覆蓋率,關鍵路徑 100%

**重點測試區域**:
- 認證邏輯:100% 覆蓋(註冊、登入、驗證碼)
- 金額計算:100% 覆蓋(財務概覽、交易總計)
- 表單驗證:100% 覆蓋(密碼、Email、金額驗證)
- API 呼叫:100% 覆蓋(錯誤處理、重試邏輯)
- Repository:80% 覆蓋
- UI Widgets:60% 覆蓋(關鍵互動 100%)

### 3. Mock 策略

**決策**: 使用 mockito 產生 mock 物件

**原則**:
- 所有外部依賴必須 mock(API, Storage, Time)
- 使用 dependency injection 注入 mock
- 測試應獨立,不依賴真實網路或資料庫

**範例**:
```dart
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';

@GenerateMocks([ApiService, StorageService])
void main() {
  late MockApiService mockApi;
  late MockStorageService mockStorage;
  late AuthRepository repository;
  
  setUp(() {
    mockApi = MockApiService();
    mockStorage = MockStorageService();
    repository = AuthRepository(mockApi, mockStorage);
  });
  
  test('登入失敗應拋出 AuthFailure', () async {
    when(mockApi.post('/login', any))
      .thenThrow(DioException(type: DioExceptionType.badResponse));
    
    expect(
      () => repository.login('test@example.com', 'wrong'),
      throwsA(isA<AuthFailure>()),
    );
  });
}
```

## 未來擴充考量

### 1. 多語言支援

**準備工作**:
- 使用 flutter_localizations 和 intl 套件
- 所有 UI 文字使用 i18n keys
- 目前實作繁體中文,架構支援未來新增其他語言

### 2. 生物辨識登入

**準備工作**:
- 使用 local_auth 套件
- 在自動登入邏輯中預留生物辨識檢查點
- 需使用者明確同意啟用

### 3. 第三方登入

**準備工作**:
- Supabase Auth 原生支援 OAuth providers
- 需設定 Google/Facebook OAuth credentials
- 前端使用 supabase_flutter 的 signInWithOAuth

### 4. 資料匯出

**準備工作**:
- 設計 CSV/Excel 匯出格式
- 實作伺服器端匯出 Edge Function
- 考慮大資料量的分批匯出

## 參考資源

- [Flutter 官方文件](https://docs.flutter.dev/)
- [Riverpod 文件](https://riverpod.dev/)
- [Supabase 文件](https://supabase.com/docs)
- [Hono 文件](https://hono.dev/)
- [Material Design 3](https://m3.material.io/)
- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)
- [Flutter Clean Architecture](https://github.com/ResoCoder/flutter-tdd-clean-architecture-course)
