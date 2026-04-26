<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Painting;
use App\Models\Craft;
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
            'items.*.item_type'      => 'nullable|in:painting,craft',
            'items.*.painting_id'    => 'nullable|integer|exists:paintings,id',
            'items.*.craft_id'       => 'nullable|integer|exists:crafts,id',
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
            $itemType = $item['item_type'] ?? 'painting';

            $order->items()->create([
                'painting_id'    => $itemType === 'painting' ? ($item['painting_id'] ?? null) : null,
                'craft_id'       => $itemType === 'craft'    ? ($item['craft_id']    ?? null) : null,
                'item_type'      => $itemType,
                'painting_title' => $item['painting_title'],
                'price'          => $item['price'],
                'quantity'       => $item['quantity'],
                'subtotal'       => $item['price'] * $item['quantity'],
            ]);

            // Reduce stock on the correct model
            if ($itemType === 'craft') {
                $craft = Craft::find($item['craft_id'] ?? null);
                if ($craft) {
                    $craft->update(['quantity' => max(0, $craft->quantity - $item['quantity'])]);
                }
            } else {
                $painting = Painting::find($item['painting_id'] ?? null);
                if ($painting) {
                    $painting->update(['quantity' => max(0, $painting->quantity - $item['quantity'])]);
                }
            }
        }

        return response()->json([
            'message'      => 'Order placed successfully',
            'order_number' => $order->order_number,
            'order_id'     => $order->id,
        ], 201);
    }
}
