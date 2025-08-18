import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { CasalData, ConviteDesign, ElementoDesign, ElementoTexto, FonteTexto, CanvasSettings } from '@/types/wedding';
import { Heart, Flower, Music, Upload, Palette, Sparkles, Edit3, Type, Plus, Trash2, Download, Share2, RotateCw, Move, Maximize2, Grid, Lock, Unlock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InvitationPreview } from './invitation-preview';
import { fontOptions, getFontFamily, loadGoogleFonts } from '@/data/fonts';
import { backgroundOptions, getBackgroundsByCategory } from '@/data/backgrounds';

interface DesignCustomizerProps {
  casal: Partial<CasalData>;
  design: Partial<ConviteDesign>;
  onDesignChange: (design: Partial<ConviteDesign>) => void;
  onNext: () => void;
  onBack: () => void;
}

const colorPalettes = [
  { name: 'Sage Clássico', primary: 'hsl(142, 35%, 45%)', secondary: 'hsl(30, 54%, 98%)', text: 'hsl(160, 25%, 15%)' },
  { name: 'Rosa Romântico', primary: 'hsl(350, 45%, 65%)', secondary: 'hsl(350, 45%, 95%)', text: 'hsl(350, 35%, 25%)' },
  { name: 'Azul Elegante', primary: 'hsl(210, 55%, 55%)', secondary: 'hsl(210, 45%, 98%)', text: 'hsl(210, 35%, 25%)' },
  { name: 'Ouro Real', primary: 'hsl(45, 90%, 55%)', secondary: 'hsl(45, 45%, 98%)', text: 'hsl(45, 35%, 25%)' },
  { name: 'Lavanda Suave', primary: 'hsl(270, 45%, 65%)', secondary: 'hsl(270, 25%, 98%)', text: 'hsl(270, 35%, 25%)' },
  { name: 'Verde Eucalipto', primary: 'hsl(150, 25%, 55%)', secondary: 'hsl(150, 15%, 98%)', text: 'hsl(150, 35%, 25%)' }
];

const decorativeElements = [
  { type: 'coracao' as const, icon: Heart, name: 'Coração' },
  { type: 'flor' as const, icon: Flower, name: 'Flor' },
  { type: 'texto' as const, icon: Sparkles, name: 'Texto Decorativo' }
];

const aspectRatioOptions = [
  { value: 'square', label: 'Quadrado (1:1)' },
  { value: 'portrait', label: 'Retrato (4:5)' },
  { value: 'landscape', label: 'Paisagem (16:9)' },
  { value: 'custom', label: 'Personalizado' }
];

const backgroundFitOptions = [
  { value: 'crop', label: 'Cortar' },
  { value: 'stretch', label: 'Esticar' },
  { value: 'tile', label: 'Repetir' },
  { value: 'fit', label: 'Ajustar' }
];

// By default, the customization step should not inject text elements for
// header/names/message because those core details come from the Basic Data.
// Leave the list empty so users can add only additional custom texts.
const defaultTextElements: ElementoTexto[] = [];

const defaultCanvasSettings: CanvasSettings = {
  aspectRatio: 'portrait',
  width: 400,
  height: 500,
  backgroundFit: 'crop',
  gridEnabled: false,
  snapToGrid: false,
  gridSize: 20
};

