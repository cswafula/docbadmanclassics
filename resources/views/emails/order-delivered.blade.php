@extends('emails.layout')

@section('content')

<div class="hero">
  <p class="order-badge">{{ $order->order_number }}</p>
  <h2>Your Order Has Been Delivered</h2>
  <p>Hi {{ $order->customer_name }},<br><br>
  Your artwork has arrived! We hope it brings as much joy to your space as it did to create. Thank you for being part of the Doc Badman Classics community.</p>
</div>

<div class="body">

  <p class="section-label">Delivered Items</p>
  @foreach($order->items as $item)
  <div class="item-row">
    <div>
      <div class="item-title">{{ $item->painting_title }}</div>
      <div class="item-meta">Qty: {{ $item->quantity }}</div>
    </div>
    <div class="item-price">KES {{ number_format($item->subtotal, 0) }}</div>
  </div>
  @endforeach

  <div class="notice">
    We would love to see your artwork in its new home! Tag us or get in touch — your collection is our pride.<br><br>
    Thank you for shopping with us. 🎨
  </div>

  <p style="font-family: Arial, sans-serif; font-size: 13px; color: #9e9e9e; margin-top: 28px; line-height: 1.8; text-align: center;">
    With gratitude,<br>
    <strong style="color: #1e2d1f;">Doc Badman Classics</strong>
  </p>

</div>

@endsection