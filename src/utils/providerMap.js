/**
 * Maps TMDB provider IDs to streaming platform information
 * Used for displaying OTT provider icons and names
 */

export const PROVIDER_ICONS = {
  8: { name: "Netflix", icon: "/assets/providers/netflix.svg" },
  119: { name: "Prime Video", icon: "/assets/providers/prime.svg" },
  337: { name: "Hotstar", icon: "/assets/providers/hotstar.svg" },
  2: { name: "Apple TV", icon: "/assets/providers/apple-tv.svg" },
  3: { name: "Google Play", icon: "/assets/providers/googleplay.svg" },
  192: { name: "YouTube", icon: "/assets/providers/youtube.svg" },
  384: { name: "Disney+", icon: "/assets/providers/disney.svg" },
  179: { name: "JioCinema", icon: "/assets/providers/jiocinema.svg" }
};

/**
 * Get provider information by TMDB provider ID
 * @param {number} providerId - TMDB provider ID
 * @param {string} providerName - Provider name from TMDB API (fallback)
 * @returns {object} - { name, icon }
 */
export function getProviderInfo(providerId, providerName = "Unknown") {
  const provider = PROVIDER_ICONS[providerId];
  
  if (provider) {
    return provider;
  }
  
  // Return fallback for unknown provider
  return {
    name: providerName || "Unavailable",
    icon: "/assets/providers/default.svg"
  };
}

export default PROVIDER_ICONS;
