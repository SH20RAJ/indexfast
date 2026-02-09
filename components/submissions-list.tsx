'use client'

import { useState } from 'react'
import { CreativeCard } from '@/components/ui/creative-card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

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
    <CreativeCard className="col-span-1 md:col-span-2 lg:col-span-3">
        <div className="mb-6">
            <h2 className="font-handwritten text-2xl font-bold">Recent Submissions</h2>
            <p className="text-muted-foreground">URLs submitted to IndexNow recently.</p>
        </div>
      
        {submissions.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed rounded-lg border-muted">
                <p className="text-muted-foreground text-sm font-handwritten text-xl">No submissions yet. Sync a site to get started.</p>
            </div>
        ) : (
            <div className="rounded-md border">
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
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold border ${
                            item.status === 200 
                            ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                            : 'bg-red-500/10 text-red-600 border-red-500/20'
                        }`}>
                            {item.status}
                        </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                        {new Date(item.submitted_at).toLocaleString()}
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
            </div>
        )}
    </CreativeCard>
  )
}
