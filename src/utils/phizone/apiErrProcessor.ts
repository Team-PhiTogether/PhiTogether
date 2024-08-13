import shared from "../js/shared";

export interface PZApiErr {
    type: string,
    message: string,
}

// wtf that it has so much types of response
interface PZRespErr1 { // password error
    error: string,
    error_description: string,
    // error_uri: string, // no use
}
interface PZRespErr2 { // invaild token
    items: {
        ".error": string,
        ".error_description": string,
    },
}
enum RetriveTokenErr {
    InvaildToken = "invalid_token",
    InvaildGrant = "invalid_grant",
}
export function retriveTokenErr(response: PZRespErr1 | PZRespErr2): PZApiErr {
    const returns: PZApiErr = {
        type: "",
        message: ""
    };
    if ("error" in response) {
        returns.type = response.error;
        if (response.error === RetriveTokenErr.InvaildGrant) returns.message = shared.game.i18n.t("phizone.err.retriveToken.invalidPswd");
        else returns.message = shared.game.i18n.t("phizone.err.unknown");
    } else if ("items" in response) {
        returns.type = response.items[".error"];
        if (response.items[".error"] === RetriveTokenErr.InvaildToken) returns.message = shared.game.i18n.t("phizone.err.retriveToken.unableToFindUser");
        else returns.message = shared.game.i18n.t("phizone.err.unknown");
    } else returns.message = shared.game.i18n.t("phizone.err.unknown");
    return returns;
}