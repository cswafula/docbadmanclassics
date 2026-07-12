<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AdminPartnerController extends Controller
{
    public function index()
    {
        return response()->json(Partner::orderBy('sort_order')->orderBy('name')->get());
    }

    public function show($id)
    {
        return response()->json(Partner::findOrFail($id));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'        => 'required|string|max:255',
            'logo'        => 'nullable|image|mimes:jpeg,jpg,png,webp,svg|max:5120',
            'website_url' => 'nullable|url|max:500',
            'map_url'     => 'nullable|string|max:1000',
            'description' => 'nullable|string',
            'is_active'   => 'nullable',
            'sort_order'  => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('partners', 'public');
        }

        $partner = Partner::create([
            'name'        => $request->name,
            'logo_path'   => $logoPath,
            'website_url' => $request->website_url,
            'map_url'     => $request->map_url,
            'description' => $request->description,
            'is_active'   => filter_var($request->is_active ?? true, FILTER_VALIDATE_BOOLEAN),
            'sort_order'  => $request->sort_order ?? 0,
        ]);

        return response()->json($partner, 201);
    }

    public function update(Request $request, $id)
    {
        $partner = Partner::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name'        => 'nullable|string|max:255',
            'logo'        => 'nullable|image|mimes:jpeg,jpg,png,webp,svg|max:5120',
            'website_url' => 'nullable|string|max:500',
            'map_url'     => 'nullable|string|max:1000',
            'description' => 'nullable|string',
            'is_active'   => 'nullable',
            'sort_order'  => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $logoPath = $partner->logo_path;
        if ($request->hasFile('logo')) {
            if ($logoPath) Storage::disk('public')->delete($logoPath);
            $logoPath = $request->file('logo')->store('partners', 'public');
        }

        $partner->update([
            'name'        => $request->input('name', $partner->name),
            'logo_path'   => $logoPath,
            'website_url' => $request->input('website_url', $partner->website_url),
            'map_url'     => $request->input('map_url', $partner->map_url),
            'description' => $request->input('description', $partner->description),
            'is_active'   => $request->input('is_active') === null ? $partner->is_active : ($request->input('is_active') == '1'),
            'sort_order'  => $request->input('sort_order', $partner->sort_order),
        ]);

        return response()->json($partner->fresh());
    }

    public function destroy($id)
    {
        $partner = Partner::findOrFail($id);

        if ($partner->logo_path) {
            Storage::disk('public')->delete($partner->logo_path);
        }

        $partner->delete();

        return response()->json(['message' => 'Partner deleted successfully']);
    }
}
