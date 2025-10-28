import { FileText, Image, Users, Settings } from 'lucide-react';

// Componente reutilizável para páginas em construção
function ComingSoonPage({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 text-white">
          {icon}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
        <p className="text-gray-500 mb-8">{description}</p>
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-lg">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Em desenvolvimento</span>
        </div>
      </div>
    </div>
  );
}

// Página de Páginas
export function PagesPage() {
  return (
    <ComingSoonPage
      icon={<FileText className="w-10 h-10" />}
      title="Gerenciador de Páginas"
      description="Aqui você poderá criar, editar e gerenciar todas as páginas do seu site."
    />
  );
}

// Página de Mídia
export function MediaPage() {
  return (
    <ComingSoonPage
      icon={<Image className="w-10 h-10" />}
      title="Biblioteca de Mídia"
      description="Faça upload e organize imagens, vídeos e outros arquivos de mídia."
    />
  );
}

// Página de Usuários
export function UsersPage() {
  return (
    <ComingSoonPage
      icon={<Users className="w-10 h-10" />}
      title="Gerenciamento de Usuários"
      description="Adicione, edite e gerencie os usuários que têm acesso ao painel administrativo."
    />
  );
}

// Página de Configurações
export function SettingsPage() {
  return (
    <ComingSoonPage
      icon={<Settings className="w-10 h-10" />}
      title="Configurações do Sistema"
      description="Configure opções gerais, SEO, integrações e preferências do site."
    />
  );
}