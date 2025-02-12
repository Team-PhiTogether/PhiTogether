import ChartSelectPageComponent from "../pages/chartselect.vue";
import StartPageComponent from "../pages/startpage.vue";
import PlayingPageComponent from "../pages/playing.vue";
import LoginPageComponent from "../pages/login.vue";
import CalibratePageComponent from "../pages/calibrate.vue";
import CacheManagePageComponent from "../pages/cachemanage.vue";
import AboutPageComponent from "../pages/aboutpage.vue";
import UserChartUploadComponent from "../pages/userChartUpload.vue";
import UserChartEditComponent from "../pages/userChartEdit.vue";
import PlayerB20Component from "../pages/playerB20.vue";
import PZRankSingleComponent from "../pages/pzRankSingle.vue";
import ReplayPageComponent from "../pages/replayPage.vue";
import ChangeLogsComponent from "../pages/changelogs.vue";
import LoadingPageComponent from "../pages/loadingPage.vue";
import multiIndexPageComponent from "../pages/multiIndex.vue";

const EmptyPageComponent = { name: "Empty", template: "<span></span>" };

const routes = [
    { path: "/startPage", component: StartPageComponent },
    { path: "/chartSelect", component: ChartSelectPageComponent },
    { path: "/playing", component: PlayingPageComponent },
    { path: "/login", component: LoginPageComponent },
    { path: "/calibrate", component: CalibratePageComponent },
    { path: "/cacheManage", component: CacheManagePageComponent },
    { path: "/aboutPage", component: AboutPageComponent },
    { path: "/chartUpload", component: UserChartUploadComponent },
    { path: "/chartEdit", component: UserChartEditComponent },
    { path: "/playerB20", component: PlayerB20Component },
    { path: "/pzRankSingle", component: PZRankSingleComponent },
    { path: "/replayPage", component: ReplayPageComponent },
    { path: "/changelogs", component: ChangeLogsComponent },
    { path: "/loading", component: LoadingPageComponent },
    { path: "/multiIndex", component: multiIndexPageComponent },
    // 虚拟页面
    { path: "/multipanel", component: EmptyPageComponent },
    { path: "/settings", component: EmptyPageComponent },
];

export default routes;
