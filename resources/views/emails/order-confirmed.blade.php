@extends('emails.layout')

@section('content')

<div class="hero">
  <p class="order-badge">{{ $order->order_number }}</p>
  <h2>Your Order is Now Complete</h2>
  <p>Hi {{ $order->customer_name }},<br><br>
  We have successfully processed your order. Thank you for shopping with Doc Badman Classics — your support of the arts means everything to us.</p>
</div>

<div class="body">

  {{-- Items --}}
  <p class="section-label">Items Ordered</p>
  @foreach($order->items as $item)
  <div class="item-row">
    <div>
      <div class="item-title">{{ $item->painting_title }}</div>
      <div class="item-meta">Qty: {{ $item->quantity }} &nbsp;·&nbsp; KES {{ number_format($item->price, 0) }} each</div>
    </div>
    <div class="item-price">KES {{ number_format($item->subtotal, 0) }}</div>
  </div>
  @endforeach

  {{-- Totals --}}
  <div class="total-row">
    <span class="total-label">Subtotal</span>
    <span class="total-value">KES {{ number_format($order->subtotal, 0) }}</span>
  </div>
  <div class="total-row" style="border-bottom: 1px solid #f0ede4;">
    <span class="total-label">Shipping</span>
    <span class="total-value">KES {{ number_format($order->shipping_cost, 0) }}</span>
  </div>
  <div class="total-row final">
    <span class="total-label">Total</span>
    <span class="total-value">KES {{ number_format($order->total, 0) }}</span>
  </div>

  {{-- Payment + Billing --}}
  <p class="section-label">Payment & Billing</p>
  <div class="info-row">
    <span class="label">Payment Method</span>
    <span class="value">{{ ucfirst($order->payment_method) }}</span>
  </div>
  <div class="info-row">
    <span class="label">Billing Address</span>
    <span class="value">{{ $order->shipping_address }}</span>
  </div>
  <div class="info-row">
    <span class="label">Email</span>
    <span class="value">{{ $order->customer_email }}</span>
  </div>
  <div class="info-row">
    <span class="label">Phone</span>
    <span class="value">{{ $order->customer_phone }}</span>
  </div>

  <div class="notice">
    Our shipping team will contact you shortly to confirm delivery details and arrange a convenient time.
  </div>

  <p style="font-family: Arial, sans-serif; font-size: 13px; color: #9e9e9e; margin-top: 28px; line-height: 1.8; text-align: center;">
    Thank you for shopping with us.<br>
    <strong style="color: #1e2d1f;">Doc Badman Classics</strong>
  </p>

</div>

@endsection