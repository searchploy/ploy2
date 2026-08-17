/**
 * Stripe Checkout Session API
 *
 * Creates a checkout session and returns the session URL.
 * This is an alternative to using the server action directly.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerUser } from '@/lib/supabase/server'
import { createCheckoutSession } from '@/app/actions/stripe'

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { subscriptionType, interval } = await request.json()

    if (!subscriptionType || !interval) {
      return NextResponse.json(
        { error: 'Missing subscriptionType or interval' },
        { status: 400 }
      )
    }

    if (!['business', 'consultant', 'agency'].includes(subscriptionType)) {
      return NextResponse.json(
        { error: 'Invalid subscription type' },
        { status: 400 }
      )
    }

    if (!['month', 'year'].includes(interval)) {
      return NextResponse.json(
        { error: 'Invalid interval' },
        { status: 400 }
      )
    }

    // Create checkout session
    const result = await createCheckoutSession(subscriptionType, interval)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      sessionId: result.sessionId,
      clientSecret: result.clientSecret,
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create checkout session',
      },
      { status: 500 }
    )
  }
}
