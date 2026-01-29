/**
 * Image loading debug utility
 * Helps diagnose image loading issues
 */

export const debugImageLoading = (url) => {
  if (!url) {
    console.warn('❌ No URL provided for image');
    return false;
  }

  const img = new Image();
  
  img.onload = () => {
    console.log(`✅ Image loaded: ${url}`);
  };
  
  img.onerror = () => {
    console.error(`❌ Image failed: ${url}`);
  };
  
  img.onabort = () => {
    console.warn(`⚠️ Image aborted: ${url}`);
  };
  
  img.src = url;
  
  return true;
};

/**
 * Test all images on the page
 */
export const testPageImages = () => {
  const images = document.querySelectorAll('img');
  console.log(`Testing ${images.length} images on page...`);
  
  images.forEach((img, index) => {
    if (!img.src) {
      console.warn(`Image ${index} has no src`);
    } else {
      console.log(`Image ${index}: ${img.src}`);
    }
  });
};

/**
 * Get image load status
 */
export const getImageStatus = () => {
  const images = document.querySelectorAll('img');
  const statuses = {
    total: images.length,
    loaded: 0,
    failed: 0,
    pending: 0,
  };
  
  images.forEach((img) => {
    if (img.complete) {
      if (img.naturalHeight === 0) {
        statuses.failed++;
      } else {
        statuses.loaded++;
      }
    } else {
      statuses.pending++;
    }
  });
  
  return statuses;
};
