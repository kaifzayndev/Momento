/**
 * Safely downloads an image by fetching its blob and triggering an anchor download,
 * with fallback to opening/direct linking if fetch fails.
 *
 * @param {string} imageUrl - The image source URL
 * @param {string} title - The title used for naming the downloaded file
 * @returns {Promise<boolean>}
 */
export async function downloadImage(imageUrl, title = "photo") {
  if (!imageUrl) return false;

  const sanitizedName = title
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const fileName = `${sanitizedName || "photo"}.jpg`;

  try {
    const response = await fetch(imageUrl, {
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    }, 150);

    return true;
  } catch (error) {
    console.warn("Blob download failed or blocked by CORS, falling back to direct link", error);

    // Fallback: trigger direct download attribute or open link
    const fallbackLink = document.createElement("a");
    fallbackLink.href = imageUrl;
    fallbackLink.target = "_blank";
    fallbackLink.rel = "noopener noreferrer";
    fallbackLink.download = fileName;
    document.body.appendChild(fallbackLink);
    fallbackLink.click();

    setTimeout(() => {
      document.body.removeChild(fallbackLink);
    }, 150);

    return true;
  }
}

