export interface CasalData {
  id?: string;
  primeiroNome: string;
  sobrenome: string;
  parceiroPrimeiroNome: string;
  parceiroSobrenome: string;
  dataCasamento?: Date;
  provincia: string;
  cidade: string;
  telefone?: string;
  email?: string;
}

export interface ConviteDesign {
  id?: string;
  casalId?: string;
  corPrimaria: string;
  corSecundaria: string;
  corTexto: string;
  fundoImagem?: string;
  fundoOpacidade: number;
  musicaUrl?: string;
  rsvpHabilitado: boolean;
  estiloTexto: 'classico' | 'moderno' | 'romantico';
  elementos: ElementoDesign[];
}

export interface ElementoDesign {
  tipo: 'coracao' | 'flor' | 'anel' | 'texto' | 'monograma';
  posicao: { x: number; y: number };
  tamanho: number;
  cor: string;
  rotacao?: number;
  texto?: string;
}

export interface RSVP {
  id?: string;
  conviteId: string;
  nomeConvidado: string;
  email?: string;
  telefone?: string;
  numPessoas: number;
  mensagem?: string;
  confirmadoEm: Date;
  status: 'confirmado' | 'negado' | 'pendente';
}

export interface ConvitePublico {
  id: string;
  casal: CasalData;
  design: ConviteDesign;
  url: string;
  estatisticas?: {
    visualizacoes: number;
    confirmacoes: number;
    ultimaVisualizacao: Date;
  };
}