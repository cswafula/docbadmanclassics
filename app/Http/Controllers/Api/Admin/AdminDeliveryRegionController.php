<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\DeliveryRegion;
use Illuminate\Http\Request;

class AdminDeliveryRegionController extends Controller
{
    public function index()
    {
        return response()->json(
            DeliveryRegion::orderBy('name')->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100|unique:delivery_regions,name',
            'cost' => 'required|numeric|min:0',
        ]);

        $region = DeliveryRegion::create([
            'name'      => $request->name,
            'cost'      => $request->cost,
            'is_active' => true,
        ]);

        return response()->json($region, 201);
    }

    public function update(Request $request, $id)
    {
        $region = DeliveryRegion::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:100|unique:delivery_regions,name,' . $id,
            'cost' => 'required|numeric|min:0',
        ]);

        $region->update([
            'name'      => $request->name,
            'cost'      => $request->cost,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return response()->json($region);
    }

    public function destroy($id)
    {
        DeliveryRegion::findOrFail($id)->delete();
        return response()->json(['message' => 'Region deleted']);
    }
}