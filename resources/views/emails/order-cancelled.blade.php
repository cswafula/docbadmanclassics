@extends('emails.layout')

@section('content')

<div class="hero">
  <p class="order-badge">{{ $order->order_number }}</p>
  <h2>Your Order Has Been Cancelled</h2>
  <p>Hi {{ $order->customer_name }},<br><br>
  We're sorry to let you know that your order has been cancelled. If you did not request this or have any questions, please contact us immediately.</p>
</div>

<div class="body">

  <p class="section-label">Cancelled Items</p>
  @foreach($order->items as $item)
  <div class="item-row">
    <div>
      <div class="item-title">{{ $item->painting_title }}</div>
      <div class="item-meta">Qty: {{ $item->quantity }}</div>
    </div>
    <div class="item-price">KES {{ number_format($item->subtotal, 0) }}</div>
  </div>
  @endforeach

  <p class="section-label">Order Details</p>
  <div class="info-row">
    <span class="label">Order Number</span>
    <span class="value">{{ $order->order_number }}</span>
  </div>
  <div class="info-row">
    <span class="label">Total</span>
    <span class="value">KES {{ number_format($order->total, 0) }}</span>
  </div>

  <div class="notice">
    If you have questions or believe this was a mistake, please contact us at
    <a href="mailto:admin@docbadmanclassics.org" style="color: #b8963e;">admin@docbadmanclassics.org</a>
    or call us directly.
  </div>

</div>

@endsection