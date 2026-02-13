<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'painting_id',
        'painting_title',
        'price',
        'quantity',
        'subtotal'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    // Relationship: An item belongs to an order
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // Relationship: An item belongs to a painting
    public function painting()
    {
        return $this->belongsTo(Painting::class);
    }
}