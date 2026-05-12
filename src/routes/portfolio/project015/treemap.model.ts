export interface TreeMapNode {
  name: string;
  category: string;
  value: number;
  children?: TreeMapNode[];
}

export const getTreemapCategories = (data: TreeMapNode) =>
  Array.from(new Set(data.children?.map((node) => node.name) ?? []));

export const getTreemapDimensions = (
  measuredWidth: number,
  minWidth: number,
  minHeight: number,
  heightRatio: number,
) => {
  const width = Math.max(minWidth, measuredWidth);
  return {
    width,
    height: Math.max(minHeight, Math.round(width * heightRatio)),
  };
};
