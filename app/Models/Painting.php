<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Painting extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'artist',
        'price',
        'quantity',
        'size',
        'medium',
        'year',
        'is_featured',
        'is_available'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_featured' => 'boolean',
        'is_available' => 'boolean',
    ];

    protected $appends = ['primary_image', 'all_images'];

    // Relationship: A painting has many images
    public function images()
    {
        return $this->hasMany(PaintingImage::class)->orderBy('order');
    }

    // Get primary image URL
    public function getPrimaryImageAttribute()
    {
        $primary = $this->images()
            ->where('is_primary', true)
            ->first();

        if ($primary) {
            return asset('storage/' . $primary->image_path);
        }

        // If no primary image, return first image
        $first = $this->images()->first();
        if ($first) {
            return asset('storage/' . $first->image_path);
        }

        // No images at all, return null
        return null;
    }

    // Get all images as an array
    public function getAllImagesAttribute()
    {
        return $this->images->map(function($image) {
            return [
                'id' => $image->id,
                'url' => asset('storage/' . $image->image_path),
                'is_primary' => $image->is_primary,
                'order' => $image->order
            ];
        });
    }

    // Get only available paintings
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true)
                     ->where('quantity', '>', 0);
    }

    // Get only featured paintings
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
}