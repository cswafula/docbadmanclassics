<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Craft;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class AdminCraftController extends Controller
{
    public function index(Request $request)
    {
        $query = Craft::latest();

        if ($request->has('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        return response()->json($query->paginate(20));
    }

    public function show($id)
    {
        return response()->json(Craft::findOrFail($id));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title'        => 'required|string|max:255',
            'description'  => 'required|string',
            'price'        => 'required|numeric|min:0',
            'quantity'     => 'required|integer|min:0',
            'is_featured'  => 'nullable',
            'is_available' => 'nullable',
            'image'        => 'nullable|image|mimes:jpeg,jpg,png,webp|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('crafts', 'public');
        }

        $craft = Craft::create([
            'title'        => $request->title,
            'description'  => $request->description,
            'price'        => $request->price,
            'quantity'     => $request->quantity,
            'image_path'   => $imagePath,
            'is_featured'  => filter_var($request->is_featured, FILTER_VALIDATE_BOOLEAN),
            'is_available' => filter_var($request->is_available ?? true, FILTER_VALIDATE_BOOLEAN),
        ]);

        return response()->json($craft, 201);
    }

    public function update(Request $request, $id)
    {
        $craft = Craft::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title'        => 'nullable|string|max:255',
            'description'  => 'nullable|string',
            'price'        => 'nullable|numeric|min:0',
            'quantity'     => 'nullable|integer|min:0',
            'is_featured'  => 'nullable',
            'is_available' => 'nullable',
            'image'        => 'nullable|image|mimes:jpeg,jpg,png,webp|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $imagePath = $craft->image_path;
        if ($request->hasFile('image')) {
            // Delete old image
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }
            $imagePath = $request->file('image')->store('crafts', 'public');
        }

        $craft->update([
            'title'        => $request->input('title', $craft->title),
            'description'  => $request->input('description', $craft->description),
            'price'        => $request->input('price', $craft->price),
            'quantity'     => $request->input('quantity', $craft->quantity),
            'image_path'   => $imagePath,
            'is_featured'  => $request->input('is_featured') == '1',
            'is_available' => $request->input('is_available', '1') == '1',
        ]);

        return response()->json($craft->fresh());
    }

    public function destroy($id)
    {
        $craft = Craft::findOrFail($id);

        if ($craft->image_path) {
            Storage::disk('public')->delete($craft->image_path);
        }

        DB::table('order_items')->where('craft_id', $craft->id)->update(['craft_id' => null]);

        $craft->delete();

        return response()->json(['message' => 'Craft deleted successfully']);
    }
}
