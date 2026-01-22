# JWT Encoder / Decoder

一個功能完整的 JWT（JSON Web Token）編碼器和解碼器 Web 應用程式，完全在客戶端運行，確保您的數據 100% 私密。

## 功能特色

### JWT Decoder（解碼器）
- 解碼 JWT token，顯示 Header 和 Payload
- 支援公鑰驗證（PEM 格式）
- 支援 JWKs Endpoint URI 驗證
- 顯示 token 過期時間和相關資訊
- 即時驗證簽名

### JWT Encoder（編碼器）
- 輸入 Header 和 Payload（JSON 格式）
- 選擇加密演算法
- 使用私鑰簽名生成 JWT
- 可選的公鑰驗證功能
- 即時生成和預覽

### 支援的演算法
- **對稱加密**: HS256, HS384, HS512
- **RSA**: RS256, RS384, RS512
- **ECDSA**: ES256, ES384, ES512
- **RSA-PSS**: PS256, PS384, PS512

### 其他功能
- 深色主題 UI
- JWT 範例快速測試
- 分享功能（透過 URL 參數）
- 完全在瀏覽器本地處理，無需伺服器

## 技術棧

- **框架**: Next.js 14+ (App Router)
- **語言**: TypeScript
- **UI 庫**: React
- **JWT 處理**: jose
- **樣式**: Tailwind CSS
- **圖標**: Lucide React

## 本地開發

### 安裝依賴

```bash
npm install
```

### 啟動開發伺服器

```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 查看應用程式。

### 建置生產版本

```bash
npm run build
npm start
```

## 部署到 Vercel

Vercel 對 Next.js 有原生支援，部署非常簡單：

### 方法 1: 透過 Vercel Dashboard（推薦）

1. 前往 [Vercel](https://vercel.com) 並登入
2. 點擊 **Add New Project**
3. 連接您的 Git 儲存庫（GitHub、GitLab 或 Bitbucket）
4. Vercel 會自動檢測 Next.js 專案
5. 確認設定（通常不需要修改）：
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`（自動偵測）
   - **Output Directory**: `.next`（自動偵測）
6. 點擊 **Deploy**

### 方法 2: 使用 Vercel CLI

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 在專案目錄中執行
vercel

# 生產環境部署
vercel --prod
```

### 自動部署

- 每次推送到 `main` 分支會自動觸發生產部署
- 推送到其他分支會自動建立預覽部署
- 每個 Pull Request 都會有獨立的預覽 URL

### 環境變數

通常不需要額外的環境變數，因為所有處理都在客戶端進行。

### 優勢

- ✅ 零配置部署（自動檢測 Next.js）
- ✅ 全球 CDN 加速
- ✅ 自動 HTTPS
- ✅ 預覽部署（每個 PR）
- ✅ 自動優化

## 專案結構

```
jwt-decoder/
├── app/
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 主頁面
│   └── globals.css         # 全域樣式
├── components/
│   ├── JWTDecoder.tsx      # JWT 解碼器元件
│   ├── JWTEncoder.tsx      # JWT 編碼器元件
│   ├── AlgorithmSelector.tsx  # 演算法選擇器
│   ├── KeyInput.tsx        # 密鑰輸入元件
│   └── JSONViewer.tsx      # JSON 顯示元件
├── lib/
│   ├── jwt.ts              # JWT 處理邏輯
│   ├── algorithms.ts       # 演算法配置
│   ├── jwks.ts             # JWKs 處理
│   └── examples.ts         # JWT 範例
├── types/
│   └── jwt.ts              # TypeScript 類型定義
└── package.json
```

## 使用說明

### 解碼 JWT

1. 切換到 **Decoder** 標籤
2. 貼上您的 JWT token
3. （可選）輸入公鑰或 JWKs Endpoint URI 進行驗證
4. 查看解碼後的 Header 和 Payload

### 編碼 JWT

1. 切換到 **Encoder** 標籤
2. 輸入 Header（JSON 格式）
3. 輸入 Payload（JSON 格式）
4. 選擇演算法
5. 輸入私鑰
6. 查看生成的 JWT

### 使用範例

點擊 **JWT 示例** 按鈕可以快速載入預設範例進行測試。

### 分享 JWT

點擊 **分享 JWT** 按鈕可以複製包含當前狀態的 URL，方便分享給他人。

## 安全性

- ✅ 所有處理完全在瀏覽器本地執行
- ✅ 不發送任何數據到伺服器
- ✅ 密鑰不會被儲存或傳輸
- ✅ 100% 私密處理

## 授權

MIT License

## 貢獻

歡迎提交 Issue 和 Pull Request！
