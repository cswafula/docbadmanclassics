<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Painting;
use App\Models\PaintingImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AdminPaintingController extends Controller
{
    // Get all paintings (admin sees everything)
    public function index(Request $request)
    {
        $query = Painting::with('images')->latest();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('artist', 'like', "%{$search}%");
            });
        }

        return response()->json($query->paginate(20));
    }

    // Get single painting
    public function show($id)
    {
        $painting = Painting::with('images')->findOrFail($id);
        return response()->json($painting);
    }

    // Create new painting
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title'       => 'required|string|max:255',
            'artist'      => 'required|string|max:255',
            'description' => 'required|string',
            'price'       => 'required|numeric|min:0',
            'quantity'    => 'required|integer|min:0',
            'medium'      => 'nullable|string|max:100',
            'size'        => 'nullable|string|max:100',
            'year'        => 'nullable|integer|min:1800|max:2030',
            'is_featured' => 'nullable',
            'is_available'=> 'nullable',
            'images'      => 'nullable|array',
            'images.*'    => 'image|mimes:jpeg,jpg,png,webp|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $painting = Painting::create([
            'title'        => $request->title,
            'artist'       => $request->artist,
            'description'  => $request->description,
            'price'        => $request->price,
            'quantity'     => $request->quantity,
            'medium'       => $request->medium,
            'size'         => $request->size,
            'year'         => $request->year,
            'is_featured'  => filter_var($request->is_featured, FILTER_VALIDATE_BOOLEAN),
            'is_available' => filter_var($request->is_available ?? true, FILTER_VALIDATE_BOOLEAN),
        ]);

        // Handle image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('paintings', 'public');

                PaintingImage::create([
                    'painting_id' => $painting->id,
                    'image_path'  => $path,
                    'order'       => $index,
                    'is_primary'  => $index === 0,
                ]);
            }
        }

        return response()->json($painting->load('images'), 201);
    }

    // Update painting
    public function update(Request $request, $id)
{
    $painting = Painting::findOrFail($id);

    $validator = Validator::make($request->all(), [
        'title'        => 'nullable|string|max:255',
        'artist'       => 'nullable|string|max:255',
        'description'  => 'nullable|string',
        'price'        => 'nullable|numeric|min:0',
        'quantity'     => 'nullable|integer|min:0',
        'medium'       => 'nullable|string|max:100',
        'size'         => 'nullable|string|max:100',
        'year'         => 'nullable|integer|min:1800|max:2030',
        'is_featured'  => 'nullable',
        'is_available' => 'nullable',
        'images'       => 'nullable|array',
        'images.*'     => 'image|mimes:jpeg,jpg,png,webp|max:10240',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $painting->update([
        'title'        => $request->input('title', $painting->title),
        'artist'       => $request->input('artist', $painting->artist),
        'description'  => $request->input('description', $painting->description),
        'price'        => $request->input('price', $painting->price),
        'quantity'     => $request->input('quantity', $painting->quantity),
        'medium'       => $request->input('medium', $painting->medium),
        'size'         => $request->input('size', $painting->size),
        'year'         => $request->input('year', $painting->year),
        'is_featured'  => $request->input('is_featured') == '1',
        'is_available' => $request->input('is_available', '1') == '1',
    ]);

    // Add new images if provided
    if ($request->hasFile('images')) {
        $lastOrder = $painting->images()->max('order') ?? -1;

        foreach ($request->file('images') as $index => $image) {
            $path = $image->store('paintings', 'public');

            PaintingImage::create([
                'painting_id' => $painting->id,
                'image_path'  => $path,
                'order'       => $lastOrder + $index + 1,
                'is_primary'  => $painting->images()->count() === 0,
            ]);
        }
    }

    return response()->json($painting->fresh()->load('images'));
}

    // Delete painting
    public function destroy($id)
    {
        $painting = Painting::findOrFail($id);

        // Delete images from storage
        foreach ($painting->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $painting->delete();

        return response()->json(['message' => 'Painting deleted successfully']);
    }
}