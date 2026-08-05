import 'server-only'

import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

/**
 * Markdown -> HTML, run at WRITE time in the admin's Server Action, never at
 * read time.
 *
 * Projects store both body_md (the editable source) and body_html (derived).
 * The consequence is that the public bundle ships zero markdown JavaScript and
 * the public runtime does zero parsing — a case study page is just
 * dangerouslySetInnerHTML over pre-rendered HTML.
 *
 * Sanitising is not strictly necessary when the only author is the site owner,
 * but it is free, and it means a paste from an untrusted source can't become
 * stored XSS on the site's own origin.
 */
export async function renderMarkdown(md: string): Promise<string> {
  if (!md.trim()) return ''

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(md)

  return String(file)
}
