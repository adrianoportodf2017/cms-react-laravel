<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class News extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'news';
    
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'title',
        'slug',
        'summary',
        'content',
        'featured_image',
        'status',
        'category_id',
        'author_id',
        'author_name',
        'is_featured',
        'display_order',
        'published_at',
        'archived_at',
    ];

    protected $attributes = [
        'content' => '{"html":"","type":"grapesjs"}',
    ];

    protected $casts = [
        'content' => 'array',
        'is_featured' => 'boolean',
        'published_at' => 'datetime',
        'archived_at' => 'datetime',
    ];

    // Relationships
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    // Useful scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                    ->whereNotNull('published_at')
                    ->where('published_at', '<=', now());
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('published_at', 'desc');
    }

    // Boot
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });

        // Auto-fill published_at when status changes to 'published'
        static::updating(function ($model) {
            if ($model->isDirty('status')) {
                if ($model->status === 'published' && !$model->published_at) {
                    $model->published_at = now();
                }
                if ($model->status === 'archived' && !$model->archived_at) {
                    $model->archived_at = now();
                }
            }
        });
    }
}