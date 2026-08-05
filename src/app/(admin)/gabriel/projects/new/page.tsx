import { PageHead } from '@/components/admin/ui'

import { ProjectForm } from '../project-form'

export const dynamic = 'force-dynamic'

export default function NewProjectPage() {
  return (
    <>
      <PageHead title="New project" />
      <ProjectForm project={null} />
    </>
  )
}
