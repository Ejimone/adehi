import { MediaUpload } from '@/components/admin/media-upload'
import { PageHead } from '@/components/admin/ui'
import { adminGetSettings } from '@/lib/queries/admin'

import { SettingsForm } from './settings-form'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const settings = await adminGetSettings()

  return (
    <>
      <PageHead title="Settings" />
      <div className="mb-10 max-w-3xl">
        <MediaUpload />
      </div>
      <SettingsForm settings={settings} />
    </>
  )
}
