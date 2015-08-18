/// <reference path="../node_modules/views/views.d.ts" />
import { CollectionView, CollectionViewOptions, DataView } from 'views';
export interface AssetsListOptions extends CollectionViewOptions {
    deleteable?: boolean;
}
export declare const AssetsListItem: any;
export declare class AssetsListView extends CollectionView<HTMLDivElement> {
    _current: DataView<HTMLDivElement>;
    constructor(options?: AssetsListOptions);
}
