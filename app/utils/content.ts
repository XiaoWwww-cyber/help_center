export function extractTextFromAst(node: any): string {
  if (!node) return '';
  
  if (typeof node === 'string') return node;
  
  if (node.value) return node.value;
  
  if (node.children && Array.isArray(node.children)) {
    return node.children.map((child: any) => extractTextFromAst(child)).join(' ');
  }
  
  return '';
}
