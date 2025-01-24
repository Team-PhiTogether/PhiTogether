import shared from "../js/shared.js";
import { TmodifiedWindow } from "../ptmain/types/modifiedWindow.ts";
import { TapTapUserInfo } from "./userInfo.type.ts";

export const TapTapApi = {
    loginWithTapTap(): Promise<TapTapUserInfo> {
        const w = window as unknown as TmodifiedWindow;
        if (w.nativeApi && w.nativeApi) {
            w.nativeApi.loginWithTapTap();
            return new Promise((res, rej) => {
                shared.game.loginWithTapTapCallback = (e: TapTapUserInfo | undefined) => {
                    if (e) {
                        res(e);
                    } else {
                        rej(undefined);
                    }
                };
            });
        } else {
            return Promise.reject();
        }
    },
};
