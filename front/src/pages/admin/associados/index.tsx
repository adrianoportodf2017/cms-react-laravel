import React, { useState } from 'react';
import { useListarAssociados, useDeletarAssociado, useAtualizarAssociado } from '../../../services/associados';
import { Trash2, Edit, Eye, X, Save } from 'lucide-react';
import type { Associado, UpdateAssociadoDto } from '../../../types/associado.types';

export const TabelaAssociados = () => {
  const { data, isLoading } = useListarAssociados({ page: 1, por_pagina: 10 });
  const { mutate: deletar, isPending: isDeletando } = useDeletarAssociado();
  const { mutate: atualizar, isPending: isAtualizando } = useAtualizarAssociado();

  const [editando, setEditando] = useState<number | null>(null);
  const [visualizando, setVisualizando] = useState<Associado | null>(null);
  const [formData, setFormData] = useState<UpdateAssociadoDto>({});

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  const associados = data?.data || [];

  const handleEdit = (associado: Associado) => {
    setEditando(associado.id);
    setFormData({
      NomeCompleto: associado.NomeCompleto,
      NumeroDocumento: associado.NumeroDocumento,
      Email: associado.Email,
      Telefone: associado.Telefone,
      DtNascimento: associado.DtNascimento,
      Sexo: associado.Sexo,
      Status: associado.Status,
      Endereco: associado.Endereco,
      Numero: associado.Numero,
      Complemento: associado.Complemento,
      Bairro: associado.Bairro,
      Cidade: associado.Cidade,
      Uf: associado.Uf,
      Cep: associado.Cep,
      ValorContribuicao: associado.ValorContribuicao,
      FormaPagamento: associado.FormaPagamento,
      BancoDebito: associado.BancoDebito,
      AgenciaDebito: associado.AgenciaDebito,
      ContaDebito: associado.ContaDebito,
      Origem: associado.Origem,
      Motivo: associado.Motivo,
      Observacao: associado.Observacao,
    });
  };

  const handleSave = (id: number) => {
    atualizar(
      { id, data: formData },
      {
        onSuccess: () => {
          setEditando(null);
          setFormData({});
          alert('Associado atualizado com sucesso!');
        },
        onError: (error) => {
          alert('Erro ao atualizar: ' + error.message);
        },
      }
    );
  };

  const handleDelete = (id: number, nome: string) => {
    if (confirm(`Deseja realmente excluir ${nome}?`)) {
      deletar(id, {
        onSuccess: () => {
          alert('Associado excluído com sucesso!');
        },
        onError: (error) => {
          alert('Erro ao excluir: ' + error.message);
        },
      });
    }
  };

  const handleCancel = () => {
    setEditando(null);
    setFormData({});
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">Associados</h2>
          <p className="text-gray-700">Total: {data?.meta.total || 0} cadastros</p>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">CPF/CNPJ</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Data</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {associados.map((associado) => (
                <tr key={associado.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{associado.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{associado.NomeCompleto}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      associado.TipoPessoa === 'PF' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {associado.TipoPessoa === 'PF' ? 'PF' : 'PJ'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{associado.NumeroDocumento}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{associado.Email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      associado.Status === 'Aprovado' ? 'bg-green-100 text-green-800'
                      : associado.Status === 'Pendente' ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                    }`}>
                      {associado.Status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(associado.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setVisualizando(associado)} className="text-blue-600 hover:text-blue-900" title="Visualizar">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleEdit(associado)} className="text-gray-600 hover:text-gray-900" title="Editar" disabled={isAtualizando}>
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(associado.id, associado.NomeCompleto)} className="text-red-600 hover:text-red-900 disabled:opacity-50" title="Excluir" disabled={isDeletando}>
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {data?.meta.de} a {data?.meta.ate} de {data?.meta.total} resultados
            </div>
          </div>
        </div>
      </div>

      {/* Modal Visualizar */}
      {visualizando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">Detalhes</h3>
              <button onClick={() => setVisualizando(null)}><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div><strong>ID:</strong> #{visualizando.id}</div>
              <div><strong>Tipo:</strong> {visualizando.TipoPessoa}</div>
              <div className="col-span-2"><strong>Nome:</strong> {visualizando.NomeCompleto}</div>
              <div><strong>CPF/CNPJ:</strong> {visualizando.NumeroDocumento}</div>
              <div><strong>Email:</strong> {visualizando.Email}</div>
              <div><strong>Telefone:</strong> {visualizando.Telefone}</div>
              <div><strong>Status:</strong> {visualizando.Status}</div>
              <div className="col-span-2"><strong>Endereço:</strong> {visualizando.Endereco || '-'}</div>
              <div><strong>Bairro:</strong> {visualizando.Bairro || '-'}</div>
              <div><strong>CEP:</strong> {visualizando.Cep || '-'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {editando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
              <h3 className="text-2xl font-bold text-gray-900">Editar Associado</h3>
              <button onClick={handleCancel} className="text-gray-900 hover:text-gray-700 transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8">
              <form className="space-y-6">
                
                {/* Dados Pessoais */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-yellow-500">
                    📋 Dados Pessoais
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo *</label>
                      <input
                        type="text"
                        value={formData.NomeCompleto || ''}
                        onChange={(e) => setFormData({...formData, NomeCompleto: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition"
                        placeholder="Digite o nome completo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">CPF/CNPJ *</label>
                      <input
                        type="text"
                        value={formData.NumeroDocumento || ''}
                        onChange={(e) => setFormData({...formData, NumeroDocumento: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition"
                        placeholder="000.000.000-00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        value={formData.Email || ''}
                        onChange={(e) => setFormData({...formData, Email: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition"
                        placeholder="email@exemplo.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone *</label>
                      <input
                        type="text"
                        value={formData.Telefone || ''}
                        onChange={(e) => setFormData({...formData, Telefone: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition"
                        placeholder="(11) 98765-4321"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Data de Nascimento</label>
                      <input
                        type="date"
                        value={formData.DtNascimento || ''}
                        onChange={(e) => setFormData({...formData, DtNascimento: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Sexo</label>
                      <select
                        value={formData.Sexo || ''}
                        onChange={(e) => setFormData({...formData, Sexo: e.target.value as any})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition"
                      >
                        <option value="">Selecione</option>
                        <option value="Feminino">Feminino</option>
                        <option value="Masculino">Masculino</option>
                        <option value="NaoBinario">Não binário</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Endereço */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-yellow-500">
                    📍 Endereço
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Endereço</label>
                      <input
                        type="text"
                        value={formData.Endereco || ''}
                        onChange={(e) => setFormData({...formData, Endereco: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition"
                        placeholder="Rua, Avenida, número"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Número</label>
                      <input
                        type="text"
                        value={formData.Numero || ''}
                        onChange={(e) => setFormData({...formData, Numero: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition"
                        placeholder="123"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Complemento</label>
                      <input
                        type="text"
                        value={formData.Complemento || ''}
                        onChange={(e) => setFormData({...formData, Complemento: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition"
                        placeholder="Apto, Bloco"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Bairro</label>
                      <input
                        type="text"
                        value={formData.Bairro || ''}
                        onChange={(e) => setFormData({...formData, Bairro: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition"
                        placeholder="Centro"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Cidade</label>
                      <input
                        type="text"
                        value={formData.Cidade || ''}
                        onChange={(e) => setFormData({...formData, Cidade: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition"
                        placeholder="São Paulo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">UF</label>
                      <select
                        value={formData.Uf || ''}
                        onChange={(e) => setFormData({...formData, Uf: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition"
                      >
                        <option value="">Selecione</option>
                        {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map(uf => (
                          <option key={uf} value={uf}>{uf}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">CEP</label>
                      <input
                        type="text"
                        value={formData.Cep || ''}
                        onChange={(e) => setFormData({...formData, Cep: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition"
                        placeholder="00000-000"
                      />
                    </div>
                  </div>
                </div>

                {/* Contribuição */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-yellow-500">
                    💰 Contribuição
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Valor Contribuição</label>
                      <input
                        type="text"
                        value={formData.ValorContribuicao || ''}
                        onChange={(e) => setFormData({...formData, ValorContribuicao: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition"
                        placeholder="R$ 30,00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Forma de Pagamento</label>
                      <select
                        value={formData.FormaPagamento || ''}
                        onChange={(e) => setFormData({...formData, FormaPagamento: e.target.value as any})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition"
                      >
                        <option value="">Selecione</option>
                        <option value="PIX">PIX</option>
                        <option value="TED">TED</option>
                        <option value="DescontoFolha">Desconto em Folha</option>
                        <option value="DebitoAutomatico">Débito Automático</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Dados Bancários */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-yellow-500">
                    🏦 Dados Bancários (Débito Automático)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Banco</label>
                      <input
                        type="text"
                        value={formData.BancoDebito || ''}
                        onChange={(e) => setFormData({...formData, BancoDebito: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition"
                        placeholder="Nome do banco"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Agência</label>
                      <input
                        type="text"
                        value={formData.AgenciaDebito || ''}
                        onChange={(e) => setFormData({...formData, AgenciaDebito: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition"
                        placeholder="0000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Conta</label>
                      <input
                        type="text"
                        value={formData.ContaDebito || ''}
                        onChange={(e) => setFormData({...formData, ContaDebito: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition"
                        placeholder="00000-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Gestão */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-yellow-500">
                    ⚙️ Gestão
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                      <select
                        value={formData.Status || ''}
                        onChange={(e) => setFormData({...formData, Status: e.target.value as any})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition"
                      >
                        <option value="Pendente">⏳ Pendente</option>
                        <option value="Aprovado">✅ Aprovado</option>
                        <option value="Rejeitado">❌ Rejeitado</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Origem</label>
                      <input
                        type="text"
                        value={formData.Origem || ''}
                        onChange={(e) => setFormData({...formData, Origem: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition"
                        placeholder="site, admin, etc"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Motivo (Rejeição)</label>
                      <textarea
                        value={formData.Motivo || ''}
                        onChange={(e) => setFormData({...formData, Motivo: e.target.value})}
                        rows={2}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition resize-none"
                        placeholder="Motivo da rejeição (se aplicável)"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Observações</label>
                      <textarea
                        value={formData.Observacao || ''}
                        onChange={(e) => setFormData({...formData, Observacao: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition resize-none"
                        placeholder="Observações gerais sobre o associado"
                      />
                    </div>
                  </div>
                </div>

                {/* Botões */}
                <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                    disabled={isAtualizando}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave(editando)}
                    className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"
                    disabled={isAtualizando}
                  >
                    <Save className="w-5 h-5" />
                    {isAtualizando ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TabelaAssociados;