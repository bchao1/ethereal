# [107-2] Web Programming Final Project
(Group 21) Ethereal: Manage your bookmarks with grace.
***

# Ethereal :  Manage your bookmarks with grace.
> 線上瀏覽器書籤編輯平台。從瀏覽器匯入、編輯、儲存、並發布你的書籤，同時也可以收藏別人發布的書籤！
## 作者
B06901104 電機二 **趙崇皓** ｜ B06901061 電機二 **王廷峻**

## 連結
Github 連結：https://github.com/Mckinsey666/ethereal
   
Demo 影片連結：https://www.youtube.com/watch?v=25s9Pkz93C4&feature=youtu.be

## 目錄
- 緣起
- 功能介紹
- 使用套件與實作過程簡介
- 未來展望與心得

## 緣起
想要做這個作品是因為想要有一個平台能夠分享自己搜集的書籤。舉例而言，假如想要分享自己一系列跟網頁技術有關的網址，只能一個連結一個連結給，沒有辦法很快速方便的將整個資料夾給別人，就算別人拿到了網址，還需要自己一個一個加入瀏覽器的書籤，相當麻煩。利用我們的專案，可以快速一鍵發布想分享的書籤資訊，別人也可以快速匯入｜輸出書籤，過程快速方便。

## 使用

```
git clone https://github.com/Mckinsey666/ethereal.git
cd ethereal
npm install
npm start
```

到 `localhost:4000` 上使用我們的作品。

## 功能介紹
作為一個線上編輯書籤程式，我們的作品有完整的功能。

- 跨瀏覽器匯入書籤：
    - 上傳瀏覽器匯出的書籤html檔，並進行轉譯。
    - 根據書籤網址即時爬取網站資訊。
- 由書籤編輯程式下載書籤：編輯完成過後，使用者可以從我們的程式匯出編輯好的書籤成為瀏覽器相容的書籤輸出檔。
- 登入 | 註冊使用者：依照信箱註冊一個帳號、上傳使用者照片，並在資料庫建立你的資訊。
- 主頁面查看所有使用者的公開書籤（ Feeds ）：
    - 點按 Feed 資訊可以訪問該使用者頁面。
- 編輯書籤資料夾：
    - 新增｜刪除書籤資料夾。
    - 修改資料夾標題、建立時間、說明資訊。
    - 設定資料夾為公開｜私人。
    - 資料夾內搜尋書籤：在資料夾內按照標題搜尋書籤資訊。
    - 加入｜刪除書籤：輸入書籤網址與說明，即時自動爬取網址資訊（縮圖、網站說明）並匯入資料庫。
    - 將收藏的書間匯入成為自己的私人書籤。
- 觀看其他使用者頁面：
    - 以使用者名稱搜尋使用者主頁面。
    - 查看與收藏該使用者的公開書籤。

## 使用套件與實作過程簡介
這次的期末專題除了UI函式庫裡的一些 Component，我們並沒有使用任何的其他框架，完全都是自己手刻，也花了相當多的時間在使用者介面排版與設計。下面選擇一些主題介紹我們的實作與過程中遇到的問題與感想。
### 使用套件
#### 前端框架：`React`

寫了一學期的React，覺得已經慢慢可以自在的運用component與state，哪些component層級要拉高或獨立出來已經可以直覺判斷，傳遞callback props也更加得心應手。這次由於利用更多function component，學習到了React hooks的一些寫法，例如useState() 和 useEffect()，算是這次的新知之一。
#### 前端 UI 套件： `Material UI` - 強大的 UI 函式庫

這次大概是第四次前端使用 Material UI 寫使用者介面，因為實在是太好用、功能太齊全了。這次更熟悉如何將 native css 和material ui 相容，與 customize styling 的技巧。
#### 其他前端套件與實作
- **Routing** : `react-router-dom`：新學習了`<Redirect />` 的使用方法，以及如何利用 url 傳遞參數。由於 React Router 是 client-side routing，在後端要做一些處理才不會發生如下的錯誤。
```
Cannot GET /(some url)
```
```javascript 
// In backend server.js
// 在後端，接收到任何 request 都重新去 send 前端的 index.html
server.get('*', function (request, response){
    response.sendFile(path.resolve('build/index.html'));
})
```
- **上傳圖片**：使用 `file-saver`函式庫建立檔案上傳的 FileReader物件，並單純用 html 的 `input` 來拿到 file 的資料。最後用 `readAsDataUrl` 將取到的圖片資訊編碼成字串直接傳到後端。

#### 後端伺服器： `graphql-yoga`
習慣了 express，用 `graphql-yoga` 提供的GraphQL Server可以完全無痛，因為 GraphQL server 也只是把express 包在裡面而已。我們在`/backend/resolvers`裡面定義了 GraphQL 的  resolver，內容和 `/backend/schema.graphql` 與前端 `/frontend/graphql` 裡的內容相互吻合。

#### 後端資料庫：MongoDB + `mongoose`
在 `/backend/models` 裡面定義了 MongoDB 裡面存的資料的格式。我們有定義了三種 collection 物件：user, bookmarks，和 collections，方便與 GraphQL 的 resolver 接軌，進行有效率的資料查詢。

一開始我們是先使用一個假的資料庫物件 (db.js) 做測試，最後在連到資料庫。因此最後到 production 還要將 Javascript 的語法轉換成 mongoose 的函式。

