<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'customer_name'          => 'required|string|max:255',
        'customer_email'         => 'required|email',
        'customer_phone'         => 'required|string|max:20',
        'shipping_address'       => 'required|string',
        'items'                  => 'required|array|min:1',
        'items.*.painting_id'    => 'required|integer|exists:paintings,id',
        'items.*.painting_title' => 'required|string',
        'items.*.price'          => 'required|numeric',
        'items.*.quantity'       => 'required|integer|min:1',
        'subtotal'               => 'required|numeric',
        'shipping_cost'          => 'required|numeric',
        'total'                  => 'required|numeric',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $order = Order::create([
        'customer_name'    => $request->customer_name,
        'customer_email'   => $request->customer_email,
        'customer_phone'   => $request->customer_phone,
        'shipping_address' => $request->shipping_address,
        'subtotal'         => $request->subtotal,
        'shipping_cost'    => $request->shipping_cost,
        'total'            => $request->total,
        'payment_method'   => 'pesapal',
    ]);

    foreach ($request->items as $item) {
        $order->items()->create([
            'painting_id'    => $item['painting_id'],
            'painting_title' => $item['painting_title'],
            'price'          => $item['price'],
            'quantity'       => $item['quantity'],
            'subtotal'       => $item['price'] * $item['quantity'],
        ]);

        // Reduce painting stock
        $painting = \App\Models\Painting::find($item['painting_id']);
        if ($painting) {
            $painting->update(['quantity' => max(0, $painting->quantity - $item['quantity'])]);
        }
    }

    return response()->json([
        'message'      => 'Order placed successfully',
        'order_number' => $order->order_number,
        'order_id'     => $order->id,
    ], 201);
}
}