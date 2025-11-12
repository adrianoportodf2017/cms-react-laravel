<?php

namespace App\Http\Requests\Page;

use Illuminate\Foundation\Http\FormRequest;

class StorePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:180'],
            'slug' => ['nullable', 'string', 'max:200', 'regex:/^[a-z0-9-]+$/', 'unique:pages,slug'], // ✅ Mudei para nullable
            'content' => ['required', 'array'],
            
            // ✅ REMOVA essas linhas:
            // 'content.type' => ['required', 'in:tiptap-html'],
            // 'content.html' => ['required', 'string'],
            
            // ✅ ADICIONE essas (ambas opcionais):
            'content.html' => ['sometimes', 'string'],
            'content.puck' => ['sometimes', 'array'],
            
            'status' => ['required', 'in:draft,published,archived'],

            'category_id'   => ['nullable', 'uuid'],
            'parent_id'     => ['nullable', 'uuid'],
            'author_id'     => ['nullable', 'uuid'],
            'author_name'   => ['nullable', 'string', 'max:150'],

            'is_featured'   => ['sometimes', 'boolean'],
            'in_main_menu'  => ['sometimes', 'boolean'],
            'display_order' => ['sometimes', 'integer', 'min:0', 'max:100000'],

            'icon'          => ['nullable', 'string', 'max:100'],
            'button_label'  => ['nullable', 'string', 'max:150'],
            'action'        => ['nullable', 'string', 'max:150'],
            'featured_image'=> ['nullable', 'image', 'max:2048'],
        ];
    }
}