/**
 * Stripe API and database types for Ploy
 * Covers Payments (subscriptions, one-time charges) and Invoicing
 */

// ─────────────────────────────────────────────────────────────────
// Database Row Types (from our tables)
// ─────────────────────────────────────────────────────────────────

export type StripePaymentMethod = {
  id: string;
  profile_id: string;
  stripe_payment_method_id: string;
  type: 'card' | 'bank_account';
  brand?: string;
  last_4_digits?: string;
  exp_month?: number;
  exp_year?: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export type StripeInvoice = {
  id: string;
  stripe_invoice_id: string;
  profile_id: string;
  subscription_id?: string;
  amount_cents: number;
  amount_paid_cents: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  invoice_date: string;
  due_date: string;
  paid_at?: string;
  pdf_url?: string;
  hosted_invoice_url?: string;
  description?: string;
  metadata?: Record<string, string>;
  created_at: string;
  updated_at: string;
};

export type StripeCharge = {
  id: string;
  stripe_charge_id: string;
  profile_id: string;
  amount_cents: number;
  currency: string;
  description?: string;
  receipt_email?: string;
  paid: boolean;
  refunded: boolean;
  refunded_amount_cents: number;
  metadata?: Record<string, string>;
  created_at: string;
  updated_at: string;
};

export type AgencyPayout = {
  id: string;
  agency_id: string;
  stripe_payout_id?: string;
  amount_cents: number;
  currency: string;
  status: 'pending' | 'in_transit' | 'paid' | 'failed' | 'cancelled';
  period_start: string;
  period_end: string;
  paid_at?: string;
  failure_message?: string;
  created_at: string;
  updated_at: string;
};

// ─────────────────────────────────────────────────────────────────
// Stripe API Object Types
// ─────────────────────────────────────────────────────────────────

export type StripeCustomer = {
  id: string;
  email?: string;
  name?: string;
  description?: string;
  phone?: string;
  default_source?: string;
  invoice_settings?: {
    custom_fields?: Array<{
      name: string;
      value: string;
    }>;
    footer?: string;
    rendering_options?: {
      amount_tax_display?: string;
    };
  };
  preferred_locales?: string[];
  metadata?: Record<string, string>;
};

export type StripeSubscription = {
  id: string;
  customer: string;
  status: 'active' | 'past_due' | 'unpaid' | 'canceled' | 'trialing';
  current_period_start: number;
  current_period_end: number;
  cancel_at?: number;
  cancel_at_period_end: boolean;
  canceled_at?: number;
  ended_at?: number;
  trial_start?: number;
  trial_end?: number;
  items: {
    data: Array<{
      id: string;
      price: StripePrice;
      quantity?: number;
    }>;
  };
  default_payment_method?: string;
  automatic_tax?: {
    enabled: boolean;
  };
  metadata?: Record<string, string>;
};

export type StripePrice = {
  id: string;
  object: 'price';
  active: boolean;
  billing_scheme: 'per_unit' | 'tiered';
  created: number;
  currency: string;
  custom_unit_amount?: {
    maximum?: number;
    minimum?: number;
    preset?: number;
  };
  livemode: boolean;
  lookup_key?: string;
  metadata?: Record<string, string>;
  nickname?: string;
  product: string;
  recurring?: {
    aggregate_usage?: 'last_during_period' | 'last_ever' | 'max' | 'sum';
    interval: 'day' | 'month' | 'week' | 'year';
    interval_count: number;
    trial_period_days?: number;
    usage_type: 'licensed' | 'metered';
  };
  tax_behavior: 'exclusive' | 'inclusive' | 'unspecified';
  tiers_mode?: 'graduated' | 'volume';
  transform_quantity?: {
    divide_by: number;
    round: 'down' | 'up';
  };
  type: 'one_time' | 'recurring';
  unit_amount?: number;
  unit_amount_decimal?: string;
};

export type StripePaymentIntent = {
  id: string;
  object: 'payment_intent';
  amount: number;
  amount_capturable: number;
  amount_received: number;
  charges: {
    data: StripeCharge[];
  };
  client_secret: string;
  confirmation_method: 'automatic' | 'manual';
  created: number;
  currency: string;
  customer?: string;
  description?: string;
  last_payment_error?: {
    charge?: string;
    code?: string;
    decline_code?: string;
    message: string;
    payment_intent?: {
      id: string;
      status: string;
    };
    payment_method?: string;
    type: string;
  };
  livemode: boolean;
  metadata?: Record<string, string>;
  next_action?: {
    type: 'redirect_to_url' | 'use_stripe_sdk' | 'oob_otp_submit';
    redirect_to_url?: {
      return_url?: string;
      url: string;
    };
    use_stripe_sdk?: Record<string, string>;
  };
  payment_method?: string;
  payment_method_types: string[];
  receipt_email?: string;
  setup_future_usage?: 'off_session' | 'on_session' | 'one_time';
  shipping?: {
    address?: {
      city?: string;
      country?: string;
      line1?: string;
      line2?: string;
      postal_code?: string;
      state?: string;
    };
    carrier?: string;
    name?: string;
    phone?: string;
    tracking_number?: string;
  };
  statement_descriptor?: string;
  statement_descriptor_suffix?: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
};

export type StripeInvoiceObject = {
  id: string;
  object: 'invoice';
  account_country?: string;
  account_name?: string;
  account_tax_ids?: Array<{ type: string; value: string }>;
  amount_due: number;
  amount_paid: number;
  amount_remaining: number;
  application?: string;
  application_fee?: number;
  attempt_count: number;
  attempted: boolean;
  auto_advance: boolean;
  automatic_tax?: {
    enabled: boolean;
    status?: 'complete' | 'failed' | 'processing';
  };
  billing_reason?: 'subscription_cycle' | 'subscription_create' | 'subscription_update' | 'subscription' | 'manual' | 'upcoming' | 'subscription_threshold';
  charge?: string;
  collection_method: 'charge_automatically' | 'send_invoice';
  created: number;
  currency: string;
  custom_fields?: Array<{
    name?: string;
    value?: string;
  }>;
  customer: string;
  customer_address?: {
    city?: string;
    country?: string;
    line1?: string;
    line2?: string;
    postal_code?: string;
    state?: string;
  };
  customer_email?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_tax_exempt?: 'none' | 'exempt' | 'reverse';
  customer_tax_ids?: Array<{
    type: string;
    value: string;
  }>;
  default_payment_method?: string;
  default_source?: string;
  default_tax_rates?: string[];
  description?: string;
  discounts?: Array<{
    coupon?: {
      id: string;
      percent_off?: number;
      amount_off?: number;
    };
    discount: string;
  }>;
  due_date?: number;
  effective_at?: number;
  email?: string;
  footer?: string;
  from_invoice?: string;
  hosted_invoice_url?: string;
  last_finalization_error?: {
    code?: string;
    message: string;
  };
  latest_revision?: string;
  lines: {
    data: Array<{
      id: string;
      amount: number;
      amount_excluding_tax?: number;
      currency: string;
      description?: string;
      discount_amounts?: Array<{
        amount: number;
        discount: string;
      }>;
      discountable: boolean;
      discounts?: string[];
      invoice_item: string;
      livemode: boolean;
      metadata?: Record<string, string>;
      period: {
        end: number;
        start: number;
      };
      plan?: string;
      price?: StripePrice;
      proration: boolean;
      proration_details?: {
        credited_items?: Array<{
          invoice_line_item_id?: string;
          quantity?: number;
        }>;
      };
      quantity?: number;
      subscription?: string;
      subscription_item?: string;
      tax_amounts?: Array<{
        amount: number;
        inclusive: boolean;
        tax_rate: string;
      }>;
      tax_code?: string;
      type: 'invoiceitem' | 'line_item';
      unit_amount_excluding_tax?: number;
    }>;
  };
  livemode: boolean;
  metadata?: Record<string, string>;
  next_payment_attempt?: number;
  number?: string;
  on_behalf_of?: string;
  paid: boolean;
  paid_out_of_band: boolean;
  payment_intent?: string;
  payment_settings?: {
    payment_method_options?: Record<string, string>;
    payment_method_types?: string[];
    default_mandate?: string;
    save_default_payment_method?: 'off' | 'on_subscription';
  };
  period_end: number;
  period_start: number;
  post_payment_credit_notes_amount: number;
  pre_payment_credit_notes_amount: number;
  quote?: string;
  receipt_number?: string;
  rendering?: {
    amount_tax_display?: string | null;
  };
  rendering_options?: {
    amount_tax_display?: string;
  };
  revisions?: {
    data: Array<{
      id: string;
      created: number;
      status: string;
    }>;
  };
  status?: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  status_transitions?: {
    finalized_at?: number;
    marked_uncollectible_at?: number;
    paid_at?: number;
    voided_at?: number;
  };
  statement_descriptor?: string;
  subscription?: string;
  subtotal?: number;
  subtotal_excluding_tax?: number;
  tax?: number;
  test_clock?: string;
  threshold_reason?: {
    amount_gte?: number;
    item_reasons?: Array<{
      line_item_id: string;
      usage_gte: number;
    }>;
  };
  total?: number;
  total_discount_amounts?: Array<{
    amount: number;
    discount: string;
  }>;
  total_excluding_tax?: number;
  total_tax_amounts?: Array<{
    amount: number;
    inclusive: boolean;
    tax_rate: string;
  }>;
  transfer_data?: {
    amount?: number;
    destination: string;
  };
  url?: string;
  webhooks_delivered_at?: number;
};

export type StripePayout = {
  id: string;
  object: 'payout';
  amount: number;
  application?: string;
  application_fee?: string;
  balance_transaction?: string;
  created: number;
  currency: string;
  description?: string;
  destination?: string;
  failure_balance_transaction?: string;
  failure_code?: string;
  failure_message?: string;
  livemode: boolean;
  metadata?: Record<string, string>;
  method: 'standard' | 'instant';
  original_payout?: string;
  reversed_by?: string;
  source_type: 'alipay_account' | 'bank_account' | 'card';
  statement_descriptor?: string;
  status: 'paid' | 'pending' | 'in_transit' | 'canceled' | 'failed';
  type: 'bank_account' | 'card';
  arrival_date?: number;
  automatic: boolean;
};

// ─────────────────────────────────────────────────────────────────
// Webhook Event Types
// ─────────────────────────────────────────────────────────────────

export type StripeWebhookEvent = {
  id: string;
  object: 'event';
  api_version?: string;
  created: number;
  data: {
    object: Record<string, unknown>;
    previous_attributes?: Record<string, string>;
  };
  livemode: boolean;
  pending_webhooks: number;
  request?: {
    id?: string;
    idempotency_key?: string;
  };
  type: StripeWebhookEventType;
};

export type StripeWebhookEventType =
  // Customer events
  | 'customer.created'
  | 'customer.deleted'
  | 'customer.updated'
  // Subscription events
  | 'customer.subscription.created'
  | 'customer.subscription.deleted'
  | 'customer.subscription.paused'
  | 'customer.subscription.resumed'
  | 'customer.subscription.trial_will_end'
  | 'customer.subscription.updated'
  // Invoice events
  | 'invoice.created'
  | 'invoice.deleted'
  | 'invoice.finalization_failed'
  | 'invoice.finalized'
  | 'invoice.marked_uncollectible'
  | 'invoice.payment_action_required'
  | 'invoice.payment_failed'
  | 'invoice.payment_succeeded'
  | 'invoice.paid'
  | 'invoice.sent'
  | 'invoice.upcoming'
  | 'invoice.updated'
  | 'invoice.voided'
  // Charge events
  | 'charge.captured'
  | 'charge.dispute.closed'
  | 'charge.dispute.created'
  | 'charge.dispute.funds_reinstated'
  | 'charge.dispute.funds_withdrawn'
  | 'charge.dispute.updated'
  | 'charge.expired'
  | 'charge.failed'
  | 'charge.pending'
  | 'charge.refunded'
  | 'charge.succeeded'
  | 'charge.updated'
  // Payment intent events
  | 'payment_intent.amount_capturable_updated'
  | 'payment_intent.canceled'
  | 'payment_intent.created'
  | 'payment_intent.partially_funded'
  | 'payment_intent.payment_failed'
  | 'payment_intent.processing'
  | 'payment_intent.requires_action'
  | 'payment_intent.succeeded'
  // Payout events
  | 'payout.canceled'
  | 'payout.created'
  | 'payout.failed'
  | 'payout.paid'
  | 'payout.updated'
  | 'payout.reconciliation_completed'
  // Payment method events
  | 'payment_method.attached'
  | 'payment_method.automatically_updated'
  | 'payment_method.detached'
  | 'payment_method.updated';

// ─────────────────────────────────────────────────────────────────
// Request/Response Types
// ─────────────────────────────────────────────────────────────────

export type CreateCheckoutSessionRequest = {
  planId: string;
  interval: 'month' | 'year';
  successUrl: string;
  cancelUrl: string;
};

export type CreateCheckoutSessionResponse = {
  sessionId: string;
  clientSecret?: string;
  url?: string;
};

export type CreateOneTimeChargeRequest = {
  amountCents: number;
  description: string;
  receiptEmail?: string;
  metadata?: Record<string, string>;
};

export type CreateOneTimeChargeResponse = {
  chargeId: string;
  status: 'succeeded' | 'processing' | 'failed';
  amountCents: number;
};

export type PaymentMethodListResponse = {
  methods: StripePaymentMethod[];
  defaultMethod?: StripePaymentMethod;
};

export type InvoiceListResponse = {
  invoices: StripeInvoice[];
  total: number;
};

// ─────────────────────────────────────────────────────────────────
// Error Types
// ─────────────────────────────────────────────────────────────────

export type StripeError = {
  type: 'StripeCardError' | 'StripeInvalidRequestError' | 'StripeAPIError' | 'StripeAuthenticationError' | 'StripeRateLimitError';
  charge?: string;
  code?: string;
  decline_code?: string;
  message: string;
  param?: string;
  payment_intent?: {
    id: string;
    status: string;
  };
  payment_method?: string;
  status?: number;
};
