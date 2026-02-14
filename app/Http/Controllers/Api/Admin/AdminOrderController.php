<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use App\Mail\OrderShipped;
use App\Mail\OrderDelivered;
use App\Mail\OrderCancelled;
use Illuminate\Support\Facades\Mail;

class AdminOrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with('items')->latest();

        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('order_number', 'like', "%{$request->search}%")
                  ->orWhere('customer_name', 'like', "%{$request->search}%")
                  ->orWhere('customer_email', 'like', "%{$request->search}%");
            });
        }

        return response()->json($query->paginate(20));
    }

    public function show($id)
    {
        $order = Order::with('items.painting')->findOrFail($id);
        return response()->json($order);
    }

    public function updateStatus(Request $request, $id)
{
    $order = Order::with('items')->findOrFail($id);

    $request->validate([
        'status' => 'required|in:pending,paid,processing,shipped,delivered,cancelled',
    ]);

    $data = ['status' => $request->status];

    if ($request->status === 'paid' && !$order->paid_at) {
        $data['paid_at'] = now();
    }

    $order->update($data);

    // Send appropriate email
    match($request->status) {
        'shipped'   => Mail::to($order->customer_email)->queue(new OrderShipped($order)),
        'delivered' => Mail::to($order->customer_email)->queue(new OrderDelivered($order)),
        'cancelled' => Mail::to($order->customer_email)->queue(new OrderCancelled($order)),
        default     => null,
    };

    return response()->json($order);
}

    public function stats()
    {
        return response()->json([
            'total_orders'    => Order::count(),
            'pending_orders'  => Order::where('status', 'pending')->count(),
            'total_revenue'   => Order::where('status', 'paid')->sum('total'),
            'total_paintings' => \App\Models\Painting::count(),
            'sold_paintings'  => \App\Models\Painting::where('quantity', 0)->count(),
            'recent_orders'   => Order::with('items')->latest()->take(5)->get(),
        ]);
    }
}