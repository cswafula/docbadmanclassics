<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryRegion extends Model
{
    protected $fillable = ['name', 'cost', 'is_active'];

    protected $casts = [
        'cost'      => 'float',
        'is_active' => 'boolean',
    ];
}