<?php

namespace App\Http\Requests\Page;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'name' => ['sometimes', 'string', 'max:180'],
            'slug' => ['sometimes', 'string', 'max:200', 'regex:/^[a-z0-9-]+$/', Rule::unique('pages', 'slug')->ignore($id, 'id')],
            'content' => ['sometimes', 'array'],
            
            // ✅ REMOVA ou torne opcional essa linha:
            // 'content.type' => ['sometimes', 'in:tiptap-html'],
            
            // ✅ ADICIONE suporte ao Puck:
            'content.html' => ['sometimes', 'string'],
            'content.puck' => ['sometimes', 'array'], // ✅ Aceita dados do Puck
            
            'status' => ['sometimes', 'in:draft,published,archived'],

            'category_id'   => ['sometimes', 'nullable', 'uuid'],
            'parent_id'     => ['sometimes', 'nullable', 'uuid', 'different:id'],
            'author_id'     => ['sometimes', 'nullable', 'uuid'],
            'author_name'   => ['sometimes', 'nullable', 'string', 'max:150'],

            'is_featured'   => ['sometimes', 'boolean'],
            'in_main_menu'  => ['sometimes', 'boolean'],
            'display_order' => ['sometimes', 'integer', 'min:0', 'max:100000'],

            'icon'          => ['sometimes', 'nullable', 'string', 'max:100'],
            'button_label'  => ['sometimes', 'nullable', 'string', 'max:150'],
            'action'        => ['sometimes', 'nullable', 'string', 'max:150'],
            'featured_image'=> ['sometimes', 'nullable', 'image', 'max:2048'],
        ];
    }
}