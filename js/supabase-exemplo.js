import { supabase } from './supabase.js';

// Lê registros da tabela "equipamentos".
export async function listarEquipamentos() {
  const { data, error } = await supabase
    .from('equipamentos')
    .select('id, nome, patrimonio, estado, criado_em')
    .order('criado_em', { ascending: false });

  if (error) throw error;
  return data;
}

// Insere um registro. A política RLS da tabela precisa autorizar este usuário.
export async function cadastrarEquipamento({ nome, patrimonio, estado }) {
  const { data, error } = await supabase
    .from('equipamentos')
    .insert({ nome, patrimonio, estado })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Em outro arquivo JS, por exemplo:
// import { listarEquipamentos, cadastrarEquipamento } from './supabase-exemplo.js';
// const itens = await listarEquipamentos();
// await cadastrarEquipamento({ nome: 'Notebook', patrimonio: 'NT-001', estado: 'disponível' });
