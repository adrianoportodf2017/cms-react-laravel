<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PageSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        // tenta usar um usuário existente como autor; se não houver, deixa null
        $author = DB::table('users')->select('id','name')->first();
        $authorId = $author->id ?? null;
        $authorName = $author->name ?? null;

        // pega algumas categorias
        $categories = DB::table('categories')->pluck('id','slug'); // slug => id

        // IDs pré-gerados para referenciar parent/child
        $homeId   = (string) Str::uuid();
        $blogId   = (string) Str::uuid();
        $sobreId  = (string) Str::uuid();
        $post1Id  = (string) Str::uuid();
        $post2Id  = (string) Str::uuid();

        // ROOTS (menu principal)
        DB::table('pages')->insert([
            [
                'id'            => $homeId,
                'name'          => 'Home',
                'slug'          => 'home',
                'content'       => json_encode([
                    'type' => 'tiptap-html',
                    'html' => '<section class="container mx-auto py-16"><h1 class="text-3xl font-bold">Bem-vindo</h1><p>Esta é a página inicial.</p></section>',
                ]),
                'status'        => 'published',
                'category_id'   => $categories['institucional'] ?? null,
                'is_featured'   => true,
                'display_order' => 1,
                'in_main_menu'  => true,
                'parent_id'     => null,
                'author_id'     => $authorId,
                'author_name'   => $authorName,
                'created_at'    => $now,
                'updated_at'    => $now,
            ],
            [
                'id'            => $blogId,
                'name'          => 'Blog',
                'slug'          => 'blog',
                'content'       => json_encode([
                    'type' => 'tiptap-html',
                    'html' => '<section class="container mx-auto py-16"><h1 class="text-3xl font-bold">Blog</h1><p>Lista de artigos.</p></section>',
                ]),
                'status'        => 'published',
                'category_id'   => $categories['blog'] ?? null,
                'is_featured'   => true,
                'display_order' => 2,
                'in_main_menu'  => true,
                'parent_id'     => null,
                'author_id'     => $authorId,
                'author_name'   => $authorName,
                'created_at'    => $now,
                'updated_at'    => $now,
            ],
            [
                'id'            => $sobreId,
                'name'          => 'Sobre',
                'slug'          => 'sobre',
                'content'       => json_encode([
                    'type' => 'tiptap-html',
                    'html' => '<section class="container mx-auto py-16"><h1 class="text-3xl font-bold">Sobre nós</h1><p>Informações institucionais.</p></section>',
                ]),
                'status'        => 'published',
                'category_id'   => $categories['institucional'] ?? null,
                'is_featured'   => false,
                'display_order' => 3,
                'in_main_menu'  => true,
                'parent_id'     => null,
                'author_id'     => $authorId,
                'author_name'   => $authorName,
                'created_at'    => $now,
                'updated_at'    => $now,
            ],
        ]);

        // CHILDREN (submenu do Blog)
        DB::table('pages')->insert([
            [
                'id'            => $post1Id,
                'name'          => 'Primeiro Post',
                'slug'          => 'primeiro-post',
                'content'       => json_encode([
                    'type' => 'tiptap-html',
                    'html' => '<article class="prose mx-auto"><h1>Primeiro Post</h1><p>Conteúdo do post.</p></article>',
                ]),
                'status'        => 'published',
                'category_id'   => $categories['blog'] ?? null,
                'is_featured'   => false,
                'display_order' => 1,
                'in_main_menu'  => true,      // aparece como submenu em "Blog"
                'parent_id'     => $blogId,   // <- chave para hierarquia
                'author_id'     => $authorId,
                'author_name'   => $authorName,
                'created_at'    => $now,
                'updated_at'    => $now,
            ],
            [
                'id'            => $post2Id,
                'name'          => 'Segundo Post',
                'slug'          => 'segundo-post',
                'content'       => json_encode([
                    'type' => 'tiptap-html',
                    'html' => '<article class="prose mx-auto"><h1>Segundo Post</h1><p>Outro conteúdo.</p></article>',
                ]),
                'status'        => 'draft',
                'category_id'   => $categories['blog'] ?? null,
                'is_featured'   => false,
                'display_order' => 2,
                'in_main_menu'  => true,
                'parent_id'     => $blogId,
                'author_id'     => $authorId,
                'author_name'   => $authorName,
                'created_at'    => $now,
                'updated_at'    => $now,
            ],
        ]);
    }
}
