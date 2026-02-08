
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, Plus, Check } from 'lucide-react'

interface Site {
  siteUrl: string
  permissionLevel: string
}

export default function SitesManager() {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGSCSites() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.provider_token) {
        // If no provider token, maybe re-login or handle error
        return
      }

      try {
        const response = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
          headers: {
            Authorization: `Bearer ${session.provider_token}`,
          },
        })
        const data = await response.json()
        if (data.siteEntry) {
          setSites(data.siteEntry)
        }
      } catch (error) {
        console.error('Failed to fetch sites', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGSCSites()
  }, [])

  const handleImport = async (siteUrl: string) => {
    setImporting(siteUrl)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase
      .from('sites')
      .upsert({
        user_id: user.id,
        domain: siteUrl,
        gsc_site_url: siteUrl,
        permission_level: 'siteOwner' 
      })
      .select()

    if (error) {
       console.error('Error importing site', error)
    } else {
       // Ideally show toast
    }
    setImporting(null)
  }

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sites.map((site) => (
        <Card key={site.siteUrl}>
          <CardHeader>
            <CardTitle className="truncate text-base" title={site.siteUrl}>
              {site.siteUrl.replace('sc-domain:', '')}
            </CardTitle>
            <CardDescription>{site.permissionLevel}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleImport(site.siteUrl)}
              disabled={importing === site.siteUrl}
            >
              {importing === site.siteUrl ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {importing === site.siteUrl ? 'Importing...' : 'Import Site'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
