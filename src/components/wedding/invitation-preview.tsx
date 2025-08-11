import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { CasalData, ConviteDesign, ElementoDesign, ElementoTexto, FonteTexto } from '@/types/wedding';
import { Heart, Calendar, MapPin, Flower, Sparkles, Edit3, X, RotateCw, Palette, Type, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface InvitationPreviewProps {
  casal: Partial<CasalData>;
  design?: Partial<ConviteDesign>;
  className?: string;
  onDesignChange?: (design: Partial<ConviteDesign>) => void;
  editMode?: boolean;
}

const fontFamilies = [
  { value: 'serif', label: 'Serif', className: 'font-serif' },
  { value: 'sans', label: 'Sans Serif', className: 'font-sans' },
  { value: 'mono', label: 'Monospace', className: 'font-mono' },
  { value: 'cursive', label: 'Cursive', className: 'font-cursive' },
  { value: 'fantasy', label: 'Fantasy', className: 'font-fantasy' }
];

const fontWeights = [
  { value: 'light', label: 'Light' },
  { value: 'normal', label: 'Normal' },
  { value: 'bold', label: 'Bold' }
];

const fontStyles = [
  { value: 'normal', label: 'Normal' },
  { value: 'italic', label: 'Italic' }
];

export const InvitationPreview: React.FC<InvitationPreviewProps> = ({ 
  casal, 
  design = {},
  className,
  onDesignChange,
  editMode = false
}) => {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string | null>(null);

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
    elementosTexto = [],
    musicaUrl,
    mensagemPersonalizada = 'O amor é a ponte entre duas almas'
  } = design;

  const formatDate = (date?: Date) => {
    if (!date) return 'Data do Casamento';
    return date.toLocaleDateString('pt-MZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleElementClick = (elementId: string) => {
    if (!editMode) return;
    setSelectedElement(selectedElement === elementId ? null : elementId);
  };

  const handleTextClick = (elementId: string) => {
    if (!editMode) return;
    setEditingText(elementId);
  };

  const updateElementoDesign = (elementId: string, updates: Partial<ElementoDesign>) => {
    if (!onDesignChange) return;
    
    const updatedElementos = elementos.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    );
    
    onDesignChange({
      ...design,
      elementos: updatedElementos
    });
  };

  const updateElementoTexto = (elementId: string, updates: Partial<ElementoTexto>) => {
    if (!onDesignChange) return;
    
    const updatedElementosTexto = elementosTexto.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    );
    
    onDesignChange({
      ...design,
      elementosTexto: updatedElementosTexto
    });
  };

  const renderDecorativeElement = (elemento: ElementoDesign, index: number) => {
    const IconComponent = elemento.tipo === 'coracao' ? Heart : 
                         elemento.tipo === 'flor' ? Flower : 
                         Sparkles;

    const isSelected = selectedElement === elemento.id;

    return (
      <div
        key={elemento.id}
        className={cn(
          "absolute cursor-pointer transition-all duration-200",
          isSelected && "ring-2 ring-blue-500 ring-offset-2"
        )}
        style={{
          left: `${elemento.posicao.x}%`,
          top: `${elemento.posicao.y}%`,
          transform: `rotate(${elemento.rotacao || 0}deg)`,
          color: elemento.cor
        }}
        onClick={() => handleElementClick(elemento.id)}
      >
        <IconComponent 
          size={elemento.tamanho} 
          className={elemento.tipo === 'coracao' ? 'fill-current' : ''} 
        />
        
        {isSelected && editMode && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white border rounded-lg shadow-lg p-2 flex space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                const newRotation = (elemento.rotacao || 0) + 45;
                updateElementoDesign(elemento.id, { rotacao: newRotation });
              }}
            >
              <RotateCw className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                const newColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
                updateElementoDesign(elemento.id, { cor: newColor });
              }}
            >
              <Palette className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                updateElementoDesign(elemento.id, { visivel: false });
                setSelectedElement(null);
              }}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderTextElement = (elemento: ElementoTexto) => {
    const isSelected = selectedElement === elemento.id;
    const isEditing = editingText === elemento.id;

    if (!elemento.visivel) return null;

    const fontStyle = {
      fontFamily: elemento.fonte.familia,
      fontSize: `${elemento.fonte.tamanho}px`,
      fontWeight: elemento.fonte.peso,
      fontStyle: elemento.fonte.estilo,
      color: elemento.fonte.cor
    };

    return (
      <div
        key={elemento.id}
        className={cn(
          "absolute cursor-pointer transition-all duration-200",
          isSelected && "ring-2 ring-blue-500 ring-offset-2"
        )}
        style={{
          left: `${elemento.posicao.x}%`,
          top: `${elemento.posicao.y}%`,
          ...fontStyle
        }}
        onClick={() => handleTextClick(elemento.id)}
      >
        {isEditing ? (
          <Textarea
            value={elemento.texto}
            onChange={(e) => updateElementoTexto(elemento.id, { texto: e.target.value })}
            onBlur={() => setEditingText(null)}
            autoFocus
            className="min-w-[200px] resize-none"
          />
        ) : (
          <span>{elemento.texto}</span>
        )}
        
        {isSelected && editMode && !isEditing && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white border rounded-lg shadow-lg p-2 flex space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setEditingText(elemento.id);
              }}
            >
              <Edit3 className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                updateElementoTexto(elemento.id, { visivel: false });
                setSelectedElement(null);
              }}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
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
        {elementos.filter(el => el.visivel).map((elemento, index) => renderDecorativeElement(elemento, index))}

        {/* Text Elements */}
        {elementosTexto.map((elemento) => renderTextElement(elemento))}

        {/* Background Music */}
        {musicaUrl && (
          <audio autoPlay loop>
            <source src={musicaUrl} />
          </audio>
        )}
        
        <div className="relative p-8 text-center space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div 
              className="flex items-center justify-center space-x-2 text-primary mb-4 cursor-pointer"
              onClick={() => editMode && handleTextClick('header-title')}
            >
              <Heart className="w-5 h-5 fill-current" />
              <span className="text-sm font-medium tracking-wider">
                {editingText === 'header-title' ? (
                  <Input
                    value="CONVITE DE CASAMENTO"
                    onChange={(e) => {
                      // Update header text
                    }}
                    onBlur={() => setEditingText(null)}
                    autoFocus
                    className="text-center"
                  />
                ) : (
                  "CONVITE DE CASAMENTO"
                )}
              </span>
              <Heart className="w-5 h-5 fill-current" />
            </div>
            
            <h1 
              className="font-heading text-3xl text-center leading-tight cursor-pointer"
              style={{ color: corTexto }}
              onClick={() => editMode && handleTextClick('names')}
            >
              {editingText === 'names' ? (
                <div className="space-y-2">
                  <Input
                    value={`${primeiroNome} ${sobrenome}`}
                    onChange={(e) => {
                      // Update names
                    }}
                    onBlur={() => setEditingText(null)}
                    autoFocus
                    className="text-center"
                  />
                  <span className="block text-xl my-2 text-primary">&</span>
                  <Input
                    value={`${parceiroPrimeiroNome} ${parceiroSobrenome}`}
                    onChange={(e) => {
                      // Update partner names
                    }}
                    onBlur={() => setEditingText(null)}
                    className="text-center"
                  />
                </div>
              ) : (
                <>
                  {primeiroNome} {sobrenome}
                  <span className="block text-xl my-2 text-primary">&</span>
                  {parceiroPrimeiroNome} {parceiroSobrenome}
                </>
              )}
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
            <p 
              className="text-sm text-muted-foreground italic cursor-pointer"
              onClick={() => editMode && handleTextClick('message')}
            >
              {editingText === 'message' ? (
                <Textarea
                  value={mensagemPersonalizada}
                  onChange={(e) => {
                    if (onDesignChange) {
                      onDesignChange({
                        ...design,
                        mensagemPersonalizada: e.target.value
                      });
                    }
                  }}
                  onBlur={() => setEditingText(null)}
                  autoFocus
                  className="text-center resize-none"
                  placeholder="Digite sua mensagem personalizada..."
                />
              ) : (
                `"${mensagemPersonalizada}"`
              )}
            </p>
            
            <div className="pt-4">
              <p className="text-xs text-muted-foreground">
                Sua presença é o nosso maior presente
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Mode Controls */}
      {editMode && selectedElement && (
        <Card className="absolute top-0 right-0 w-80 z-10">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Editar Elemento</h3>
            {/* Element editing controls will be added here */}
          </CardContent>
        </Card>
      )}
    </div>
  );
};