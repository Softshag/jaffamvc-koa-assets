/// <reference path="../node_modules/views/views.d.ts" />
import { LayoutView, DataView, DataViewOptions, TemplateViewOptions } from 'views';
import { IDataView } from 'views/lib/types';
import { AssetsModel } from './assets-collection';
export interface PreviewInfoOptions extends DataViewOptions {
}
export declare var AssetsInfoPreview: typeof DataView;
export declare type PreviewHandlerConstructor = new (options: DataViewOptions) => IDataView;
export declare function setPreviewHandler(mime: string | string[], view: PreviewHandlerConstructor): void;
export declare function getPreviewHandler(mime: string): PreviewHandlerConstructor;
export interface AssetsPreviewOptions extends TemplateViewOptions {
    infoView?: new (options?: PreviewInfoOptions) => IDataView;
    infoViewOptions?: PreviewInfoOptions;
}
export declare class AssetsPreview extends LayoutView<HTMLDivElement> {
    private _model;
    private infoView;
    model: AssetsModel;
    constructor(options?: AssetsPreviewOptions);
    onRender(): void;
    hideInfoView(hide?: boolean): void;
}
