const hasChildren = (tree) =>
  tree.items && Array.isArray(tree.items) && tree.items.length > 0;

export const printTree = (tree, lvl = 0) => {
  let res = tree.name;
  if (hasChildren(tree)) {
    const isLast = (index) => index === tree.items.length - 1;
    res = tree.items.reduce((acc, item, index) => {
      return `${acc}\n${lvl > 0 ? `│${" ".repeat(lvl)}` : ""}${
        isLast(index) && !hasChildren(item) ? "└" : "├"
      }── ${printTree(item, lvl + 1)}`;
    }, res);
  }

  return res;
};
