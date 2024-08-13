export interface PZUserBasicInfo {
    email: string,
    emailConfirmed: boolean,
    id: number,
    userName: string,
    avatar: string,
    // language: zh-TW,
    biography: string,
    role: string,
    experience: number,
    rks: number,
    dateLastLoggedIn: string,
    // dateJoined: string,
    // dateOfBirth: string,
    isPTDeveloper?: boolean,
    nameplates: Object,
}
export interface PZUserTokenInfo {
    access_token: string,
    token_type: string,
    expires_in: number,
    scope: string,
    refresh_token: string,
}
export interface PZPlayConfig {
    id: string,
    name: string,
    perfectJudgment: number,
    goodJudgment: number,
    aspectRatio: Object,
    noteSize: number,
    chartMirroring: number | boolean,
    backgroundLuminance: number,
    backgroundBlur: number | boolean,
    simultaneousNoteHint: boolean,
    fcApIndicator: boolean,
    chartOffset: number,
    hitSoundVolume: number,
    musicVolume: number,
    ownerId: number,
    dateCreated: string,
}
export interface TapTapUserInfo {
    name: string,
    avatar: string,
    unionId: string,
    macKey: string,
    accessToken: string
}