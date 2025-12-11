<?php

namespace App\Http\Requests\News;

use Illuminate\Foundation\Http\FormRequest;

class StoreNewsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'regex:/^[a-z0-9-]+$/', 'unique:news,slug'],
            'summary' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'array'],
            'content.html' => ['sometimes', 'string'],
            'content.puck' => ['sometimes', 'array'],
            'content.grapesjs' => ['sometimes', 'array'],
            
            'status' => ['required', 'in:draft,published,archived'],
            'featured_image' => ['nullable', 'image', 'max:2048'],

            'category_id' => ['nullable', 'uuid', 'exists:categories,id'],
            'author_id' => ['nullable', 'uuid', 'exists:users,id'],
            'author_name' => ['nullable', 'string', 'max:150'],

            'is_featured' => ['sometimes', 'boolean'],
            'display_order' => ['sometimes', 'integer', 'min:0', 'max:100000'],

            'published_at' => ['nullable', 'date'],
            'archived_at' => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'The title is required.',
            'title.max' => 'The title cannot exceed 255 characters.',
            'slug.unique' => 'This slug is already in use.',
            'slug.regex' => 'The slug must contain only lowercase letters, numbers, and hyphens.',
            'content.required' => 'The content is required.',
            'status.required' => 'The status is required.',
            'status.in' => 'The status must be: draft, published, or archived.',
            'featured_image.image' => 'The featured image must be a valid image file.',
            'featured_image.max' => 'The featured image cannot exceed 2MB.',
        ];
    }
}