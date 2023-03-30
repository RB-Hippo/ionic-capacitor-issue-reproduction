export class AttachedPhoto {

    private _id: string;
    private _base64: string;
    private _filePath: string;
    private _webviewPath: string;

    constructor(attachedPhoto?: Partial<AttachedPhoto>) {
        if (attachedPhoto !== undefined) {
            Object.assign(this, attachedPhoto);
        }
    }

    public get id(): string {
        return this._id;
    }

    public set id(value: string) {
        this._id = value;
    }

    /**
     * Getter base64 used for displaying images in image tag on web.
     * @return {string}
     */
    public get base64(): string {
        return this._base64;
    }

    /**
     * Setter base64 used for displaying images in image tag on web.
     * @param {string} value
     */
    public set base64(value: string) {
        this._base64 = value;
    }

    /**
     * Getter filePath
     * @return {string}
     */
    public get filePath(): string {
        return this._filePath;
    }

    /**
     * Setter filePath
     * @param {string} value
     */
    public set filePath(value: string) {
        this._filePath = value;
    }

    /**
     * Getter webviewPath used for displaying images in image tag on mobile.
     * @return {string}
     */
    public get webviewPath(): string {
        return this._webviewPath;
    }

    /**
     * Setter webviewPath used for displaying images in image tag on mobile.
     * @param {string} value
     */
    public set webviewPath(value: string) {
        this._webviewPath = value;
    }
}
