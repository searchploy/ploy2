'use client'

/**
 * Refund Request Dialog
 *
 * Allows users to request a refund for a purchased report.
 * Shows refund status, reason selection, and handling.
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react'

interface RefundRequestDialogProps {
  amount: number
  onRefundSuccess?: () => void
}

type RefundReason = 'not_useful' | 'duplicate' | 'incorrect_data' | 'other'

const REFUND_REASONS: Record<RefundReason, string> = {
  not_useful: 'Report was not useful for my business',
  duplicate: 'I already purchased this report',
  incorrect_data: 'Report contains incorrect data',
  other: 'Other reason',
}

export function RefundRequestDialog({
  amount,
  onRefundSuccess,
}: RefundRequestDialogProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<RefundReason | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmitRefund = async () => {
    if (!reason) {
      setErrorMessage('Please select a reason for refund')
      return
    }

    setLoading(true)
    setErrorMessage(null)

    try {
      // In production, this would call a server action
      // For now, simulate success
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setStatus('success')
      setTimeout(() => {
        setOpen(false)
        setStatus('idle')
        setReason(null)
        setMessage('')
        onRefundSuccess?.()
      }, 2000)
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Failed to process refund request')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!loading) {
      setOpen(newOpen)
      if (!newOpen) {
        setStatus('idle')
        setErrorMessage(null)
      }
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={() => setOpen(true)}
      >
        <RotateCcw className="h-4 w-4" />
        Request Refund
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Refund</DialogTitle>
            <DialogDescription>
              We&apos;re sorry to hear you want to refund this report. Please let us know why so we can
              improve.
            </DialogDescription>
          </DialogHeader>

          {status === 'success' ? (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-green-500">Refund Requested</p>
                  <p className="text-sm text-green-400">
                    We&apos;ll process your refund of ${(amount / 100).toFixed(2)} within 5-10 business days.
                  </p>
                </div>
              </div>
            </div>
          ) : status === 'error' ? (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-xs text-red-700">{errorMessage}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {/* Refund Amount */}
              <div className="rounded-lg bg-secondary/50 p-4">
                <p className="text-sm text-muted-foreground">Refund Amount</p>
                <p className="text-2xl font-bold">${(amount / 100).toFixed(2)}</p>
              </div>

              {/* Reason Selection */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Reason for Refund</p>
                <div className="space-y-2">
                  {(Object.entries(REFUND_REASONS) as [RefundReason, string][]).map(([value, label]) => (
                    <label key={value} className="flex items-center gap-3 rounded-lg p-3 hover:bg-secondary/50">
                      <input
                        type="radio"
                        name="refund-reason"
                        value={value}
                        checked={reason === value}
                        onChange={(e) => setReason(e.target.value as RefundReason)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Details */}
              {reason === 'other' && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Please tell us more</p>
                  <Textarea
                    placeholder="Help us understand why you'd like to refund this report..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-20 resize-none"
                  />
                </div>
              )}

              {/* Warning */}
              <div className="flex items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <p className="text-xs text-yellow-700">
                  Refunds are processed within 5-10 business days to your original payment method.
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <p className="text-xs text-red-700">{errorMessage}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 justify-end mt-6">
            {status === 'success' ? (
              <Button onClick={() => setOpen(false)}>Close</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
                <Button
                  onClick={handleSubmitRefund}
                  disabled={loading || !reason}
                  className="gap-2 bg-destructive hover:bg-destructive/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Request Refund'
                  )}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
