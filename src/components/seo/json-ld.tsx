export function JsonLd({ data }: { data: Record<string, unknown> | null }) {
  if (!data) return null

  return (
    <script
      type="application/ld+json"
      // Content here is admin-editable and lands inside a <script> tag. Escaping
      // "<" stops a literal "</script>" in, say, a project title from closing
      // the tag and breaking out into executable markup. Not theoretical — it is
      // the standard JSON-LD injection hole.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
