import { notificationService } from "@hope-ui/solid";

export const copyTextToClipboard = (textToCopy: string) => {
    try {
        navigator?.clipboard?.writeText?.(textToCopy);
        notificationService.clear();
        notificationService.show({
            status: "info",
            title: 'Copied!',
            description: textToCopy,
        })
    } catch {

    }
}