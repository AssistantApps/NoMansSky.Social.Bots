import Swal from "sweetalert2";

export interface IConfirmationPopupProps {
    title: string;
    confirmButtonText: string;
}
export const confirmationPopup = async (props: IConfirmationPopupProps): Promise<boolean> => {

    const firstSwalPromise = Swal.fire({
        title: props.title,
        showCancelButton: true,
        confirmButtonText: props.confirmButtonText,
    });

    const { isConfirmed } = await firstSwalPromise;

    return isConfirmed;
}


export interface ICopyPopupProps {
    title: string;
    description: string;
    textToCopy: string;
}
export const CopyPopup = async (props: ICopyPopupProps): Promise<any> => {

    const firstSwalPromise = Swal.fire({
        title: props.title,
        text: props.description,
        showCancelButton: true,
        confirmButtonText: 'Copy',
    });

    const { isConfirmed } = await firstSwalPromise;

    if (isConfirmed) {
        navigator?.clipboard?.writeText?.(props.textToCopy);
    }
}

// export interface IStringInputPopupProps {
//     title: string;
//     input: SweetAlertInput | undefined;
//     inputValue?: string;
//     focusOnInput?: boolean;
// }
// export const stringInputPopup = async (props: IStringInputPopupProps): Promise<string> => {

//     const firstSwalPromise = Swal.fire({
//         title: props.title,
//         input: props.input,
//         inputValue: props.inputValue ?? '',
//         showCancelButton: true,
//         inputAttributes: props.focusOnInput !== true ? undefined : {
//             autofocus: 'true'
//         }
//     });

//     if (props.focusOnInput) {
//         await timeout(300);
//         let queryStr = 'input.swal2-input';
//         if (props.input == 'textarea') queryStr = 'textarea.swal2-textarea';
//         const swalInput: any = document.querySelector(queryStr);
//         swalInput?.focus?.();
//     }
//     const { value } = await firstSwalPromise;

//     return value;
// }
