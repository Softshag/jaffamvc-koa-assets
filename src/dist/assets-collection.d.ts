/// <reference path="../node_modules/views/views.d.ts" />
import { Collection, CollectionOptions, Model } from 'views';
export interface AssetsCollectionOptions extends CollectionOptions<AssetsModel> {
    url: string;
}
export interface AssetsCollectionFetchOption {
}
export declare class AssetsModel extends Model {
    idAttribute: string;
}
export declare class AssetsCollection extends Collection<AssetsModel> {
    Model: typeof AssetsModel;
    comparator: string;
    url: string;
    constructor(models: any, options: AssetsCollectionOptions);
    fetch(options?: AssetsCollectionFetchOption, progress?: () => void): Promise<any>;
}
