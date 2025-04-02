export function getPostImage(path: string | null = null): string {
  return path?.length === 0 || path?.indexOf("via") !== -1
    ? "/image_not_found.webp"
    : path;
}
