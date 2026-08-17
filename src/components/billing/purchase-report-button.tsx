'use client'

/**
 * Purchase Report Button
 *
 * One-time $39 charge to unlock full AI report features.
 * Shows loading state, error handling, and success feedback.
 */

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react'
import { purchaseReportAction } from '@/app/actions/stripe'

interface PurchaseReportButtonProps {
  reportId: string
  businessName?: string
  onSuccess?: () => void
  className?: string
}

export function PurchaseReportButton({
  reportId,
  businessName = 'Report',
  onSuccess,
  className,
}: PurchaseReportButtonProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handlePurchase = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await purchaseReportAction(reportId)

      if (result.error) {
        // If user is not authenticated, redirect to sign-up with business role
        if (result.error === 'User not authenticated') {
          router.push(`/sign-up?role=business&redirect=${encodeURIComponent(pathname)}`)
          return
        }
        setError(result.error)
        setLoading(false)
        return
      }

      if (result.success) {
        setSuccess(true)
        // Wait a moment to show success state, then reload
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process payment')
      setLoading(false)
    }
  }

  // Success state
  if (success) {
    return (
      <div className={`flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4 ${className}`}>
        <CheckCircle2 className="h-5 w-5 text-green-500" />
        <div>
          <p className="font-medium text-green-500">Payment Successful!</p>
          <p className="text-sm text-green-400">Your report is being unlocked...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
          <div>
            <p className="font-medium text-red-500">Payment Failed</p>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        </div>
        <Button
          onClick={handlePurchase}
          disabled={loading}
          size="lg"
          className={`w-full bg-ploy-blue hover:bg-ploy-blue/90 ${className}`}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Try Again'
          )}
        </Button>
      </div>
    )
  }

  // Normal state
  return (
    <Button
      onClick={handlePurchase}
      disabled={loading}
      size="lg"
      className={`w-full bg-ploy-blue hover:bg-ploy-blue/90 ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing Payment...
        </>
      ) : (
        <>
          <span className="text-lg">🔓</span>
          <span className="ml-2">Unlock Full Report</span>
          <span className="ml-auto font-semibold">$39</span>
        </>
      )}
    </Button>
  )
}
