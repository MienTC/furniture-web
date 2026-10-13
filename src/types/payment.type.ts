export interface IPaymentConfig {
  vnpay_enabled?: boolean;
  vnpay_tmn_code?: string;
  vnpay_sandbox?: boolean;
  vnpay_url?: string;
  cod_enabled?: boolean;
  bank_transfer_enabled?: boolean;
  bank_name?: string;
  bank_account_number?: string;
  bank_account_holder?: string;
  bank_branch?: string;
  sepay_enabled?: boolean;
  sepay_merchant_id?: string;
  sepay_api_key?: string;
}

export interface ICreateVNPayPayload {
  orderId: string;
}

export interface ICreateVNPayResponse {
  paymentUrl: string;
}
