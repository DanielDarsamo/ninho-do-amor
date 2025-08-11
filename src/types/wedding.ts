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

export interface FonteTexto {
  familia: string;
  tamanho: number;
  peso: 'normal' | 'bold' | 'light';
  estilo: 'normal' | 'italic';
  cor: string;
}

export interface ElementoTexto {
  id: string;
  tipo: 'titulo' | 'subtitulo' | 'mensagem' | 'detalhes' | 'personalizado';
  texto: string;
  posicao: { x: number; y: number };
  fonte: FonteTexto;
  editavel: boolean;
  visivel: boolean;
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
  elementosTexto: ElementoTexto[];
  mensagemPersonalizada?: string;
}

export interface ElementoDesign {
  id: string;
  tipo: 'coracao' | 'flor' | 'anel' | 'texto' | 'monograma';
  posicao: { x: number; y: number };
  tamanho: number;
  cor: string;
  rotacao?: number;
  texto?: string;
  editavel: boolean;
  visivel: boolean;
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