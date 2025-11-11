<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Page;

class PagesMenuSeeder extends Seeder
{
    public function run(): void
    {
        // Limpa a tabela antes de inserir
        Page::truncate();

        /**
         * 🔹 SOBRE NÓS
         */
        $sobreNos = Page::create([
            'name' => 'Sobre Nós',
            'slug' => 'sobre-nos',
            'status' => 'published',
            'in_main_menu' => true,
            'display_order' => 1,
            'is_featured' => false,
            'featured_image' => 'pages/sobre-nos.jpg',
            'icon' => 'info',
            'button_label' => null,
            'action' => 'link',
            'content' => json_encode(['html' => '<p>Sobre Nós</p>', 'type' => 'tiptap-html']),
        ]);

        // Cria as páginas filhas individualmente para obter IDs automáticos
        $historia = Page::create([
            'name' => 'História e Ideologia',
            'slug' => 'historia-e-ideologia',
            'status' => 'published',
            'parent_id' => $sobreNos->id,
            'display_order' => 1,
            'featured_image' => 'pages/historia.jpg',
            'content' => json_encode(['html' => '<p>Sobre Nós - História e Ideologia</p>', 'type' => 'tiptap-html']),
        ]);

        $proposito = Page::create([
            'name' => 'Propósito, Valores e Negócio',
            'slug' => 'proposito-valores-negocio',
            'status' => 'published',
            'parent_id' => $sobreNos->id,
            'display_order' => 2,
            'featured_image' => 'pages/valores.jpg',
            'content' => json_encode(['html' => '<p>Sobre Nós - Propósito, Valores e Negócio</p>', 'type' => 'tiptap-html']),
        ]);

        $governanca = Page::create([
            'name' => 'Governança',
            'slug' => 'governanca',
            'status' => 'published',
            'parent_id' => $sobreNos->id,
            'display_order' => 3,
            'featured_image' => 'pages/governanca.jpg',
            'content' => json_encode(['html' => '<p>Sobre Nós - Governança</p>', 'type' => 'tiptap-html']),
        ]);

        /**
         * 🔹 PROJETOS E EDITAIS
         */
        $projetosEditais = Page::create([
            'name' => 'Projetos e Editais',
            'slug' => 'projetos-editais',
            'status' => 'published',
            'in_main_menu' => true,
            'display_order' => 2,
            'is_featured' => false,
            'featured_image' => 'pages/projetos-editais.jpg',
            'icon' => 'folder',
            'action' => 'link',
            'content' => json_encode(['html' => '<p>Projetos e Editais</p>', 'type' => 'tiptap-html']),
        ]);

        // Cria as páginas filhas individualmente
        $projetos = Page::create([
            'name' => 'Projetos',
            'slug' => 'projetos',
            'status' => 'published',
            'parent_id' => $projetosEditais->id,
            'display_order' => 1,
            'featured_image' => 'pages/projetos.jpg',
            'content' => json_encode(['html' => '<p>Projetos e Editais - Projetos</p>', 'type' => 'tiptap-html']),
        ]);

        $editais = Page::create([
            'name' => 'Editais',
            'slug' => 'editais',
            'status' => 'published',
            'parent_id' => $projetosEditais->id,
            'display_order' => 2,
            'featured_image' => 'pages/editais.jpg',
            'content' => json_encode(['html' => '<p>Projetos e Editais - Editais</p>', 'type' => 'tiptap-html']),
        ]);

        $acoesSolidarias = Page::create([
            'name' => 'Programas Ações Solidárias',
            'slug' => 'acoes-solidarias',
            'status' => 'published',
            'parent_id' => $projetosEditais->id,
            'display_order' => 3,
            'featured_image' => 'pages/acoes-solidarias.jpg',
            'content' => json_encode(['html' => '<p>Projetos e Editais - Programas Ações Solidárias</p>', 'type' => 'tiptap-html']),
        ]);

        /**
         * 🔹 TRANSPARÊNCIA
         */
        Page::create([
            'name' => 'Transparência',
            'slug' => 'transparencia',
            'status' => 'published',
            'in_main_menu' => true,
            'display_order' => 3,
            'featured_image' => 'pages/transparencia.jpg',
            'icon' => 'eye',
            'action' => 'link',
            'content' => json_encode(['html' => '<p>Transparência</p>', 'type' => 'tiptap-html']),
        ]);

        /**
         * 🔹 DOE
         */
        Page::create([
            'name' => 'Doe',
            'slug' => 'doe',
            'status' => 'published',
            'in_main_menu' => true,
            'display_order' => 4,
            'is_featured' => true,
            'featured_image' => 'pages/doe.jpg',
            'icon' => 'heart',
            'button_label' => 'Doe',
            'action' => 'link',
            'content' => json_encode(['html' => '<p>Doe</p>', 'type' => 'tiptap-html']),
        ]);

        /**
         * 🔹 ASSOCIE-SE
         */
        Page::create([
            'name' => 'Associe-se',
            'slug' => 'associe-se',
            'status' => 'published',
            'in_main_menu' => true,
            'display_order' => 5,
            'is_featured' => true,
            'featured_image' => 'pages/associe-se.jpg',
            'icon' => 'user-plus',
            'button_label' => 'Associe-se',
            'action' => 'link',
            'content' => json_encode(['html' => '<p>Associe-se</p>', 'type' => 'tiptap-html']),
        ]);

        /**
         * 🔹 NOTÍCIAS
         */
        Page::create([
            'name' => 'Notícias',
            'slug' => 'noticias',
            'status' => 'published',
            'in_main_menu' => true,
            'display_order' => 6,
            'featured_image' => 'pages/noticias.jpg',
            'icon' => 'newspaper',
            'action' => 'link',
            'content' => json_encode(['html' => '<p>Notícias</p>', 'type' => 'tiptap-html']),
        ]);

        /**
         * 🔹 CONTATO
         */
        Page::create([
            'name' => 'Contato',
            'slug' => 'contato',
            'status' => 'published',
            'in_main_menu' => true,
            'display_order' => 7,
            'featured_image' => 'pages/contato.jpg',
            'icon' => 'phone',
            'action' => 'link',
            'content' => json_encode(['html' => '<p>Contato</p>', 'type' => 'tiptap-html']),
        ]);

        /**
         * 🔹 ITENS DE MENU INFERIOR (ex: footer, mobile bottom)
         */
        Page::create([
            'name' => 'Associe-se (Bottom)',
            'slug' => 'associe-se-bottom',
            'status' => 'published',
            'in_main_menu' => false,
            'is_featured' => true,
            'featured_image' => null,
            'icon' => 'user-plus',
            'button_label' => 'Associe-se',
            'action' => 'link',
            'display_order' => 100,
            'content' => json_encode(['html' => '<p>Associe-se (Bottom)</p>', 'type' => 'tiptap-html']),
        ]);

        Page::create([
            'name' => 'Menu (Bottom)',
            'slug' => 'menu-bottom',
            'status' => 'published',
            'in_main_menu' => false,
            'icon' => 'menu',
            'action' => 'toggle-menu',
            'display_order' => 101,
            'content' => json_encode(['html' => '<p>Menu (Bottom)</p>', 'type' => 'tiptap-html']),
        ]);

        Page::create([
            'name' => 'Contato (Bottom)',
            'slug' => 'contato-bottom',
            'status' => 'published',
            'in_main_menu' => false,
            'icon' => 'phone',
            'button_label' => 'Contato',
            'action' => 'link',
            'display_order' => 102,
            'content' => json_encode(['html' => '<p>Contato (Bottom)</p>', 'type' => 'tiptap-html']),
        ]);
    }
}