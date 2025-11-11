<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $items = [
            ['name' => 'Institucional',  'slug' => 'institucional'],
            ['name' => 'Blog',           'slug' => 'blog'],
            ['name' => 'Landing Pages',  'slug' => 'landing-pages'],
        ];

        foreach ($items as $item) {
            DB::table('categories')->insert([
                'id'          => (string) Str::uuid(),
                'name'        => $item['name'],
                'slug'        => $item['slug'],
                'description' => null,
                'created_at'  => $now,
                'updated_at'  => $now,
            ]);
        }
    }
}
