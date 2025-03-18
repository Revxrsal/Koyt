export function convertToEmbedUrl(youtubeUrl: string): string {
  const url = new URL(youtubeUrl);

  // Extract the video ID from the URL
  let videoId = "";

  if (url.hostname === "youtu.be") {
    videoId = url.pathname.slice(1);
  } else if (url.hostname.includes("youtube.com")) {
    videoId = url.searchParams.get("v") || "";
  }

  if (!videoId) {
    throw new Error("Invalid YouTube URL");
  }

  // Build the embed URL
  return embed(videoId);
}

export function embed(videoId: string): string {
  // Build the embed URL
  const embedBase = `https://www.youtube.com/embed/${videoId}`;
  const params = new URLSearchParams({
    origin: "https://plyr.io",
    iv_load_policy: "3",
    controls: "0",
    modestbranding: "1",
    color: "red",
    playsinline: "1",
    showinfo: "0",
    rel: "0",
    enablejsapi: "1"
  });

  return `${embedBase}?${params.toString()}`;
}

// Example usage
// Output: https://www.youtube.com/embed/3Em_ixbHYBQ?origin=https%3A%2F%2Fplyr.io&iv_load_policy=3&modestbranding=1&playsinline=1&showinfo=0&rel=0&enablejsapi=1
