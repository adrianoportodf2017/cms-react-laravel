<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    /**
     * Allowed MIME types
     */
    private const ALLOWED_TYPES = [
        // Images
        'image/jpeg' => ['type' => 'image', 'max_size' => 5120], // 5MB
        'image/jpg' => ['type' => 'image', 'max_size' => 5120],
        'image/png' => ['type' => 'image', 'max_size' => 5120],
        'image/gif' => ['type' => 'image', 'max_size' => 5120],
        'image/webp' => ['type' => 'image', 'max_size' => 5120],
        'image/svg+xml' => ['type' => 'image', 'max_size' => 2048], // 2MB

        // Videos
        'video/mp4' => ['type' => 'video', 'max_size' => 51200], // 50MB
        'video/mpeg' => ['type' => 'video', 'max_size' => 51200],
        'video/quicktime' => ['type' => 'video', 'max_size' => 51200],
        'video/webm' => ['type' => 'video', 'max_size' => 51200],

        // PDFs
        'application/pdf' => ['type' => 'pdf', 'max_size' => 10240], // 10MB

        // Documents
        'application/msword' => ['type' => 'document', 'max_size' => 10240],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => ['type' => 'document', 'max_size' => 10240],
    ];



    /**
     * Upload media
     */
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file',
            'category' => 'nullable|string|max:255',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'alt_text' => 'nullable|string|max:255',
        ]);

        try {
            $file = $request->file('file');
            $mimeType = $file->getMimeType();

            // Validate file type
            if (!isset(self::ALLOWED_TYPES[$mimeType])) {
                return response()->json([
                    'success' => false,
                    'message' => 'File type not allowed',
                ], 422);
            }

            $config = self::ALLOWED_TYPES[$mimeType];

            // Validate size
            if ($file->getSize() > ($config['max_size'] * 1024)) {
                return response()->json([
                    'success' => false,
                    'message' => "File too large. Maximum size: {$config['max_size']}KB",
                ], 422);
            }

            // Generate folder structure: year/month/slug
            $year = date('Y');
            $month = date('m');
            $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $slug = Str::slug($originalName);
            $uuid = Str::uuid();
            $extension = $file->getClientOriginalExtension();

            // Filename: slug-uuid.ext
            $filename = "{$slug}-{$uuid}.{$extension}";

            // Full path: year/month/slug-uuid.ext
            $path = "{$year}/{$month}/{$filename}";

            // Save file
            $path = $file->storeAs(
                "{$year}/{$month}",  // diretório
                $filename,            // nome do arquivo
                'public'              // disco
            );

            // Public URL'
            $url = asset('storage/' . $path);

            // Extract metadata
            $width = null;
            $height = null;
            $duration = null;

            if ($config['type'] === 'image') {
                try {
                    $imageInfo = getimagesize($file->getPathname());
                    if ($imageInfo) {
                        $width = $imageInfo[0];
                        $height = $imageInfo[1];
                    }
                } catch (\Exception $e) {
                    // Ignore metadata errors
                }
            }

            // Create database record
            $media = Media::create([
                'user_id' => auth()->id(),
                'filename' => $file->getClientOriginalName(),
                'path' => $path,
                'url' => $url,
                'size' => $file->getSize(),
                'type' => $config['type'],
                'mime_type' => $mimeType,
                'extension' => $extension,
                'category' => $request->category,
                'title' => $request->title ?? $originalName,
                'description' => $request->description,
                'alt_text' => $request->alt_text,
                'width' => $width,
                'height' => $height,
                'duration' => $duration,
                'status' => 'active',
                'published_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Upload successful',
                'data' => $media,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Upload error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * List media with filters
     */
    public function index(Request $request)
    {
        try {
            $query = Media::with('user:id,Nome,Email')
                ->orderBy('created_at', 'desc');

            // Filters
            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            if ($request->has('category')) {
                $query->where('category', $request->category);
            }

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Orphaned media filter
            if ($request->has('orphaned') && $request->orphaned) {
                $query->whereNull('user_id');
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('filename', 'like', "%{$search}%");
                });
            }

            $perPage = $request->per_page ?? 20;
            $media = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $media,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error listing media: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show specific media
     */
    public function show($id)
    {
        try {
            $media = Media::with('user:id,Nome,Email')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $media,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Media not found',
            ], 404);
        }
    }

    /**
     * Update media information
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'category' => 'nullable|string|max:255',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'alt_text' => 'nullable|string|max:255',
            'status' => 'nullable|in:active,inactive',
        ]);

        try {
            $media = Media::findOrFail($id);

            $media->update([
                'category' => $request->category ?? $media->category,
                'title' => $request->title ?? $media->title,
                'description' => $request->description ?? $media->description,
                'alt_text' => $request->alt_text ?? $media->alt_text,
                'status' => $request->status ?? $media->status,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Media updated successfully',
                'data' => $media,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating media: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete media
     */
    public function destroy($id)
    {
        try {
            $media = Media::findOrFail($id);

            // Delete physical file
            $media->deleteFile();

            // Delete record
            $media->forceDelete();

            return response()->json([
                'success' => true,
                'message' => 'Media deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting media: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Media statistics
     */
    public function stats()
    {
        try {
            $stats = [
                'total' => Media::count(),
                'by_type' => Media::selectRaw('type, COUNT(*) as total')
                    ->groupBy('type')
                    ->get()
                    ->pluck('total', 'type'),
                'total_size' => Media::sum('size'),
                'total_size_formatted' => $this->formatBytes(Media::sum('size')),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching statistics: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * List orphaned media
     */
    public function orphaned()
    {
        try {
            $media = Media::whereNull('user_id')
                ->orderBy('created_at', 'desc')
                ->paginate(20);

            return response()->json([
                'success' => true,
                'data' => $media,
                'total' => $media->total(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error listing orphaned media: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Clean old orphaned media
     */
    public function cleanOrphaned(Request $request)
    {
        $request->validate([
            'days' => 'nullable|integer|min:1',
        ]);

        try {
            $days = $request->days ?? 30;

            $media = Media::whereNull('user_id')
                ->where('created_at', '<', now()->subDays($days))
                ->get();

            $count = 0;
            foreach ($media as $item) {
                $item->deleteFile();
                $item->forceDelete();
                $count++;
            }

            return response()->json([
                'success' => true,
                'message' => "{$count} orphaned media deleted",
                'count' => $count,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error cleaning orphaned media: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Helper: format bytes
     */
    private function formatBytes($bytes)
    {
        if ($bytes >= 1073741824) {
            return number_format($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        }
        return $bytes . ' bytes';
    }
}