export const DesignCustomizer: React.FC<DesignCustomizerProps> = ({
  casal,
  design,
  onDesignChange,
  onNext,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState('cores');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [backgroundCategory, setBackgroundCategory] = useState<string>('all');

  // Load Google Fonts on component mount
  useEffect(() => {
    loadGoogleFonts();
  }, []);

  // Initialize canvas defaults and keep any existing custom texts without
  // introducing duplicated core text layers.
  useEffect(() => {
    if (!design.canvasSettings) {
      onDesignChange({
        ...design,
        canvasSettings: defaultCanvasSettings,
        elementosTexto: design.elementosTexto || defaultTextElements
      });
    }
  }, []);

  const handleColorPaletteSelect = (palette: typeof colorPalettes[0]) => {
    onDesignChange({
      ...design,
      corPrimaria: palette.primary,
      corSecundaria: palette.secondary,
      corTexto: palette.text
    });
  };

  const handleCustomColorChange = (colorType: 'corPrimaria' | 'corSecundaria' | 'corTexto', value: string) => {
    onDesignChange({
      ...design,
      [colorType]: value
    });
  };

  const handleOpacityChange = (value: number[]) => {
    onDesignChange({
      ...design,
      fundoOpacidade: value[0]
    });
  };

  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setBackgroundImage(result);
        onDesignChange({
          ...design,
          fundoImagem: result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundSelect = (backgroundId: string) => {
    const background = backgroundOptions.find(bg => bg.id === backgroundId);
    if (background) {
      onDesignChange({
        ...design,
        fundoImagem: background.url
      });
    }
  };

  const handleCanvasSettingsChange = (settings: Partial<CanvasSettings>) => {
    onDesignChange({
      ...design,
      canvasSettings: {
        ...design.canvasSettings,
        ...settings
      }
    });
  };

  const addDecorativeElement = (type: ElementoDesign['tipo']) => {
    const newElement: ElementoDesign = {
      id: `element-${Date.now()}`,
      tipo: type,
      posicao: { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 },
      tamanho: 24,
      cor: design.corPrimaria || 'hsl(142, 35%, 45%)',
      rotacao: 0,
      editavel: true,
      visivel: true
    };

    const currentElements = design.elementos || [];
    if (currentElements.length >= 10) {
      alert('Máximo de 10 elementos decorativos atingido');
      return;
    }

    onDesignChange({
      ...design,
      elementos: [...currentElements, newElement]
    });
  };

  const addTextElement = () => {
    const newTextElement: ElementoTexto = {
      id: `text-${Date.now()}`,
      tipo: 'personalizado',
      texto: 'Novo texto',
      posicao: { x: 50, y: 50 },
      tamanho: { width: 200, height: 50 },
      fonte: {
        familia: 'Montserrat',
        tamanho: 16,
        peso: 'normal',
        estilo: 'normal',
        cor: design.corTexto || 'hsl(160, 25%, 15%)',
        alinhamento: 'center'
      },
      editavel: true,
      visivel: true
    };

    const currentTextElements = design.elementosTexto || [];
    onDesignChange({
      ...design,
      elementosTexto: [...currentTextElements, newTextElement]
    });
  };

  const updateTextElement = (elementId: string, updates: Partial<ElementoTexto>) => {
    const currentTextElements = design.elementosTexto || [];
    const updatedElements = currentTextElements.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    );
    
    onDesignChange({
      ...design,
      elementosTexto: updatedElements
    });
  };

  const removeTextElement = (elementId: string) => {
    const currentTextElements = design.elementosTexto || [];
    const updatedElements = currentTextElements.filter(el => el.id !== elementId);
    
    onDesignChange({
      ...design,
      elementosTexto: updatedElements
    });
  };

  const handleMusicUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onDesignChange({
          ...design,
          musicaUrl: result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateInvitation = async () => {
    alert('Convite gerado com sucesso! Em breve você receberá o link para compartilhamento.');
  };

  const filteredBackgrounds = backgroundCategory === 'all' 
    ? backgroundOptions 
    : getBackgroundsByCategory(backgroundCategory);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Preview Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Visualização</h3>
          <div className="flex space-x-2">
            <Button
              variant={editMode ? "default" : "outline"}
              size="sm"
              onClick={() => setEditMode(!editMode)}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {editMode ? 'Sair do Modo Edição' : 'Modo Edição'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={generateInvitation}
            >
              <Download className="w-4 h-4 mr-2" />
              Gerar Convite
            </Button>
          </div>
        </div>
        
        <InvitationPreview
          casal={casal}
          design={design}
          onDesignChange={onDesignChange}
          editMode={editMode}
          className="w-full"
        />
      </div>

      {/* Customization Panel */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="text-xl font-heading text-primary flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>Personalização Avançada</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="cores">Cores</TabsTrigger>
              <TabsTrigger value="fundo">Fundo</TabsTrigger>
              <TabsTrigger value="textos">Textos</TabsTrigger>
              <TabsTrigger value="elementos">Elementos</TabsTrigger>
              <TabsTrigger value="canvas">Canvas</TabsTrigger>
              <TabsTrigger value="musica">Música</TabsTrigger>
            </TabsList>

            <TabsContent value="cores" className="space-y-6 mt-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">Paletas Predefinidas</Label>
                <div className="grid grid-cols-2 gap-3">
                  {colorPalettes.map((palette) => (
                    <div
                      key={palette.name}
                      onClick={() => handleColorPaletteSelect(palette)}
                      className={cn(
                        "cursor-pointer p-3 rounded-lg border transition-all hover:shadow-md",
                        design.corPrimaria === palette.primary 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div
                          className="w-5 h-5 rounded-full border border-border"
                          style={{ backgroundColor: palette.primary }}
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-border"
                          style={{ backgroundColor: palette.secondary }}
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-border"
                          style={{ backgroundColor: palette.text }}
                        />
                      </div>
                      <p className="text-xs font-medium">{palette.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium">Cores Personalizadas</Label>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Label className="w-24 text-xs">Primária:</Label>
                    <div className="flex items-center space-x-2 flex-1">
                      <div
                        className="w-8 h-8 rounded border border-border cursor-pointer"
                        style={{ backgroundColor: design.corPrimaria || 'hsl(142, 35%, 45%)' }}
                        onClick={() => document.getElementById('primary-color')?.click()}
                      />
                      <Input
                        id="primary-color"
                        type="color"
                        value={design.corPrimaria?.includes('hsl') ? '#6B8E5A' : design.corPrimaria || '#6B8E5A'}
                        onChange={(e) => handleCustomColorChange('corPrimaria', e.target.value)}
                        className="sr-only"
                      />
                      <Input
                        value={design.corPrimaria || 'hsl(142, 35%, 45%)'}
                        onChange={(e) => handleCustomColorChange('corPrimaria', e.target.value)}
                        className="flex-1 text-xs"
                        placeholder="hsl(142, 35%, 45%)"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Label className="w-24 text-xs">Secundária:</Label>
                    <div className="flex items-center space-x-2 flex-1">
                      <div
                        className="w-8 h-8 rounded border border-border cursor-pointer"
                        style={{ backgroundColor: design.corSecundaria || 'hsl(30, 54%, 98%)' }}
                        onClick={() => document.getElementById('secondary-color')?.click()}
                      />
                      <Input
                        id="secondary-color"
                        type="color"
                        value={design.corSecundaria?.includes('hsl') ? '#FDF8F2' : design.corSecundaria || '#FDF8F2'}
                        onChange={(e) => handleCustomColorChange('corSecundaria', e.target.value)}
                        className="sr-only"
                      />
                      <Input
                        value={design.corSecundaria || 'hsl(30, 54%, 98%)'}
                        onChange={(e) => handleCustomColorChange('corSecundaria', e.target.value)}
                        className="flex-1 text-xs"
                        placeholder="hsl(30, 54%, 98%)"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Label className="w-24 text-xs">Texto:</Label>
                    <div className="flex items-center space-x-2 flex-1">
                      <div
                        className="w-8 h-8 rounded border border-border cursor-pointer"
                        style={{ backgroundColor: design.corTexto || 'hsl(160, 25%, 15%)' }}
                        onClick={() => document.getElementById('text-color')?.click()}
                      />
                      <Input
                        id="text-color"
                        type="color"
                        value={design.corTexto?.includes('hsl') ? '#2D5A3D' : design.corTexto || '#2D5A3D'}
                        onChange={(e) => handleCustomColorChange('corTexto', e.target.value)}
                        className="sr-only"
                      />
                      <Input
                        value={design.corTexto || 'hsl(160, 25%, 15%)'}
                        onChange={(e) => handleCustomColorChange('corTexto', e.target.value)}
                        className="flex-1 text-xs"
                        placeholder="hsl(160, 25%, 15%)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fundo" className="space-y-6 mt-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">Galeria de Fundos</Label>
                <Select value={backgroundCategory} onValueChange={setBackgroundCategory}>
                  <SelectTrigger className="mb-3">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Categorias</SelectItem>
                    <SelectItem value="floral">Floral</SelectItem>
                    <SelectItem value="hearts">Corações</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                    <SelectItem value="abstract">Abstrato</SelectItem>
                    <SelectItem value="nature">Natureza</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  {filteredBackgrounds.map((background) => (
                    <div
                      key={background.id}
                      onClick={() => handleBackgroundSelect(background.id)}
                      className={cn(
                        "cursor-pointer p-2 rounded-lg border transition-all hover:shadow-md",
                        design.fundoImagem === background.url 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <img
                        src={background.thumbnail}
                        alt={background.name}
                        className="w-full h-20 object-cover rounded mb-2"
                      />
                      <p className="text-xs font-medium">{background.name}</p>
                      <p className="text-xs text-muted-foreground">{background.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">Upload de Imagem</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">
                    Adicione uma foto de fundo personalizada
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundUpload}
                    className="w-full"
                  />
                </div>
                
                {(design.fundoImagem || backgroundImage) && (
                  <div className="mt-4">
                    <img
                      src={design.fundoImagem || backgroundImage || ''}
                      alt="Background preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Opacidade da Imagem: {design.fundoOpacidade || 20}%
                </Label>
                <Slider
                  value={[design.fundoOpacidade || 20]}
                  onValueChange={handleOpacityChange}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="textos" className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Elementos de Texto</Label>
                <Button size="sm" onClick={addTextElement}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Texto
                </Button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {(design.elementosTexto || []).map((elemento) => (
                  <div key={elemento.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">{elemento.tipo}</Label>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeTextElement(elemento.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <Textarea
                      value={elemento.texto}
                      onChange={(e) => updateTextElement(elemento.id, { texto: e.target.value })}
                      placeholder="Digite o texto..."
                      className="text-sm"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Família da Fonte</Label>
                        <Select
                          value={elemento.fonte.familia}
                          onValueChange={(value) => updateTextElement(elemento.id, { 
                            fonte: { ...elemento.fonte, familia: value }
                          })}
                        >
                          <SelectTrigger className="text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fontOptions.map((font) => (
                              <SelectItem key={font.value} value={font.value}>
                                <span style={{ fontFamily: getFontFamily(font.value) }}>
                                  {font.label}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-xs">Tamanho: {elemento.fonte.tamanho}px</Label>
                        <Slider
                          value={[elemento.fonte.tamanho]}
                          onValueChange={(value) => updateTextElement(elemento.id, {
                            fonte: { ...elemento.fonte, tamanho: value[0] }
                          })}
                          min={10}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Peso</Label>
                        <Select
                          value={elemento.fonte.peso}
                          onValueChange={(value) => updateTextElement(elemento.id, {
                            fonte: { ...elemento.fonte, peso: value as any }
                          })}
                        >
                          <SelectTrigger className="text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="bold">Bold</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-xs">Estilo</Label>
                        <Select
                          value={elemento.fonte.estilo}
                          onValueChange={(value) => updateTextElement(elemento.id, {
                            fonte: { ...elemento.fonte, estilo: value as any }
                          })}
                        >
                          <SelectTrigger className="text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="italic">Italic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-xs">Alinhamento</Label>
                        <Select
                          value={elemento.fonte.alinhamento || 'center'}
                          onValueChange={(value) => updateTextElement(elemento.id, {
                            fonte: { ...elemento.fonte, alinhamento: value as any }
                          })}
                        >
                          <SelectTrigger className="text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Esquerda</SelectItem>
                            <SelectItem value="center">Centro</SelectItem>
                            <SelectItem value="right">Direita</SelectItem>
                            <SelectItem value="justify">Justificado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-xs">Cor</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <div
                            className="w-6 h-6 rounded border border-border cursor-pointer"
                            style={{ backgroundColor: elemento.fonte.cor }}
                            onClick={() => document.getElementById(`color-${elemento.id}`)?.click()}
                          />
                          <Input
                            id={`color-${elemento.id}`}
                            type="color"
                            value={elemento.fonte.cor}
                            onChange={(e) => updateTextElement(elemento.id, {
                              fonte: { ...elemento.fonte, cor: e.target.value }
                            })}
                            className="sr-only"
                          />
                          <Input
                            value={elemento.fonte.cor}
                            onChange={(e) => updateTextElement(elemento.id, {
                              fonte: { ...elemento.fonte, cor: e.target.value }
                            })}
                            className="flex-1 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">Mensagem Personalizada</Label>
                <Textarea
                  value={design.mensagemPersonalizada || 'O amor é a ponte entre duas almas'}
                  onChange={(e) => onDesignChange({
                    ...design,
                    mensagemPersonalizada: e.target.value
                  })}
                  placeholder="Digite sua mensagem personalizada ou versículo bíblico..."
                  className="min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Você pode usar uma mensagem personalizada ou um versículo bíblico como "1 Coríntios 13:4-7"
                </p>
              </div>
            </TabsContent>

            <TabsContent value="elementos" className="space-y-6 mt-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">Elementos Decorativos</Label>
                <div className="grid grid-cols-3 gap-3">
                  {decorativeElements.map((element) => (
                    <Button
                      key={element.type}
                      variant="outline"
                      onClick={() => addDecorativeElement(element.type)}
                      className="h-20 flex-col space-y-2"
                      disabled={(design.elementos?.length || 0) >= 10}
                    >
                      <element.icon className="w-6 h-6" />
                      <span className="text-xs">{element.name}</span>
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Máximo de 10 elementos. Clique nos elementos no preview para editá-los.
                </p>
              </div>

              {design.elementos && design.elementos.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Elementos Adicionados: {design.elementos.filter(el => el.visivel).length}/10
                  </Label>
                </div>
              )}
            </TabsContent>

            <TabsContent value="canvas" className="space-y-6 mt-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">Configurações do Canvas</Label>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs">Proporção</Label>
                    <Select
                      value={design.canvasSettings?.aspectRatio || 'portrait'}
                      onValueChange={(value) => handleCanvasSettingsChange({ aspectRatio: value as any })}
                    >
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {aspectRatioOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs">Ajuste do Fundo</Label>
                    <Select
                      value={design.canvasSettings?.backgroundFit || 'crop'}
                      onValueChange={(value) => handleCanvasSettingsChange({ backgroundFit: value as any })}
                    >
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {backgroundFitOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="grid-enabled"
                      checked={design.canvasSettings?.gridEnabled || false}
                      onCheckedChange={(checked) => handleCanvasSettingsChange({ gridEnabled: checked })}
                    />
                    <Label htmlFor="grid-enabled" className="text-xs">Mostrar Grade</Label>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="musica" className="space-y-6 mt-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">Música de Fundo</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Music className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">
                    Adicione uma música especial para tocar quando o convite for aberto
                  </p>
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={handleMusicUpload}
                    className="w-full"
                  />
                </div>
                
                {design.musicaUrl && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      ✓ Música adicionada com sucesso
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={onBack}>
              Voltar
            </Button>
            <Button onClick={onNext} className="bg-gradient-primary">
              Próximo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};