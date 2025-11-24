This folder contains Google Cloud Vision helpers used by the AI Image Gallery.

- `visionClient.ts` creates a singleton ImageAnnotatorClient using the `VISION_CREDENTIALS_JSON` env var.
- `processImage.ts` calls label detection and image properties to produce tags, description, and colors.
