'use client'

/**
 * Report Download Section
 *
 * Shows download and export options for purchased reports.
 * Only visible if report.is_paid === true.
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FileDown, Share2, Loader2, CheckCircle2 } from 'lucide-react'

interface ReportDownloadSectionProps {
  reportId: string
  businessName?: string
  isPaid: boolean
}

export function ReportDownloadSection({
  reportId,
  businessName = 'Report',
  isPaid,
}: ReportDownloadSectionProps) {
  const [loading, setLoading] = useState<'pdf' | 'csv' | null>(null)
  const [copied, setCopied] = useState(false)

  if (!isPaid) {
    return null
  }

  const handleDownloadPDF = async () => {
    setLoading('pdf')
    try {
      // Use browser's print-to-PDF functionality
      window.print()
    } catch (err) {
      console.error('Error downloading PDF:', err)
    } finally {
      setLoading(null)
    }
  }

  const handleDownloadCSV = async () => {
    setLoading('csv')
    try {
      // In production, this would fetch CSV data from API
      // For now, show success state
      const csvUrl = `/api/reports/${reportId}/csv`
      window.location.href = csvUrl
    } catch (err) {
      console.error('Error downloading CSV:', err)
    } finally {
      setLoading(null)
    }
  }

  const handleShareReport = async () => {
    const shareUrl = `${window.location.origin}/report/${reportId}`
    const shareText = `Check out my AI Workforce Report for ${businessName} on Ploy`

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'AI Workforce Report',
          text: shareText,
          url: shareUrl,
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (err) {
      console.error('Error sharing:', err)
    }
  }

  return (
    <Card className="border-ploy-gold/20 bg-ploy-gold/5 p-6">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Report Unlocked
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Download your full report and share with your team
          </p>
        </div>

        {/* Download Options */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Download PDF */}
          <Button
            onClick={handleDownloadPDF}
            disabled={loading === 'pdf'}
            variant="outline"
            className="gap-2"
            size="sm"
          >
            {loading === 'pdf' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Preparing...
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>

          {/* Download CSV */}
          <Button
            onClick={handleDownloadCSV}
            disabled={loading === 'csv'}
            variant="outline"
            className="gap-2"
            size="sm"
          >
            {loading === 'csv' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Preparing...
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4" />
                Download CSV
              </>
            )}
          </Button>

          {/* Share Report */}
          <Button
            onClick={handleShareReport}
            variant="outline"
            className="gap-2"
            size="sm"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                Share Report
              </>
            )}
          </Button>
        </div>

        {/* Info */}
        <div className="rounded-lg border border-border/50 bg-secondary/30 p-3 text-xs text-muted-foreground">
          <p>
            💡 <strong>Tip:</strong> Share this report with your team to align on AI adoption strategy and
            implementation roadmap.
          </p>
        </div>
      </div>
    </Card>
  )
}
