<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaintingImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'painting_id',
        'image_path',
        'order',
        'is_primary'
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    // Relationship: An image belongs to a painting
    public function painting()
    {
        return $this->belongsTo(Painting::class);
    }
}