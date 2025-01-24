import ChartSelectPageComponent from "../chartselect.vue";
import StartPageComponent from "../startpage.vue";
import PlayingPageComponent from "../playing.vue";
import LoginPageComponent from "../login.vue";
import CalibratePageComponent from "../calibrate.vue";
import CacheManagePageComponent from "../cachemanage.vue";
import AboutPageComponent from "../aboutpage.vue";
import UserChartUploadComponent from "../userChartUpload.vue";
import UserChartEditComponent from "../userChartEdit.vue";
import PlayerB20Component from "../playerB20.vue";
import PZRankSingleComponent from "../pzRankSingle.vue";
import ReplayPageComponent from "../replayPage.vue";
import ChangeLogsComponent from "../changelogs.vue";
import LoadingPageComponent from "../loadingPage.vue";
import multiIndexPageComponent from "../multiIndex.vue";

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
