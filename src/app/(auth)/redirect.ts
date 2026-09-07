/**
 * `?redirect=` comes from the URL, so only same-origin absolute paths are allowed
 * through — anything else (`//evil.com`, `https://…`) falls back to the home page.
 */
export function safeRedirectPath(value: string | string[] | undefined): string {
    const path = Array.isArray(value) ? value[0] : value;

    if (!path || !path.startsWith("/") || path.startsWith("//")) {
        return "/";
    }

    return path;
}
