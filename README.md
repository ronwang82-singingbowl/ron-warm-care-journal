# 暖心同行 · GitHub Pages 版

網站畫面由 GitHub Pages 提供，Google 登入與關懷紀錄使用原有 Firebase 專案 ron-care-journal。

## 第一次上線

1. 在 ronwang82-singingbowl 帳號下建立 Public 儲存庫 `ron-warm-care-journal`，勾選 Add a README file。
2. 將本資料夾「裡面的檔案與資料夾」上傳到儲存庫根目錄，不要多包一層 warm-care-github。
3. GitHub 儲存庫 Settings → Pages → Source 選 Deploy from a branch；Branch 選 main，資料夾選 /docs，按 Save。
4. Firebase Console → ron-care-journal → Authentication → Settings → Authorized domains，新增 `ronwang82-singingbowl.github.io`（不含 https:// 與路徑）。
5. 等待 GitHub Pages 發布完成後開啟 https://ronwang82-singingbowl.github.io/ron-warm-care-journal/ ，用原本的 Google 帳號登入。
6. 確認原有紀錄顯示、測試儲存與重新整理，再測試匯出備份。

GitHub 公開的是網站程式。請勿上傳匯出的個人關懷 JSON、服務帳戶私鑰或登入憑證。本套件不含個人關懷紀錄。
Firestore 的存取權限仍由你已發布的規則決定；本次不修改規則，也不搬移資料。

## 網址與後續修改

本版本對應 `/ron-warm-care-journal/` 路徑。若改儲存庫名稱或改用自己的網域，需一併調整 vite.config.ts 的 base 並重新建置。
`docs/` 已包含編譯完成的網站，首次上傳不用在自己的電腦安裝 Node.js。

日後修改 src 原始碼後，需在 Cloud Shell 或有 Node.js 的環境執行：

```sh
npm ci
npm run build
```

再將更新後的原始碼與 docs/ 提交到 GitHub。只更新 src 不會改變已發布畫面。

## 官方說明

- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://firebase.google.com/docs/auth/web/google-signin

## 本套件驗證

此版本以已上線的編譯檔調整 GitHub Pages 路徑；已核對四處導覽路徑、首頁資源存在與 JavaScript 語法。原始碼同步更新；此環境無法下載套件，未重新執行完整建置。登入與儲存仍需在新網域上線後實測。
