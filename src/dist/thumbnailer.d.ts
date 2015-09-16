import { AssetsModel } from './assets-collection';
export declare const MimeList: {
    'audio/mpeg': string;
    'audio/ogg': string;
    'application/pdf': string;
    'video/ogg': string;
    'video/mp4': string;
    'video/x-m4v': string;
    'video/quicktime': string;
};
export declare class Thumbnailer {
    static request(asset: AssetsModel): Promise<string>;
    static has(asset: AssetsModel): Promise<string>;
}
