/**
 * Stripe Invoices Management
 *
 * Handle invoice creation, retrieval, and tracking.
 * Sync invoice data to database for user dashboards.
 */

import { stripe } from './index'
import { createClient } from '@/lib/supabase/server'

export interface InvoiceData {
  stripe_invoice_id: string
  profile_id: string
  subscription_id?: string
  amount_cents: number
  amount_paid_cents: number
  currency: string
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void'
  invoice_date: string
  due_date: string
  paid_at?: string
  pdf_url?: string
  hosted_invoice_url?: string
  description?: string
  metadata?: Record<string, any>
}

/**
 * Sync invoice from Stripe to our database
 */
export async function syncInvoiceToDatabase(
  stripeInvoice: any,
  profileId: string
): Promise<void> {
  const invoiceData: InvoiceData = {
    stripe_invoice_id: stripeInvoice.id,
    profile_id: profileId,
    subscription_id: stripeInvoice.subscription || undefined,
    amount_cents: stripeInvoice.amount_due,
    amount_paid_cents: stripeInvoice.amount_paid,
    currency: stripeInvoice.currency,
    status: stripeInvoice.status,
    invoice_date: new Date(stripeInvoice.created * 1000).toISOString(),
    due_date: stripeInvoice.due_date
      ? new Date(stripeInvoice.due_date * 1000).toISOString()
      : new Date().toISOString(),
    paid_at: stripeInvoice.paid_at
      ? new Date(stripeInvoice.paid_at * 1000).toISOString()
      : undefined,
    pdf_url: stripeInvoice.invoice_pdf,
    hosted_invoice_url: stripeInvoice.hosted_invoice_url,
    description: stripeInvoice.description,
    metadata: stripeInvoice.metadata,
  }

  const supabase = await createClient()

  // Upsert invoice
  await supabase
    .from('stripe_invoices')
    .upsert(invoiceData, { onConflict: 'stripe_invoice_id' })
}

/**
 * Get invoice from Stripe and sync to database
 */
export async function retrieveAndSyncInvoice(
  invoiceId: string,
  profileId: string
) {
  const invoice = await stripe.invoices.retrieve(invoiceId)
  await syncInvoiceToDatabase(invoice, profileId)
  return invoice
}

/**
 * List invoices for a customer
 */
export async function getCustomerInvoices(customerId: string) {
  return stripe.invoices.list({
    customer: customerId,
    limit: 100,
  })
}

/**
 * Get invoices from database for a profile
 */
export async function getProfileInvoices(profileId: string) {
  const supabase = await createClient()
  return supabase
    .from('stripe_invoices')
    .select('*')
    .eq('profile_id', profileId)
    .order('invoice_date', { ascending: false })
}

/**
 * Send invoice to customer
 */
export async function sendInvoice(invoiceId: string): Promise<void> {
  await stripe.invoices.sendInvoice(invoiceId)
}

/**
 * Finalize draft invoice (prepare for sending)
 */
export async function finalizeInvoice(invoiceId: string) {
  return stripe.invoices.finalizeInvoice(invoiceId)
}

/**
 * Get PDF URL for invoice
 */
export async function getInvoicePdfUrl(invoiceId: string): Promise<string | null> {
  const invoice = await stripe.invoices.retrieve(invoiceId)
  return invoice.invoice_pdf || null
}

/**
 * Mark invoice as uncollectible (debt write-off)
 */
export async function markInvoiceUncollectible(invoiceId: string): Promise<void> {
  await stripe.invoices.markUncollectible(invoiceId)

  const supabase = await createClient()
  await supabase
    .from('stripe_invoices')
    .update({ status: 'uncollectible' })
    .eq('stripe_invoice_id', invoiceId)
}

/**
 * Void invoice
 */
export async function voidInvoice(invoiceId: string): Promise<void> {
  await stripe.invoices.voidInvoice(invoiceId)

  const supabase = await createClient()
  await supabase
    .from('stripe_invoices')
    .update({ status: 'void' })
    .eq('stripe_invoice_id', invoiceId)
}

/**
 * Create invoice for subscription
 */
export async function createInvoice(
  customerId: string,
  description?: string,
  metadata?: Record<string, string>
) {
  return stripe.invoices.create({
    customer: customerId,
    auto_advance: false,
    description,
    metadata,
  })
}

/**
 * Add line item to draft invoice
 */
export async function addInvoiceLineItem(
  invoiceId: string,
  description: string,
  amount: number,
  currency: string
) {
  return stripe.invoiceItems.create({
    invoice: invoiceId,
    customer: (await stripe.invoices.retrieve(invoiceId)).customer as string,
    description,
    amount,
    currency,
  })
}

/**
 * Get invoice breakdown/line items
 */
export async function getInvoiceLineItems(invoiceId: string) {
  return stripe.invoices.listLineItems(invoiceId)
}
