import type { GiphyFetch } from "@giphy/js-fetch-api";

export interface mainAppProps {
    giphyFetcher: GiphyFetch | {}
    registeredStreamers:string[]
}

export interface streamerInfo {
    auth_token:string
}