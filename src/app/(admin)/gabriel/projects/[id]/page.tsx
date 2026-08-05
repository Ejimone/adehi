import { notFound } from 'next/navigation'

import { PageHead } from '@/components/admin/ui'
import { adminGetProject } from '@/lib/queries/admin'

import { ProjectForm } from '../project-form'

export const dynamic = 'force-dynamic'

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await adminGetProject(id)
  if (!project) notFound()

  return (
    <>
      <PageHead title={project.title} />
      <ProjectForm project={project} />
    </>
  )
}
