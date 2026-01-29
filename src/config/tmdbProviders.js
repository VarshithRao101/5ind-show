export const PROVIDER_LOGO_BASE = "https://image.tmdb.org/t/p/";
export const PROVIDER_LOGO_SIZE = "w92";

export const getProviderLogo = (logoPath) => {
    if (!logoPath) return null;
    return `${PROVIDER_LOGO_BASE}${PROVIDER_LOGO_SIZE}${logoPath}`;
};
