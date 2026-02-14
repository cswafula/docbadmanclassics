@extends('emails.layout')

@section('content')

<div class="hero">
  <p class="order-badge">{{ $order->order_number }}</p>
  <h2>Your Order is On Its Way</h2>
  <p>Hi {{ $order->customer_name }},<br><br>
  Great news! Your artwork has been dispatched and is now en route to you. Our shipping team will be in touch with delivery updates.</p>
</div>

<div class="body">

  <p class="section-label">Order Summary</p>
  @foreach($order->items as $item)
  <div class="item-row">
    <div>
      <div class="item-title">{{ $item->painting_title }}</div>
      <div class="item-meta">Qty: {{ $item->quantity }}</div>
    </div>
    <div class="item-price">KES {{ number_format($item->subtotal, 0) }}</div>
  </div>
  @endforeach

  <p class="section-label">Delivery Address</p>
  <div class="info-row">
    <span class="label">Shipping To</span>
    <span class="value">{{ $order->shipping_address }}</span>
  </div>
  <div class="info-row">
    <span class="label">Contact</span>
    <span class="value">{{ $order->customer_phone }}</span>
  </div>

  <div class="notice">
    If you have any questions about your delivery, reply to this email or contact us at
    <a href="mailto:admin@docbadmanclassics.org" style="color: #b8963e;">admin@docbadmanclassics.org</a>
  </div>

</div>

@endsection