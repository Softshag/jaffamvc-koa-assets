/// <reference path="typings/tsd.d.ts" />
import { EventEmitter } from 'views';
export declare enum HttpMethod {
    GET = 0,
    POST = 1,
    PUT = 2,
    DELETE = 3,
}
export declare class HttpError implements Error {
    name: string;
    message: string;
    code: number;
    constructor(message: string, code: number);
}
export interface FileUploaderOptions {
    url: string;
    method?: HttpMethod;
    maxSize?: number;
    mimeType?: string[] | string;
    parameter?: string;
}
export declare type FileUploadResult = any;
export interface FileUploadProgress {
    (progress: number, total: number): any;
}
export default class FileUploader extends EventEmitter {
    options: FileUploaderOptions;
    constructor(options: FileUploaderOptions);
    upload(file: File, progressFn?: FileUploadProgress, attributes?: Object): Promise<Object>;
    validateFile(file: File): void;
}
