<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DeliveryRegion;

class DeliveryRegionController extends Controller
{
    public function index()
    {
        $regions = DeliveryRegion::where('is_active', true)
                    ->orderBy('name')
                    ->get(['id', 'name', 'cost']);

        return response()->json($regions);
    }
}