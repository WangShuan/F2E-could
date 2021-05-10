# F2E-cound

## 基本架構

主要使用 firebase 的 storage 存放上傳後的檔案

頁面使用 bootstrap 架設

## firebase

首先建立專案 這邊取名 F2E-could

建立後再建立應用程式 這邊選擇網頁應用程式 名字取為 f2e-could

完成後進入專案設定 往下找到 Firebase SDK snippet 將下面所有代碼貼入 body 標籤的最下方

另外在引入的 firebase-app.js 下一行加入以下代碼

```html
<script src="https://www.gstatic.com/firebasejs/8.4.2/firebase-storage.js"></script>
```

整體加入的代碼如下：

```html
<!-- The core Firebase JS SDK is always required and must be listed first -->
<script src="https://www.gstatic.com/firebasejs/8.4.2/firebase-app.js"></script>
<!-- firebase storage -->
<script src="https://www.gstatic.com/firebasejs/8.4.2/firebase-storage.js"></script>

<!-- TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#available-libraries -->

<script>
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: `${你的 apiKey}`,
    authDomain: `${你的 authDomain}`,
    databaseURL: `${你的 databaseURL}`,
    projectId: `${你的 projectId}`,
    storageBucket: `${你的 storageBucket}`,
    messagingSenderId: `${你的 messagingSenderId}`,
    appId:`${你的 appId}`
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
</script>
```

## firebase storage

在 firebase 頁面 進入左方選單中的 storage

點擊`開始使用` 接下來直接按下`下一步` 會出現一個選單 他要問你將東西存放在哪個地區

（這邊可以點擊上方的`了解詳情` 查看選項對應的地區 這裏因為我們在台灣 選香港 即 `asia-east2`）

創建完成後進入到 `Rules` 將 `allow read, write: if request.auth !== null` 改成 `allow read, write: if true;` (開放權限)

最後回到 js 中撰寫上傳檔案的代碼 即可將文件上傳至我們的 firebase storage 了

### 上傳文件

使用 `input:file` 綁定 `change` 事件

這裡補充一下 該按鈕會將上傳的檔案保存在 `event.target.files` 中

為了阻止重複獲取 我們在 `onchange` 之前加上 `unbind()`

另外上傳時要先確認是否有重複名稱 因為 `firebase storage` 會直接覆蓋重名的檔案

完整代碼如下：

```js
$("#uploadFile")
  .unbind()
  .on("change", function (e) {
    const file = e.target.files[0];
    let dbname;
    if (file) {
      let path;
      dbname = vm.file.find((item) => {
        return item.name == file.name;
      });
      if (dbname) {
        if (confirm(file.name + " 已存在，是否覆蓋？")) {
          path = file.name;
        } else {
          return;
        }
      } else {
        path = file.name;
      }
      if (path) {
        const storageReference = firebase.storage().ref(path);
        const task = storageReference.put(file);
        task.on(
          "state_changed",
          function progress(snapshot) {
            vm.isUploading = true;
            vm.runningValue =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            vm.running = snapshot.bytesTransferred;
            vm.fileSize = snapshot.totalBytes;
          },
          function error() {},
          function complete() {
            vm.getData();
          }
        );
      }
    }
  });
```

### 下載文件的跨域問題

下載文件會遇到跨域問題 請參考 [firebase 說明文件](https://firebase.google.com/docs/storage/web/download-files#cors_configuration)

在項目目錄最外層中新增 `cors.json` 檔案

檔案內容設置如下：

```json
[
  {
    "origin": ["*"],
    "method": ["GET"],
    "maxAgeSeconds": 3600
  }
]
```

接著開啟終端機到項目目錄中 輸入指令：

```shell
gsutil cors set cors.json 你的Storage資料夾網址
```

如果報錯 則輸入指令：

```shell
gcloud auth login
```

然後選擇你當前 Firebase 應用程式的 google 帳號登入

接著再次輸入指令：

```shell
gsutil cors set cors.json 你的Storage資料夾網址
```

最後有看到終端機出現 Setting CORS on gs:/xxxx 就成功了！

再執行下載檔案時就不會有跨域錯誤了

### 下載文件

`firebase storage` 有提供 `getDownloadUrl()` API 可以獲取下載連結

我們通過建立 `a` 標籤 並設置屬性 `download` 即可使用 `url` 下載文件

代碼如下：

```js
const fileRef = firebase.storage().ref(file);
fileRef.getDownloadURL().then(function (url) {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      let a = document.createElement("a");
      let url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = fileRef.fullPath;
      a.target = "_blank";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
});
```

### 刪除文件

使用以下代碼完成：

```js
const fileRef = firebase.storage().ref(file);
fileRef.delete().then();
```
