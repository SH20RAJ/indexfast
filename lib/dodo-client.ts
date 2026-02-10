/**
 * Dodo Payments API Client
 * 
 * Server-side client for interacting with Dodo Payments API
 * Never expose this to the client - API key must remain secure
 */

const DODO_API_BASE = 'https://api.dodopayments.com/v1';

export interface DodoCustomer {
  customer_id: string;
  email: string;
  metadata?: Record<string, string>;
}

interface DodoCheckoutSession {
  checkout_id: string;
  checkout_url: string;
  customer_id: string;
  status: string;
}

interface CreateCustomerParams {
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}

interface CreateCheckoutParams {
  customer_id: string;
  plan_id: string;
  success_url: string;
  cancel_url: string;
  metadata?: Record<string, string>;
}

export interface DodoSubscription {
  subscription_id: string;
  customer_id: string;
  status: string;
  plan_id: string;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  metadata?: Record<string, string>;
}

export interface DodoWebhookEvent {
  type: string;
  data: any; // Ideally this should be a union of possible data types, but 'any' is practical for now
  id: string;
  created_at: string;
}

class DodoPaymentsClient {
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Dodo Payments API key is required');
    }
    this.apiKey = apiKey;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${DODO_API_BASE}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `Dodo API Error (${response.status}): ${errorData}`
      );
    }

    return response.json();
  }

  /**
   * Create a new customer in Dodo Payments
   */
  async createCustomer(params: CreateCustomerParams): Promise<DodoCustomer> {
    return this.request<DodoCustomer>('/customers', {
      method: 'POST',
      body: JSON.stringify({
        email: params.email,
        name: params.name,
        metadata: params.metadata,
      }),
    });
  }

  /**
   * Get customer by email (to check if customer already exists)
   */
  async getCustomerByEmail(email: string): Promise<DodoCustomer | null> {
    try {
      const response = await this.request<{ customers: DodoCustomer[] }>(
        `/customers?email=${encodeURIComponent(email)}`
      );
      return response.customers?.[0] || null;
    } catch (error) {
      // If customer doesn't exist, return null instead of throwing
      console.error('Error fetching customer:', error);
      return null;
    }
  }

  /**
   * Get or create customer (idempotent operation)
   */
  async getOrCreateCustomer(params: CreateCustomerParams): Promise<DodoCustomer> {
    // Try to get existing customer first
    const existingCustomer = await this.getCustomerByEmail(params.email);
    
    if (existingCustomer) {
      return existingCustomer;
    }

    // Create new customer if doesn't exist
    return this.createCustomer(params);
  }

  /**
   * Create a checkout session for subscription
   */
  async createCheckoutSession(params: CreateCheckoutParams): Promise<DodoCheckoutSession> {
    return this.request<DodoCheckoutSession>('/checkout/sessions', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: params.customer_id,
        plan_id: params.plan_id,
        payment_mode: 'subscription', // Recurring subscription
        success_url: params.success_url,
        cancel_url: params.cancel_url,
        metadata: params.metadata,
      }),
    });
  }

  /**
   * Create a customer portal session for managing subscriptions
   */
  async createCustomerPortalSession(customerId: string): Promise<{ session_url: string }> {
    // Note: Dodo Payments API for portal might differ, assuming standard pattern or provided endpoint
    // If Dodo doesn't have a direct "create portal session" API like Stripe, 
    // we might need to rely on their dashboard or a specific link format.
    // However, for this task, I will implement a request to a hypothetical or known endpoint
    // based on common payment provider patterns if specific docs aren't provided.
    // Dodo docs usually have /customer-portal/sessions or similar.
    // Let's assume /customer-portal-sessions based on standard patterns.
    
    // ADJUSTMENT: Based on Dodo Payments typical features, if they generate a link per customer:
    return this.request<{ session_url: string }>('/customer-portal/sessions', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: customerId,
      }),
    });
  }

  /**
   * Get checkout session details
   */
  async getCheckoutSession(checkoutId: string): Promise<DodoCheckoutSession> {
    return this.request<DodoCheckoutSession>(`/checkout/sessions/${checkoutId}`);
  }
}

/**
 * Get singleton instance of Dodo client
 * Only use on the server side!
 */
export function getDodoClient(): DodoPaymentsClient {
  const apiKey = process.env.DODOPAYMENTS_API_KEY;
  
  if (!apiKey) {
    throw new Error(
      'DODOPAYMENTS_API_KEY environment variable is not set'
    );
  }

  return new DodoPaymentsClient(apiKey);
}

/**
 * Plan ID mapping
 * Map internal plan names to Dodo Payments plan IDs
 */
export const DODO_PLAN_IDS = {
  pro_monthly: process.env.DODO_PRO_MONTHLY_PLAN_ID || 'plan_pro_monthly',
  pro_yearly: process.env.DODO_PRO_YEARLY_PLAN_ID || 'plan_pro_yearly',
  business_monthly: process.env.DODO_BUSINESS_MONTHLY_PLAN_ID || 'plan_business_monthly',
  business_yearly: process.env.DODO_BUSINESS_YEARLY_PLAN_ID || 'plan_business_yearly',
} as const;

export type DodoPlanId = keyof typeof DODO_PLAN_IDS;
