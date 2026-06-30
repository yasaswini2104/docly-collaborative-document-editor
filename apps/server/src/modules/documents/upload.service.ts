import z from 'zod';

// Basic validation for the TipTap JSON structure
export const tipTapNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    type: z.string(),
    attrs: z.record(z.string(), z.any()).optional(),
    content: z.array(tipTapNodeSchema).optional(),
    marks: z
      .array(
        z.object({
          type: z.string(),
          attrs: z.record(z.string(), z.any()).optional(),
        })
      )
      .optional(),
    text: z.string().optional(),
  })
);

export const tipTapDocumentSchema = z.object({
  type: z.literal('doc'),
  content: z.array(tipTapNodeSchema).optional(),
});

/**
 * Super basic text/markdown to TipTap JSON converter.
 * Splits by double newlines into paragraphs.
 * Very basic heading support for `# `, `## `, `### `.
 */
export function parseTextToTipTapJSON(text: string) {
  const blocks = text.split(/\n\s*\n/);
  
  const content = blocks.map((block) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // Basic heading detection
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)/);
    if (headingMatch) {
      return {
        type: 'heading',
        attrs: { level: headingMatch[1]?.length ?? 1 },
        content: [{ type: 'text', text: headingMatch[2] }],
      };
    }

    // Default to paragraph
    return {
      type: 'paragraph',
      content: [{ type: 'text', text: trimmed }],
    };
  }).filter(Boolean);

  return {
    type: 'doc',
    content: content.length > 0 ? content : [{ type: 'paragraph' }],
  };
}
