import React from 'react';
import { cn } from '@/lib/utils';
import { CasalData, ConviteDesign, ElementoDesign } from '@/types/wedding';
import { Heart, Calendar, MapPin, Flower, Sparkles } from 'lucide-react';

interface InvitationPreviewProps {
  casal: Partial<CasalData>;
  design?: Partial<ConviteDesign>;
  className?: string;
}

export const InvitationPreview: React.FC<InvitationPreviewProps> = ({ 
  casal, 
  design = {},
  className 
}) => {
  const {
    primeiroNome = 'Seu Nome',
    sobrenome = 'Sobrenome',
    parceiroPrimeiroNome = 'Nome do Parceiro',
    parceiroSobrenome = 'Sobrenome',
    dataCasamento,
    cidade = 'Sua Cidade',
    provincia = 'Província'
  } = casal;

  const {
    corPrimaria = 'hsl(142, 35%, 45%)',
    corSecundaria = 'hsl(30, 54%, 98%)',
    corTexto = 'hsl(160, 25%, 15%)',
    fundoOpacidade = 20,
    fundoImagem,
    elementos = [],
    musicaUrl
  } = design;

  const formatDate = (date?: Date) => {
    if (!date) return 'Data do Casamento';
    return date.toLocaleDateString('pt-MZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const renderDecorativeElement = (elemento: ElementoDesign, index: number) => {
    const IconComponent = elemento.tipo === 'coracao' ? Heart : 
                         elemento.tipo === 'flor' ? Flower : 
                         Sparkles;

    return (
      <div
        key={index}
        className="absolute pointer-events-none"
        style={{
          left: `${elemento.posicao.x}%`,
          top: `${elemento.posicao.y}%`,
          transform: `rotate(${elemento.rotacao || 0}deg)`,
          color: elemento.cor
        }}
      >
        <IconComponent 
          size={elemento.tamanho} 
          className={elemento.tipo === 'coracao' ? 'fill-current' : ''} 
        />
      </div>
    );
  };

  return (
    <div className={cn(
      "relative w-full max-w-md mx-auto rounded-lg shadow-invitation overflow-hidden",
      className
    )}
    style={{
      backgroundColor: corSecundaria,
      backgroundImage: fundoImagem ? `url(${fundoImagem})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}
    >
      {/* Background Overlay */}
      {fundoImagem && (
        <div 
          className="absolute inset-0"
          style={{
            backgroundColor: corSecundaria,
            opacity: (100 - fundoOpacidade) / 100
          }}
        />
      )}

      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${corPrimaria.replace('#', '')}' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Decorative Elements */}
      {elementos.map((elemento, index) => renderDecorativeElement(elemento, index))}

      {/* Background Music */}
      {musicaUrl && (
        <audio autoPlay loop>
          <source src={musicaUrl} />
        </audio>
      )}
      
      <div className="relative p-8 text-center space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2 text-primary mb-4">
            <Heart className="w-5 h-5 fill-current" />
            <span className="text-sm font-medium tracking-wider">CONVITE DE CASAMENTO</span>
            <Heart className="w-5 h-5 fill-current" />
          </div>
          
          <h1 
            className="font-heading text-3xl text-center leading-tight"
            style={{ color: corTexto }}
          >
            {primeiroNome} {sobrenome}
            <span className="block text-xl my-2 text-primary">&</span>
            {parceiroPrimeiroNome} {parceiroSobrenome}
          </h1>
        </div>

        {/* Decorative Element */}
        <div className="flex items-center justify-center space-x-4 py-4">
          <div 
            className="w-16 h-0.5 opacity-30"
            style={{ backgroundColor: corPrimaria }}
          />
          <Heart className="w-6 h-6 text-primary fill-current" />
          <div 
            className="w-16 h-0.5 opacity-30"
            style={{ backgroundColor: corPrimaria }}
          />
        </div>

        {/* Event Details */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{formatDate(dataCasamento)}</span>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{cidade}, {provincia}</span>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground italic">
            "O amor é a ponte entre duas almas"
          </p>
          
          <div className="pt-4">
            <p className="text-xs text-muted-foreground">
              Sua presença é o nosso maior presente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};