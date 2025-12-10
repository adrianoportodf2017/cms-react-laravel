<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Associado extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Nome da tabela no banco de dados
     */
    protected $table = 'TB_Associado';
    
    /**
     * Chave primária da tabela
     */
    protected $primaryKey = 'id';

    /**
     * Campos que podem ser preenchidos em massa
     */
    protected $fillable = [
        'TipoPessoa',
        'NomeCompleto',
        'NumeroDocumento',
        'Email',
        'Telefone',
        'DtNascimento',
        'Sexo',
        'Cep',
        'Endereco',
        'Numero',
        'Complemento',
        'Bairro',
        'Cidade',
        'Uf',
        'ValorContribuicao',
        'FormaPagamento',
        'BancoDebito',
        'AgenciaDebito',
        'ContaDebito',
        'Motivo',
        'Status',
        'IsConsentimentoLgpd',
        'Origem',
        'Observacao',
    ];

    /**
     * Conversão de tipos dos atributos
     */
    protected $casts = [
        'DtNascimento' => 'date',
        'IsConsentimentoLgpd' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Valores padrão para os atributos
     */
    protected $attributes = [
        'TipoPessoa' => 'PF',
        'Status' => 'Pendente',
        'IsConsentimentoLgpd' => false,
    ];
}