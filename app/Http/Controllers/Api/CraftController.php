<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Craft;
use Illuminate\Http\Request;

class CraftController extends Controller
{
    public function index(Request $request)
    {
        $query = Craft::query()
            ->when($request->search, fn($q) => $q->where('title', 'like', "%{$request->search}%"));

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

    public function featured()
    {
        return response()->json(Craft::featured()->latest()->paginate(20));
    }

    public function show($id)
    {
        $craft = Craft::findOrFail($id);
        return response()->json($craft);
    }
}
