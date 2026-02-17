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
    $query = Painting::with('images')
        ->when($request->search, fn($q) => $q->where('title', 'like', "%{$request->search}%"))
        ->when($request->artist, fn($q) => $q->where('artist', $request->artist));

    match($request->sort) {
        'price_asc'  => $query->orderBy('price', 'asc'),
        'price_desc' => $query->orderBy('price', 'desc'),
        'title_asc'  => $query->orderBy('title', 'asc'),
        'title_desc' => $query->orderBy('title', 'desc'),
        'oldest'     => $query->oldest(),
        default      => $query->latest(),
    };

    return response()->json($query->paginate(20));
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