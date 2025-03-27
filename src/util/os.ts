// noinspection JSDeprecatedSymbols

function getUserOS() {
    const platform = window.navigator.platform;
    const userAgent = window.navigator.userAgent

    if (platform.startsWith('Win')) {
        return 'Windows';
    } else if (platform.startsWith('Mac')) {
        return 'MacOS';
    } else if (platform.includes('Linux')) {
        return 'Linux';
    } else if (platform.includes('iPhone') || platform.includes('iPad') || platform.includes('iPod')) {
        return 'iOS';
    } else if (userAgent.includes('Android')) {
        return 'Android';
    } else {
        return 'Unknown';
    }
}

export const UserOS = getUserOS()
