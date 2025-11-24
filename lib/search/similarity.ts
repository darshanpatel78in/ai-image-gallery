export function jaccardSimilarity(a: string[], b: string[]): number {
  const setA = new Set(a.map((v) => v.toLowerCase()));
  const setB = new Set(b.map((v) => v.toLowerCase()));
  const intersection = new Set([...setA].filter((v) => setB.has(v)));
  const union = new Set([...setA, ...setB]);
  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

export function colorSimilarity(a: string[], b: string[]): number {
  // Simple overlap ratio
  return jaccardSimilarity(a, b);
}

export function overallSimilarity(
  tagsA: string[],
  tagsB: string[],
  colorsA: string[],
  colorsB: string[]
): number {
  const tagScore = jaccardSimilarity(tagsA, tagsB);
  const colorScore = colorSimilarity(colorsA, colorsB);
  return 0.7 * tagScore + 0.3 * colorScore;
}
