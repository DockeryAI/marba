/**
 * Design Studio Page
 * Full-screen visual content creation workspace
 */

import * as React from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { DesignStudio } from '@/components/design-studio/DesignStudio'

export const DesignStudioPage: React.FC = () => {
  const { contentId } = useParams<{ contentId?: string }>()
  const location = useLocation()

  // Get content data if passed via navigation state
  const contentData = location.state?.content

  // TODO: Load content from Supabase if contentId provided
  // For now, pass through what we have
  const initialContent = contentId ? contentData : undefined

  return (
    <AppLayout showBreadcrumbs={false} showFooter={false} fullWidth={true}>
      <DesignStudio initialContent={initialContent} />
    </AppLayout>
  )
}
