import type { MetadataRoute } from "next";
import { YUGA, COLLEGE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${YUGA.name} · ${COLLEGE.name} — College Union`,
    short_name: `${YUGA.name} CMC`,
    description: YUGA.description,
    start_url: "/",
    display: "standalone",
    background_color: "#07080a",
    theme_color: "#059669",
    icons: [
      {
        src: "/yuga-logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/yuga-logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
