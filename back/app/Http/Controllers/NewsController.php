<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\NewsResource;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Http\Requests\News\StoreNewsRequest;
use App\Http\Requests\News\UpdateNewsRequest;

class NewsController extends Controller
{
    // GET /news
    public function index(Request $request)
    {
        $perPage = (int) ($request->integer('per_page') ?: 10);
        $pageNum = (int) ($request->integer('page') ?: 1);

        $status = $request->get('status');
        $search = $request->get('search');
        $catId = $request->get('category_id');
        $featured = $request->has('is_featured') ? $request->boolean('is_featured') : null;
        $authorId = $request->get('author_id');

        $query = News::query();

        if ($status) $query->where('status', $status);
        if ($catId) $query->where('category_id', $catId);
        if (!is_null($featured)) $query->where('is_featured', $featured);
        if ($authorId) $query->where('author_id', $authorId);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('summary', 'like', "%{$search}%")
                    ->orWhere('content->html', 'like', "%{$search}%");
            });
        }

        $query->orderBy('published_at', 'desc')
              ->orderBy('display_order')
              ->orderBy('title');

        $paginator = $query->paginate($perPage, ['*'], 'page', $pageNum);

        return response()->json([
            'data' => NewsResource::collection($paginator->items()),
            'total' => $paginator->total(),
            'page' => $paginator->currentPage(),
            'per_page' => $paginator->perPage(),
        ]);
    }

    // POST /news
    public function store(StoreNewsRequest $request)
    {
        $data = $request->validated();

        // Auto-generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = $this->uniqueSlug(Str::slug($data['title']));
        }

        // Upload featured image
        if ($request->hasFile('featured_image')) {
            $data['featured_image'] = $request->file('featured_image')->store('news', 'public');
        }

        // Set published_at if publishing now
        if ($data['status'] === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        $news = News::create($data);

        return response()->json([
            'data' => new NewsResource($news),
            'message' => 'News created successfully.',
        ], 201);
    }

    // GET /news/{key} - accepts UUID or slug
    public function show(string $key)
    {
        $news = Str::isUuid($key)
            ? News::findOrFail($key)
            : News::where('slug', $key)->firstOrFail();

        return response()->json([
            'data' => new NewsResource($news),
        ]);
    }

    // PUT /news/{id}
    public function update(UpdateNewsRequest $request, string $id)
    {
        $news = News::findOrFail($id);
        $data = $request->validated();

        // Replace featured image if uploaded
        if ($request->hasFile('featured_image')) {
            // Delete old one if exists
            if ($news->featured_image && Storage::disk('public')->exists($news->featured_image)) {
                Storage::disk('public')->delete($news->featured_image);
            }
            $data['featured_image'] = $request->file('featured_image')->store('news', 'public');
        }

        $news->update($data);

        return response()->json([
            'data' => new NewsResource($news->fresh()),
            'message' => 'News updated successfully.',
        ]);
    }

    // DELETE /news/{id}
    public function destroy(string $id)
    {
        $news = News::findOrFail($id);

        // Remove featured image from storage
        if ($news->featured_image && Storage::disk('public')->exists($news->featured_image)) {
            Storage::disk('public')->delete($news->featured_image);
        }

        $news->delete();

        return response()->noContent();
    }

    // PATCH /news/{id}/publish
    public function publish(string $id)
    {
        $news = News::findOrFail($id);
        $news->update([
            'status' => 'published',
            'published_at' => $news->published_at ?? now(),
        ]);

        return response()->json([
            'data' => new NewsResource($news),
            'message' => 'News published.',
        ]);
    }

    // PATCH /news/{id}/archive
    public function archive(string $id)
    {
        $news = News::findOrFail($id);
        $news->update([
            'status' => 'archived',
            'archived_at' => $news->archived_at ?? now(),
        ]);

        return response()->json([
            'data' => new NewsResource($news),
            'message' => 'News archived.',
        ]);
    }

    // POST /news/{id}/duplicate
    public function duplicate(string $id)
    {
        $news = News::findOrFail($id);

        $copy = $news->replicate();
        $copy->id = (string) Str::uuid();
        $copy->title = $news->title . ' (Copy)';
        $copy->slug = $this->uniqueSlug($news->slug . '-copy');
        $copy->status = 'draft';
        $copy->published_at = null;
        $copy->archived_at = null;
        $copy->push();

        return response()->json([
            'data' => new NewsResource($copy),
            'message' => 'News duplicated (as draft).',
        ], 201);
    }

    // GET /news/published - Public endpoint
    public function published(Request $request)
    {
        $perPage = (int) ($request->integer('per_page') ?: 10);
        $catId = $request->get('category_id');
        $featured = $request->has('is_featured') ? $request->boolean('is_featured') : null;

        $query = News::published();

        if ($catId) $query->where('category_id', $catId);
        if (!is_null($featured)) $query->where('is_featured', $featured);

        $query->recent();

        $paginator = $query->paginate($perPage);

        return response()->json([
            'data' => NewsResource::collection($paginator->items()),
            'total' => $paginator->total(),
            'page' => $paginator->currentPage(),
            'per_page' => $paginator->perPage(),
        ]);
    }

    // Private helper
    private function uniqueSlug(string $base): string
    {
        $slug = Str::slug($base);
        $i = 1;
        while (News::where('slug', $slug)->exists()) {
            $slug = Str::slug($base . '-' . $i);
            $i++;
        }
        return $slug;
    }
}