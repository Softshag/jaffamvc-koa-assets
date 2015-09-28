import { ViewOptions, LayoutView } from 'views';
import { AssetsListView } from './assets-list';
import { AssetsPreview } from './assets-preview';
import { AssetsCollection, AssetsModel } from './assets-collection';
export declare function template(name: string): ClassDecorator;
export declare function attributes(attrs: Object): ClassDecorator;
export interface GalleryViewOptions extends ViewOptions {
    uploadButton?: boolean;
    collection?: AssetsCollection;
    url?: string;
    removeable?: boolean;
}
export declare class GalleryView extends LayoutView<HTMLDivElement> {
    collection: AssetsCollection;
    selected: AssetsModel;
    private _listView;
    private _preView;
    private _uploadButton;
    listView: AssetsListView;
    preView: AssetsPreview;
    constructor(options?: GalleryViewOptions);
    onRender(): void;
    private _onItemCreate(asset);
    private _onItemSelect({model});
    private _onItemRemove({model});
}
