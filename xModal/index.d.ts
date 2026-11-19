export interface iModalCreate {
    btnFocus: Function;
    btnDisable: Function;
    btnEnable: Function;
    btnClick: Function;
    setTitle: Function;
    btnFooter: Function;
    destroy: Function;
    open: Function;
    close: Function;
}
export interface iModal {
    el: string;
    title?: string;
    buttons?: {
        [nameButton: string]: {
            html: string;
            class?: string;
            click: (e?: any, dataOpen?: any) => void;
        };
    };
    onClose?: () => void;
    onOpen?: (data?: any) => void;
    resize?: boolean | [boolean, boolean, boolean, boolean];
    onCreate?: Function;
    theme?: "xModal-blue" | "xModal-opacity" | "xModal-dark" | "xModal-dark-square" | "xModal-bublue" | "xModal-dark-mobile" | "xModal-v23" | "xModal-xAtila" | "xModal-xAtila-dark" | "xModal-Vyzo";
    width?: number;
    height?: number;
    fullScreen?: boolean | true;
    closeBtn?: boolean;
    hash?: boolean;
    execAfter?: {
        time: number;
        btn: string;
    };
    esc?: boolean;
    modal?: boolean;
    titleDisplay?: boolean;
    onKeyDown?: {
        [cod_key: string]: (e?: any) => void;
    };
}
declare const _default: {
    create: (params: iModal) => void;
    dialogs: {
        dialogsOpen: {};
        onClose: {};
        execAfter: {};
        keyEsc: {};
        onKeyDown: {};
    };
    countIsOpen: () => number;
    setCss: (path: any) => void;
    setTheme: (_theme: any) => void;
    changeTheme: (_theme: any) => void;
    setBlur: () => void;
};
export default _default;
