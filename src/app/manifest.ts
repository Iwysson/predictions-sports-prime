import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Predictions Sports Prime",
    short_name: "PSP",
    description:
      "Football predictions, fixtures, standings and manually written match analysis.",
    start_url: "/",
    display: "standalone",
    background_color: "#071019",
    theme_color: "#071019",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
