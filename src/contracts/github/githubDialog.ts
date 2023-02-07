export interface GithubDialog {
    ariadne: Array<GithubDialogLines>;
    gemini: Array<GithubDialogLines>;
    mercury: Array<GithubDialogLines>;
    tethys: Array<GithubDialogLines>;
    hesperus: Array<GithubDialogLines>;
}

export interface GithubDialogLines {
    type: GithubDialogType;
    message: string;
}

export enum GithubDialogType {
    message,
}