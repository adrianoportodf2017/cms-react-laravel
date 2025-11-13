<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'media';

    protected $fillable = [
        'user_id',
        'filename',
        'path',
        'url',
        'size',
        'type',
        'mime_type',
        'extension',
        'category',
        'title',
        'description',
        'alt_text',
        'width',
        'height',
        'duration',
        'status',
        'published_at',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'size' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
        'duration' => 'integer',
        'published_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * User relationship
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Accessor for formatted size
     */
    public function getSizeFormattedAttribute(): string
    {
        $bytes = $this->size;
        
        if ($bytes >= 1073741824) {
            return number_format($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        } else {
            return $bytes . ' bytes';
        }
    }

    /**
     * Check if is image
     */
    public function isImage(): bool
    {
        return $this->type === 'image';
    }

    /**
     * Check if is video
     */
    public function isVideo(): bool
    {
        return $this->type === 'video';
    }

    /**
     * Check if is PDF
     */
    public function isPdf(): bool
    {
        return $this->type === 'pdf';
    }

    /**
     * Delete physical file from storage
     */
    public function deleteFile(): bool
    {
        if (Storage::disk('public')->exists($this->path)) {
            return Storage::disk('public')->delete($this->path);
        }
        
        return false;
    }

    /**
     * Delete file only when manually deleting media
     */
    protected static function booted()
    {
        static::deleting(function ($media) {
            if ($media->isForceDeleting()) {
                $media->deleteFile();
            }
        });
    }
}