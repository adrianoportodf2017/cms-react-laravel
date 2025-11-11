<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Page extends Model
{
    use HasFactory, HasUuids; // ✅ ADICIONE HasUuids

    // ✅ ADICIONE estas configurações para UUID
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id', // ✅ ADICIONE o id aqui também
        'name',
        'slug',
        'content',
        'featured_image',
        'status',
        'category_id',
        'parent_id',
        'in_main_menu',
        'display_order',
        'is_featured',
        'author_name',
        'icon',
        'button_label',
        'action',
    ];

    protected $attributes = [
        'content' => '{"html":"","type":"tiptap-html"}',
    ];

    protected $casts = [
        'content' => 'array',
        'in_main_menu' => 'boolean',
        'is_featured' => 'boolean',
    ];

    public function children()
    {
        return $this->hasMany(Page::class, 'parent_id')->orderBy('display_order');
    }

    public function parent()
    {
        return $this->belongsTo(Page::class, 'parent_id');
    }

    // ✅ ADICIONE este método para gerar UUID automaticamente
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }
}