```javascript
// 舉例
// Vanilla Javascript
collection.filter(item => item.id === id);
// Using mongoose
collection.find({id: id}).exec().then(result => {...}).catch(err => {...});

```
我覺得這個方法在小專案可能還可以使用，但是到了大型專案，還是先一個個熟悉 mongoose 函式，然後進行 incremental test 會好一些。

#### 後端**爬蟲**：`request-promise` ＋ `cheerio`
我們利用 `request-promise` 去拿到書籤的 html 資訊並用 `cheerio` 解析 html 檔拿到我們想到的資訊。基本上，大部分網站的資訊都可以在 `<meta/>` tags 裡找到，舉例而言，我們對 `<meta/>`的 name property 去 filter，看有沒有 icon, favicon 的字串，就可以輕易找到網站的 logo。
   
在爬蟲過程中遇到的問題最大的就是 asynchronous functions，也體會到了老師上課講的 callback hell。為了解決資料流不同步的問題，我們花了一點時間複習 Promise 和 async / await。

#### 其它套件
- `body-parser`：處理後端資料流的一些設定。
- `validator`：拿來驗證 email / url 是否合法。
- `react-apollo`：前端和後端 GraphQL Server 的接口。
- `animate.css`：前端動畫函式庫。

## 心得
### **趙崇皓**
這次的專題我們是兩個人一組，是完全重頭開始一個新的主題，最後做出了一個有完整功能的服務，相當有成就感。我們沒有明確地分工成前後端，我只有多處理爬蟲與資料上傳，其餘的使用者介面、資料庫，與其他大大小小的問題，都是兩個人一起實作解決，或許可說是兩個人的全端工程師初體驗（？）。我們會這樣選擇的原因是這次處理了很多的資料庫存取，在前端使用後端拿到的資料時如果沒有溝通好，可能會存取到一大堆 undefined XD，在 debug 時也較不方便，所以我們選擇以 "Component" 以及 "功能" 來分工。事實證明我們的決定還蠻正確的，因為過程中在 merge 的時候基本上是完全無痛，conflict 極少，而且前後端都順利串在一起。
   
由於我負責處理爬蟲，實作會用到 `request-promise`，也因此在整份期末專題中我遇到最大的問題就是 asynchronous functions，因此有點後悔期中時沒好好研究。但最後在各種查資料、callback hell，與拿到一堆 undefined 資料以後終於把裡面 async / await 寫好，覺得自己學到很多，也更熟悉了 Promise！除此之外，我覺得期末專題最大的收穫真的是資料庫。期中時沒有 GraphQL 實在是痛苦，觸發任何資料存取的事件都需要自己從前端傳 request 給後端，有了 `react-apollo` 提供的接口，一切方便許多。另外，我們也花了不少時間在網頁的美觀與設計，盡量做到使用者能流暢而舒服的使用我們的服務，因此排版動畫與配色、也都是重點之一。
   
最後，真的十分感謝我的組員，兩人在段考後從零開始，每天從早寫到晚，最後弄出了完整的作品。我覺得 Web 實在是博大精深，每一個小環節都自成一個知識圈，光是要能稍微熟悉一下技術就要花很多時間，何況有數以千計的技術帶我們摸索。這次專題也成為我未來想要繼續鑽研的動力。
  
### **王廷峻** 

這次的期末專題我們嘗試把上課以來所有學到的套件都使用在上面：包含前端 React, Apollo-client, 後端 Node.js, GraphQL。由於我們分工的方式是同時寫前端不同頁面與後端相對功能，因此我們兩人對於前後端整合都非常有概念。我們對於 Ethereal 的最終想法是希望能成為書籤交流的社群，讓使用者能互相交流整理好的資源，並且提供 inbox 功能讓其他使用者對於書籤做建議修正。在資訊量非常大的現在，能直接使用別人整理好的資源來學習、查找資料，將能節省很多碰壁摸索的時間。
   
在實作過程中，最困難的事之一為理解 GraphQL 和 MongoDB 兩者之間 schema 的差異還有 GraphQL 回傳資料型態的部分。在寫了 Query, Mutation Resolver 之後才完全理解兩者的關聯，也真正能感受到 GraphQL 的強大。在期中專題時我將資料結構性的直接存在 MongoDB，但這次期末專題完全將「儲存資料」、「使用資料」兩者完全分開，分別由 MongoDB, GraphQL 做處理，這點是我學到最多的部分。
   
最後要感謝我的組員—趙崇皓，處理很多非同步的問題、debug Resolver ，還有到最後一刻都還在嘗試 deploy 到 Heroklu 上。謝謝 Ric 開授這門課，讓我學習到怎麼看網路上的 Documentation、自學各種套件，也讓我從上學期資結時只會寫C++，到現在對於 JS 也相當熟悉。

## 未來展望
- 追蹤使用者：即時拿到他新發布整理過後的書籤！
- 加強登入系統：由於此次的重點是功能齊全與使用者介面，登入介面其實只是一個 Wrapper而不安全，希望以後可以按照現行的規範建立一個安全的登入系統。
- 確保更多平台的支援：做到除了Safari和Chrome之外的支援。
- 建立書籤資料夾評論區：評價並對資料夾點讚。

大抵而言，我們希望未來能夠做出一個完整的書籤資料夾分享社群。