<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\PesaPalService;
use App\Mail\OrderConfirmed;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class PesaPalController extends Controller
{
    public function __construct(protected PesaPalService $pesapal) {}

    // ── Called from frontend to initiate payment ───────────────
    public function initiatePayment(Request $request)
    {
        $order = Order::findOrFail($request->order_id);

        try {
            $result = $this->pesapal->submitOrder([
                'order_number'   => $order->order_number,
                'total'          => $order->total,
                'customer_name'  => $order->customer_name,
                'customer_email' => $order->customer_email,
                'customer_phone' => $order->customer_phone,
            ]);

            // Save PesaPal tracking ID
            $order->update([
                'pesapal_tracking_id'         => $result['order_tracking_id'],
                'pesapal_merchant_reference'  => $result['merchant_reference'],
            ]);

            return response()->json([
                'payment_url' => $result['redirect_url'],
            ]);

        } catch (\Exception $e) {
            Log::error('PesaPal initiate payment error: ' . $e->getMessage());
            return response()->json(['message' => 'Payment initiation failed. Please try again.'], 500);
        }
    }

    // ── IPN: PesaPal calls this after payment ──────────────────
    public function ipn(Request $request)
    {
        $orderTrackingId = $request->query('OrderTrackingId')
                        ?? $request->query('orderTrackingId');
        $merchantRef     = $request->query('OrderMerchantReference')
                        ?? $request->query('orderMerchantReference');

        if (!$orderTrackingId) {
            return response()->json(['message' => 'Missing tracking ID'], 400);
        }

        try {
            $status = $this->pesapal->getTransactionStatus($orderTrackingId);

            Log::info('PesaPal IPN received', $status);

            // Find order by order_number (merchant reference)
            $order = Order::where('order_number', $merchantRef)
                       ->orWhere('pesapal_tracking_id', $orderTrackingId)
                       ->first();

            if (!$order) {
                Log::error('PesaPal IPN: order not found', ['ref' => $merchantRef]);
                return response()->json(['message' => 'Order not found'], 404);
            }

            // payment_status_description: "Completed", "Failed", "Reversed", "Pending"
            $paymentStatus = $status['payment_status_description'] ?? '';

            if ($paymentStatus === 'Completed') {
                $order->update([
                    'status'  => 'paid',
                    'paid_at' => now(),
                ]);

                // Send confirmation email
                try {
                    Mail::to($order->customer_email)
                        ->queue(new OrderConfirmed($order->load('items')));
                } catch (\Exception $e) {
                    Log::error('Order email failed after payment: ' . $e->getMessage());
                }
            }

            return response()->json(['message' => 'IPN processed'], 200);

        } catch (\Exception $e) {
            Log::error('PesaPal IPN error: ' . $e->getMessage());
            return response()->json(['message' => 'IPN processing failed'], 500);
        }
    }

    public function verify(Request $request)
{
    $orderTrackingId = $request->query('OrderTrackingId');
    $orderNumber     = $request->query('order');

    if (!$orderTrackingId || !$orderNumber) {
        return response()->json(['status' => 'invalid'], 400);
    }

    try {
        $status = $this->pesapal->getTransactionStatus($orderTrackingId);
        $paymentStatus = $status['payment_status_description'] ?? 'Pending';

        // If paid, update the order
        if ($paymentStatus === 'Completed') {
            $order = Order::where('order_number', $orderNumber)->first();

            if ($order && $order->status !== 'paid') {
                $order->update([
                    'status'  => 'paid',
                    'paid_at' => now(),
                ]);

                // Send confirmation email
                try {
                    Mail::to($order->customer_email)
                        ->queue(new \App\Mail\OrderConfirmed($order->load('items')));
                } catch (\Exception $e) {
                    Log::error('Email failed after verify: ' . $e->getMessage());
                }
            }
        }

        return response()->json([
            'status'       => $paymentStatus,
            'order_number' => $orderNumber,
        ]);

    } catch (\Exception $e) {
        Log::error('PesaPal verify error: ' . $e->getMessage());
        return response()->json(['status' => 'error'], 500);
    }
}
}