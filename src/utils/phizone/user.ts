import { PZUserTokenInfo, PZUserBasicInfo, PZPlayConfig } from "./userInfo.type";
import { PhiZoneAPI as api } from "./api";

// 废了
export class PZUser {
    public tokenInfo: PZUserTokenInfo | null;
    public userBasicInfo: PZUserBasicInfo | null;
    public defaultConfigID: string | null;
    public defaultConfig: PZPlayConfig | null;
    public pzBestRecords: Object | null;

    constructor(tokenInfo: PZUserTokenInfo) {
        this.tokenInfo = tokenInfo;
        api.getUserBasicInfo(tokenInfo.access_token).then(i => (this.userBasicInfo = i));
    }
}

export function getUserColor(type: string | undefined): string {
    switch (type) {
        case "Member":
            return "rgb(115 115 115)";
        case "Sponsor":
            return "rgb(245 158 11)";
        case "Qualified":
            return "rgb(20 184 166)";
        case "Volunteer":
            return "rgb(249 115 22)";
        case "Moderator":
            return "rgb(16 185 129)";
        case "Administrator":
            return "rgb(99 102 241)";
        default:
            return "rgb(120 113 108)";
    }
}
