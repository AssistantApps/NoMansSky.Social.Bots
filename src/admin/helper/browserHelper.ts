export const copyTextToClipboard = (textToCopy: string) =>
    navigator?.clipboard?.writeText?.(textToCopy);