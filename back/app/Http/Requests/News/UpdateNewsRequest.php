<?php

namespace App\Http\Requests\News;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateNewsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'slug' => [
                'sometimes', 
                'string', 
                'max:255', 
                'regex:/^[a-z0-9-]+$/', 
                Rule::unique('news', 'slug')->ignore($id, 'id')
            ],
            'summary' => ['sometimes', 'nullable', 'string', 'max:500'],
            'content' => ['sometimes', 'array'],
            'content.html' => ['sometimes', 'string'],
            'content.puck' => ['sometimes', 'array'],
            'content.grapesjs' => ['sometimes', 'array'],
            
            'status' => ['sometimes', 'in:draft,published,archived'],
            'featured_image' => ['sometimes', 'nullable', 'image', 'max:2048'],

            'category_id' => ['sometimes', 'nullable', 'uuid', 'exists:categories,id'],
            'author_id' => ['sometimes', 'nullable', 'uuid', 'exists:users,id'],
            'author_name' => ['sometimes', 'nullable', 'string', 'max:150'],

            'is_featured' => ['sometimes', 'boolean'],
            'display_order' => ['sometimes', 'integer', 'min:0', 'max:100000'],

            'published_at' => ['sometimes', 'nullable', 'date'],
            'archived_at' => ['sometimes', 'nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.max' => 'The title cannot exceed 255 characters.',
            'slug.unique' => 'This slug is already in use.',
            'slug.regex' => 'The slug must contain only lowercase letters, numbers, and hyphens.',
            'status.in' => 'The status must be: draft, published, or archived.',
            'featured_image.image' => 'The featured image must be a valid image file.',
            'featured_image.max' => 'The featured image cannot exceed 2MB.',
        ];
    }
}