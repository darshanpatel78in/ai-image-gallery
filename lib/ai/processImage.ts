import { getVisionClient } from "./visionClient";
import { rgbToHex } from "../utils/rgbToHex";
import { descriptionFromLabels } from "../utils/descriptionFromLabels";
import type { protos } from "@google-cloud/vision";

export interface ProcessedImageMetadata {
  tags: string[];
  description: string;
  colors: string[];
}

export async function processImageFromUrl(
  imageUrl: string
): Promise<ProcessedImageMetadata> {
  const client = getVisionClient();

  const [labelResult] = await client.labelDetection(imageUrl);
  const [propsResult] = await client.imageProperties(imageUrl);

  const labels = (labelResult.labelAnnotations ?? [])
    .filter(
      (l: protos.google.cloud.vision.v1.EntityAnnotation) => !!l.description
    )
    .sort(
      (
        a: protos.google.cloud.vision.v1.EntityAnnotation,
        b: protos.google.cloud.vision.v1.EntityAnnotation
      ) => (b.score ?? 0) - (a.score ?? 0)
    )
    .slice(0, 10)
    .map(
      (l: protos.google.cloud.vision.v1.EntityAnnotation) =>
        l.description as string
    );

  const tags = labels.map((l) => l.toLowerCase());

  const colors = (
    propsResult.imagePropertiesAnnotation?.dominantColors?.colors ?? []
  )
    .sort(
      (
        a: protos.google.cloud.vision.v1.ColorInfo,
        b: protos.google.cloud.vision.v1.ColorInfo
      ) => (b.pixelFraction ?? 0) - (a.pixelFraction ?? 0)
    )
    .slice(0, 3)
    .map((c: protos.google.cloud.vision.v1.ColorInfo) => {
      const rgb = c.color! as protos.google.type.Color;
      return rgbToHex(rgb.red ?? 0, rgb.green ?? 0, rgb.blue ?? 0);
    });

  const description = descriptionFromLabels(labels);

  return { tags, description, colors };
}
