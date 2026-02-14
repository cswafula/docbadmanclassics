<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class PesaPalService
{
    protected string $baseUrl;
    protected string $consumerKey;
    protected string $consumerSecret;

    public function __construct()
    {
        $this->baseUrl        = config('pesapal.base_url');
        $this->consumerKey    = config('pesapal.consumer_key');
        $this->consumerSecret = config('pesapal.consumer_secret');
    }

    // ── Step 1: Get auth token (cached for 4 minutes) ──────────
    public function getToken(): string
    {
        return Cache::remember('pesapal_token', 240, function () {
            $response = Http::withHeaders([
                'Accept'       => 'application/json',
                'Content-Type' => 'application/json',
            ])->post("{$this->baseUrl}/api/Auth/RequestToken", [
                'consumer_key'    => $this->consumerKey,
                'consumer_secret' => $this->consumerSecret,
            ]);

            if (!$response->successful()) {
                Log::error('PesaPal auth failed', $response->json());
                throw new \Exception('PesaPal authentication failed');
            }

            return $response->json()['token'];
        });
    }

    // ── Step 2: Register IPN (only needs to run once) ──────────
    public function registerIpn(): string
    {
        return Cache::remember('pesapal_ipn_id', 86400, function () {
            $response = Http::withHeaders([
                'Accept'        => 'application/json',
                'Content-Type'  => 'application/json',
                'Authorization' => 'Bearer ' . $this->getToken(),
            ])->post("{$this->baseUrl}/api/URLSetup/RegisterIPN", [
                'url'              => config('pesapal.ipn_url'),
                'ipn_notification_type' => 'GET',
            ]);

            if (!$response->successful()) {
                Log::error('PesaPal IPN registration failed', $response->json());
                throw new \Exception('PesaPal IPN registration failed');
            }

            return $response->json()['ipn_id'];
        });
    }

    // ── Step 3: Submit order → get payment URL ─────────────────
    public function submitOrder(array $orderData): array
    {
        $token = $this->getToken();
        $ipnId = $this->registerIpn();

        $response = Http::withHeaders([
            'Accept'        => 'application/json',
            'Content-Type'  => 'application/json',
            'Authorization' => 'Bearer ' . $token,
        ])->post("{$this->baseUrl}/api/Transactions/SubmitOrderRequest", [
            'id'                      => $orderData['order_number'],
            'currency'                => 'KES',
            'amount'                  => (float) $orderData['total'],
            'description'             => 'Doc Badman Classics — Artwork Order',
            'callback_url'            => config('pesapal.callback_url') . '?order=' . $orderData['order_number'],
            'notification_id'         => $ipnId,
            'billing_address'         => [
                'email_address' => $orderData['customer_email'],
                'phone_number'  => $orderData['customer_phone'],
                'first_name'    => explode(' ', $orderData['customer_name'])[0],
                'last_name'     => implode(' ', array_slice(explode(' ', $orderData['customer_name']), 1)) ?: '',
            ],
        ]);

        if (!$response->successful()) {
            Log::error('PesaPal submit order failed', $response->json());
            throw new \Exception('Failed to submit order to PesaPal');
        }

        return $response->json();
        // Returns: { order_tracking_id, merchant_reference, redirect_url }
    }

    // ── Step 4: Verify payment status (called from IPN) ────────
    public function getTransactionStatus(string $orderTrackingId): array
    {
        $response = Http::withHeaders([
            'Accept'        => 'application/json',
            'Content-Type'  => 'application/json',
            'Authorization' => 'Bearer ' . $this->getToken(),
        ])->get("{$this->baseUrl}/api/Transactions/GetTransactionStatus", [
            'orderTrackingId' => $orderTrackingId,
        ]);

        if (!$response->successful()) {
            Log::error('PesaPal status check failed', $response->json());
            throw new \Exception('Failed to get transaction status');
        }

        return $response->json();
    }
}