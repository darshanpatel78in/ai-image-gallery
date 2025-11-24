export function descriptionFromLabels(labels: string[]): string {
  const top = labels.slice(0, 3);
  if (top.length === 0) return "";
  if (top.length === 1) return `An image of ${top[0].toLowerCase()}.`;
  if (top.length === 2)
    return `An image featuring ${top[0].toLowerCase()} and ${top[1].toLowerCase()}.`;
  return `An image featuring ${top[0].toLowerCase()}, ${top[1].toLowerCase()}, and ${top[2].toLowerCase()}.`;
}
