/**
 * Maps TMDB provider IDs to streaming platform information
 * Used for displaying OTT provider icons and names
 */

export const PROVIDER_MAP = {
  8: { 
    name: "Netflix", 
    icon: "/assets/providers/netflix.png",
    fallbackIcon: "/assets/providers/netflix.svg",
    priority: 1
  },
  9: { 
    name: "Prime Video", 
    icon: "/assets/providers/prime.png",
    fallbackIcon: "/assets/providers/prime.svg",
    priority: 2
  },
  119: { 
    name: "Disney+", 
    icon: "/assets/providers/disney.png",
    fallbackIcon: "/assets/providers/disney.svg",
    priority: 3
  },
  122: { 
    name: "Hotstar", 
    icon: "/assets/providers/hotstar.png",
    fallbackIcon: "/assets/providers/hotstar.svg",
    priority: 4
  },
  15: { 
    name: "Hulu", 
    icon: "/assets/providers/hulu.png",
    fallbackIcon: "/assets/providers/default.svg",
    priority: 5
  },
  337: { 
    name: "Disney+ Hotstar", 
    icon: "/assets/providers/hotstar.png",
    fallbackIcon: "/assets/providers/hotstar.svg",
    priority: 6
  },
  350: { 
    name: "Zee5", 
    icon: "/assets/providers/zee5.png",
    fallbackIcon: "/assets/providers/default.svg",
    priority: 7
  },
  384: { 
    name: "SonyLiv", 
    icon: "/assets/providers/sonyliv.png",
    fallbackIcon: "/assets/providers/default.svg",
    priority: 8
  },
  2: {
    name: "Apple TV",
    icon: "/assets/providers/appletv.png",
    fallbackIcon: "/assets/providers/apple-tv.svg",
    priority: 9
  },
  10: {
    name: "HBO Max",
    icon: "/assets/providers/hbomax.png",
    fallbackIcon: "/assets/providers/default.svg",
    priority: 10
  },
};

/**
 * Get provider information by TMDB provider ID
 * @param {number} providerId - TMDB provider ID
 * @returns {object} - { name, icon, priority } or fallback object
 */
export function getProviderInfo(providerId) {
  if (!providerId) {
    return { 
      name: "Unknown Provider", 
      icon: "/assets/providers/default.png",
      fallbackIcon: "/assets/providers/default.svg",
      priority: 999
    };
  }
  
  const provider = PROVIDER_MAP[providerId];
  
  if (provider) {
    return provider;
  }
  
  // Return fallback for unknown provider
  return { 
    name: `Provider ${providerId}`,
    icon: "/assets/providers/default.png",
    fallbackIcon: "/assets/providers/default.svg",
    priority: 999
  };
}

/**
 * Sort providers by priority and return top N
 * @param {array} providers - Array of provider objects from TMDB
 * @param {number} limit - Max providers to return (default 4)
 * @returns {array} - Sorted and limited provider array
 */
export function getSortedProviders(providers, limit = 4) {
  if (!providers || !Array.isArray(providers)) {
    return [];
  }
  
  return providers
    .map(p => ({
      ...p,
      ...getProviderInfo(p.provider_id),
    }))
    .sort((a, b) => (a.priority || 999) - (b.priority || 999))
    .slice(0, limit);
}

export default PROVIDER_MAP;

