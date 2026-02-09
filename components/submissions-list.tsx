'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface Submission {
  id: string
  url: string
  status: number
  submitted_at: string
  sites: {
    domain: string
  }
}

export default function SubmissionsList({ initialSubmissions }: { initialSubmissions: any[] }) {
  const [submissions] = useState<Submission[]>(initialSubmissions || [])

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>Recent Submissions</CardTitle>
        <CardDescription>URLs submitted to IndexNow recently.</CardDescription>
      </CardHeader>
      <CardContent>
        {submissions.length === 0 ? (
            <p className="text-muted-foreground text-sm">No submissions yet. Sync a site to get started.</p>
        ) : (
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>URL</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[150px]">Time</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {submissions.map((item) => (
                <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs truncate max-w-[300px]" title={item.url}>
                        {item.url}
                        <div className="text-[10px] text-muted-foreground">{item.sites?.domain}</div>
                    </TableCell>
                    <TableCell>
                        <Badge variant={item.status === 200 ? 'default' : 'destructive'} className={item.status === 200 ? 'bg-green-600 hover:bg-green-700' : ''}>
                            {item.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                        {new Date(item.submitted_at).toLocaleString()}
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        )}
      </CardContent>
    </Card>
  )
}
