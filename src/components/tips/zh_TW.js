export default [
    "這是一條專屬於2.0版本的Tip！",
    "sudo mkdir astroxxx",
    "玩家把官方未來要開發的東西都開發完了.jpg",
    "別人是 PhiTogether，我是 FalseAlone",
    "PhiTogether 的持續運行需要你的支持！快來關於頁面的愛發電支持我們吧",
    "你可以在 status.phitogether.fun 查看伺服器狀態",
    "我知道加載很慢，但是你先別急",
    "你 先 別 急.mp4",
    "歪哎而抗姆 突 發哎突蓋澤兒",
    "數學作業 AT Lv.17",
    "你說得對，但是 PhiTogether 是一款後面忘了",
    "如果你的設備鎖在 30 幀可能是開省電模式了",
    "你說有沒有一種可能，多人模式可以單人玩",
    "聽說你的 PhiZone API 密鑰曾經是 2FcA9R67jZZpXZcPG",
    "歡迎來 PT 的 Github 帳號看我們堆出來的答辯",
    "熱知識：房間 ID 可以是任意字符，但是不能包含 $",
    "救命寫不出 Tips 了",
    "正在重新連線至地球OL",
    "Tip: Tip: Tip: Tip: Tip:",
    "與 Phigrim 合作多人遊戲可能性微存",
    "const HairCount = 114514 - elapsedDayCount;",
    "我刪除了一點 PT 中的網頁元素，這樣你才知道你玩的其實是個遊戲",
    "蘋果設備沒聲音？控制中心裡小鈴鐺點一下!",
    "玩久了記得讓眼睛和手腕放鬆一下",
    "我超，勁爆",
    "www.皮在一起.fun",
    "在披區裡披合一並且皮在一起，多是一件美事",
    "標準大氣壓下，直角90度，開水100度，那麼開水是鈍角",
    "標準大氣壓下，開水100度，直角90度，那麼直角沒燒開",
    "三倍!☆ ice cream!!★~",
    "Are you ready! Yooooooooo—",
    "這是什麼？更新？阿巴阿巴……",
    "當你在玩PT的時候，一定在玩PT吧！",
    "大家好啊，今天給大家來點想看的東西",
    "PhiTogether 伺服器的運行成本在每個月 200r 左右",
    "設置裡可以選擇另一個風格的結算背景音樂",
    "設置裡勾選 使用思源黑體 能使你找回熟悉的感覺(?",
    "求求你們更新版瀏覽器",
    "蘋果設備老是彈出撤銷怎麼辦，去輔助功能=>觸控裡關掉搖動以撤銷就好啦！",
    "使用 PT 在線資源包甚至可以自定義打擊特效！",
    "PhiTogether 是可以開啟譜面鏡像的！在點擊播放前在譜面鏡像處選擇開啟即可",
    "單人遊戲時雙擊左下角可以轉板",
    "function 有沒有人能提供一條比較好的Tip() { return 有沒有人能提供一條比較好的Tip() }",
    function () {
        if (spec.isPhiTogetherApp) {
            return "誒？！你竟然在用 PhiTogether App！";
        } else if (spec.isAppleDevice && window.spec.isiOSDevice) {
            return "讓我猜猜，你用的一定是蘋果設備!";
        } else if (spec.isAppleDevice && !window.spec.isiOSDevice) {
            return "讓我猜猜，你用的一定是蘋果設備，是 Mac/Apple Watch/Apple TV 還是 Apple Vision Pro 呢";
        } else {
            return "讓我猜猜，你用的一定是安卓或PC!";
        }
    },
    function () {
        function getLifeSpan() {
            let launchDate = new Date("March 11, 2023 20:20:00");
            let timeNow = new Date();
            let elapsedTime = (timeNow - launchDate) / 1000;
            let elapsedDays = Math.ceil(elapsedTime) / 86400;
            // console.log(elapsedTime);
            return Math.round(elapsedDays);
        }
        return `當你看到這條 Tip 的時候，PT 已經苟活了 ${getLifeSpan()} 天`;
    },
    function (info) {
        return `讓我猜猜，現在上面的字是 ${info} !`;
    },
];
