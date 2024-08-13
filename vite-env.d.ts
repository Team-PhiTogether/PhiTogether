/// <reference types="vite/client" />

export interface ImportMetaEnv {
    readonly VITE_MP_SERVER: string;
}

export interface ImportMeta {
    readonly env: ImportMetaEnv;
}