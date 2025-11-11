<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PageResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'         => (string) $this->id,
            'name'       => $this->name,
            'slug'       => $this->slug,
            'content'    => $this->content,
            'status'     => $this->status,
            'category_id'=> $this->category_id,
            'is_featured'=> (bool) $this->is_featured,
            'display_order' => (int) $this->display_order,
            'in_main_menu'  => (bool) $this->in_main_menu,
            'parent_id'     => $this->parent_id,
            'author_id'     => $this->author_id,
            'author_name'   => $this->author_name,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
