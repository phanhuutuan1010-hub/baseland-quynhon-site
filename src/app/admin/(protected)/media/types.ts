export type MediaItem = {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  kind: "IMAGE" | "VIDEO" | "DOCUMENT";
  titleVi: string;
  titleEn: string;
  altVi: string;
  altEn: string;
  captionVi: string;
  captionEn: string;
  focalX: number;
  focalY: number;
  requireLeadForDownload: boolean;
  createdAt: string;
};
