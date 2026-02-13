<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Painting;
use Illuminate\Http\Request;

class PaintingController extends Controller
{
    /**
     * Get all available paintings for the gallery
     */
    public function index(Request $request)
    {
        $query = Painting::with('images')->available();

        // Filter by artist
        if ($request->has('artist')) {
            $query->where('artist', 'like', '%' . $request->artist . '%');
        }

        // Filter by price range
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('artist', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $paintings = $query->paginate($request->get('per_page', 12));

        return response()->json($paintings);
    }

    /**
     * Get featured paintings
     */
    public function featured()
    {
        $paintings = Painting::with('images')
            ->available()
            ->featured()
            ->limit(6)
            ->get();

        return response()->json($paintings);
    }

    /**
     * Get single painting details
     */
    public function show($id)
    {
        $painting = Painting::with('images')->findOrFail($id);

        return response()->json($painting);
    }

    /**
     * Get unique artists
     */
    public function artists()
    {
        $artists = Painting::select('artist')
            ->distinct()
            ->orderBy('artist')
            ->pluck('artist');

        return response()->json($artists);
    }
}