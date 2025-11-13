<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\PageResource;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Http\Requests\Page\StorePageRequest;
use App\Http\Requests\Page\UpdatePageRequest;

class PageController extends Controller
{
    // GET /pages
    public function index(Request $request)
    {
        $perPage  = (int) ($request->integer('per_page') ?: 10);
        $pageNum  = (int) ($request->integer('page') ?: 1);

        $status   = $request->get('status');
        $search   = $request->get('search');
        $catId    = $request->get('category_id');
        $featured = $request->has('is_featured') ? $request->boolean('is_featured') : null;
        $inMenu   = $request->has('in_main_menu') ? $request->boolean('in_main_menu') : null;
        $parentId = $request->get('parent_id');
        $authorId = $request->get('author_id');

        $query = Page::query();

        if ($status)   $query->where('status', $status);
        if ($catId)    $query->where('category_id', $catId);
        if (!is_null($featured)) $query->where('is_featured', $featured);
        if (!is_null($inMenu))   $query->where('in_main_menu', $inMenu);
        if ($parentId !== null)  $query->where('parent_id', $parentId);
        if ($authorId) $query->where('author_id', $authorId);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%")
                  ->orWhere('content->html', 'like', "%{$search}%");
            });
        }

        $query->orderBy('display_order')->orderBy('name');

        $paginator = $query->paginate($perPage, ['*'], 'page', $pageNum);

        return response()->json([
            'data'     => PageResource::collection($paginator->items()),
            'total'    => $paginator->total(),
            'page'     => $paginator->currentPage(),
            'per_page' => $paginator->perPage(),
        ]);
    }

    // POST /pages
    public function store(StorePageRequest $request)
    {
        $data = $request->validated();

        // 🔹 Upload da imagem destacada
        if ($request->hasFile('featured_image')) {
            $data['featured_image'] = $request->file('featured_image')->store('pages', 'public');
        }

        $page = Page::create($data);

        return response()->json([
            'data'    => new PageResource($page),
            'message' => 'Página criada com sucesso.',
        ], 201);
    }

    // GET /pages/{key}
    public function show(string $key)
    {
        $page = Str::isUuid($key)
            ? Page::findOrFail($key)
            : Page::where('slug', $key)->firstOrFail();

        return response()->json([
            'data' => new PageResource($page),
        ]);
    }

    // PUT /pages/{id}
    public function update(UpdatePageRequest $request, string $id)
    {
        $page = Page::findOrFail($id);
        $data = $request->validated();

        // 🔹 Substituição da imagem destacada (se enviada)
        if ($request->hasFile('featured_image')) {
            // apaga a antiga se existir
            if ($page->featured_image && Storage::disk('public')->exists($page->featured_image)) {
                Storage::disk('public')->delete($page->featured_image);
            }
            $data['featured_image'] = $request->file('featured_image')->store('pages', 'public');
        }

        $page->update($data);

        return response()->json([
            'data'    => new PageResource($page->fresh()),
            'message' => 'Página atualizada com sucesso.',
        ]);
    }

    // DELETE /pages/{id}
    public function destroy(string $id)
    {
        $page = Page::findOrFail($id);

        // 🔹 Remove imagem destacada do storage
        if ($page->featured_image && Storage::disk('public')->exists($page->featured_image)) {
            Storage::disk('public')->delete($page->featured_image);
        }

        $page->delete();

        return response()->noContent();
    }

    // PATCH /pages/{id}/publish
    public function publish(string $id)
    {
        $page = Page::findOrFail($id);
        $page->update(['status' => 'published']);

        return response()->json([
            'data'    => new PageResource($page),
            'message' => 'Página publicada.',
        ]);
    }

    // PATCH /pages/{id}/archive
    public function archive(string $id)
    {
        $page = Page::findOrFail($id);
        $page->update(['status' => 'archived']);

        return response()->json([
            'data'    => new PageResource($page),
            'message' => 'Página arquivada.',
        ]);
    }

    // POST /pages/{id}/duplicate
    public function duplicate(string $id)
    {
        $page = Page::findOrFail($id);

        $copy = $page->replicate();
        $copy->id = (string) Str::uuid();
        $copy->name = $page->name . ' (Cópia)';
        $copy->slug = $this->uniqueSlug($page->slug . '-copy');
        $copy->status = 'draft';
        $copy->push();

        return response()->json([
            'data'    => new PageResource($copy),
            'message' => 'Página duplicada (como rascunho).',
        ], 201);
    }

    private function uniqueSlug(string $base): string
    {
        $slug = Str::slug($base);
        $i = 1;
        while (Page::where('slug', $slug)->exists()) {
            $slug = Str::slug($base . '-' . $i);
            $i++;
        }
        return $slug;
    }

    // GET /menu — Menu dinâmico com subpáginas e imagem
    public function menu()
    {
        $pages = Page::where('status', 'published')
            ->where('in_main_menu', true)
            ->whereNull('parent_id')
            ->orderBy('display_order')
            ->with(['children' => function ($q) {
                $q->where('in_main_menu', true)->where('status', 'published')->orderBy('display_order');
            }])
            ->get();

        return response()->json([
            'menuItems' => $pages->map(fn ($page) => [
                'id' => $page->slug,
                'title' => $page->name,
                'link' => "/{$page->slug}",
                'icon' => $page->icon,
                'image' => $page->featured_image ? asset('storage/' . $page->featured_image) : null,
                'action' => $page->action,
                'buttonLabel' => $page->button_label,
                'hasDropdown' => $page->children->isNotEmpty(),
                'submenu' => $page->children->map(fn ($child) => [
                    'title' => $child->name,
                    'link' => "/{$child->slug}",
                    'description' => $child->content['html'] ?? '',
                    'image' => $child->featured_image ? asset('storage/' . $child->featured_image) : null,
                ]),
            ]),
        ]);
    }
}
