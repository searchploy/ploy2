'use client'

/**
 * Billing History Dashboard
 *
 * Shows all past report purchases, invoices, and billing activity.
 * Displays payment status, amounts, and download links for receipts.
 */

import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Download, Eye } from 'lucide-react'

interface BillingRecord {
  id: string
  type: 'report_purchase' | 'subscription' | 'refund'
  description: string
  amount: number
  status: 'succeeded' | 'pending' | 'failed' | 'refunded'
  date: string
  reportId?: string
  receiptUrl?: string
  chargeId?: string
}

interface BillingHistoryDashboardProps {
  records: BillingRecord[]
  isLoading?: boolean
}

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getStatusBadge(status: BillingRecord['status']) {
  const variants: Record<BillingRecord['status'], { badge: string; text: string }> = {
    succeeded: { badge: 'bg-green-500/20 text-green-300 border-green-500/30', text: 'Paid' },
    pending: { badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', text: 'Pending' },
    failed: { badge: 'bg-red-500/20 text-red-300 border-red-500/30', text: 'Failed' },
    refunded: { badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30', text: 'Refunded' },
  }
  const v = variants[status]
  return <Badge className={`border ${v.badge}`}>{v.text}</Badge>
}

function getTypeIcon(type: BillingRecord['type']) {
  switch (type) {
    case 'report_purchase':
      return '📊'
    case 'subscription':
      return '🔄'
    case 'refund':
      return '↩️'
    default:
      return '💳'
  }
}

export function BillingHistoryDashboard({ records, isLoading = false }: BillingHistoryDashboardProps) {
  const grouped = useMemo(() => {
    // Group by date
    const map = new Map<string, BillingRecord[]>()
    records.forEach((record) => {
      const month = new Date(record.date).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
      if (!map.has(month)) map.set(month, [])
      map.get(month)!.push(record)
    })
    return Array.from(map.entries()).reverse() // Most recent first
  }, [records])

  const stats = useMemo(
    () => ({
      totalSpent: records
        .filter((r) => r.status === 'succeeded')
        .reduce((sum, r) => sum + r.amount, 0),
      reportsPurchased: records.filter((r) => r.type === 'report_purchase' && r.status === 'succeeded')
        .length,
      pendingCharges: records.filter((r) => r.status === 'pending').length,
    }),
    [records]
  )

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
            <p className="text-3xl font-bold">{formatCurrency(stats.totalSpent)}</p>
            <p className="text-xs text-muted-foreground">on paid reports</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Reports Purchased</p>
            <p className="text-3xl font-bold">{stats.reportsPurchased}</p>
            <p className="text-xs text-muted-foreground">unlocked reports</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Pending</p>
            <p className="text-3xl font-bold">{stats.pendingCharges}</p>
            <p className="text-xs text-muted-foreground">awaiting payment</p>
          </div>
        </Card>
      </div>

      {/* Billing History */}
      <Card className="overflow-hidden">
        <div className="border-b border-border/50 p-6">
          <h3 className="font-semibold">Transaction History</h3>
          <p className="mt-1 text-sm text-muted-foreground">All your purchases and invoices</p>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading transactions...</div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No transactions yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Purchase a report to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grouped.map(([month, monthRecords]) => (
                  <div key={month}>
                    {/* Month Header */}
                    <TableRow className="bg-secondary/30 hover:bg-secondary/30">
                      <TableCell colSpan={5} className="py-3 text-sm font-medium text-muted-foreground">
                        {month}
                      </TableCell>
                    </TableRow>

                    {/* Records */}
                    {monthRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="whitespace-nowrap text-sm">
                          {formatDate(record.date)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{getTypeIcon(record.type)}</span>
                            <span className="text-sm">{record.description}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{formatCurrency(record.amount)}</span>
                        </TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {record.reportId && (
                              <Button asChild variant="ghost" size="sm">
                                <a href={`/dashboard/business/reports/${record.reportId}`}>
                                  <Eye className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                            {record.receiptUrl && (
                              <Button asChild variant="ghost" size="sm">
                                <a href={record.receiptUrl} target="_blank" rel="noopener noreferrer">
                                  <Download className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                            {record.status === 'refunded' && (
                              <span className="text-xs text-muted-foreground">Refunded</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </div>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  )
}
