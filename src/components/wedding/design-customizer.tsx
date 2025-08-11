import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CasalData, ConviteDesign, ElementoDesign, ElementoTexto, FonteTexto } from '@/types/wedding';
import { Heart, Flower, Music, Upload, Palette, Sparkles, Edit3, Type, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InvitationPreview } from './invitation-preview';

interface DesignCustomizerProps {
  casal: Partial<CasalData>;
  design: Partial<ConviteDesign>;
  selected?: { kind: 'element'; index: number } | { kind: 'titulo' } | { kind: 'mensagem' } | null;
  onSelect?: (sel: { kind: 'element'; index: number } | { kind: 'titulo' } | { kind: 'mensagem' }) => void;
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

const fontFamilies = [
  { value: 'serif', label: 'Serif' },
  { value: 'sans', label: 'Sans Serif' },
  { value: 'mono', label: 'Monospace' },
  { value: 'cursive', label: 'Cursive' },
  { value: 'fantasy', label: 'Fantasy' }
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

const defaultTextElements: ElementoTexto[] = [
  {
    id: 'header-title',
    tipo: 'titulo',
    texto: 'CONVITE DE CASAMENTO',
    posicao: { x: 50, y: 10 },
    fonte: {
      familia: 'serif',
      tamanho: 14,
      peso: 'bold',
      estilo: 'normal',
      cor: 'hsl(142, 35%, 45%)'
    },
    editavel: true,
    visivel: true
  },
  {
    id: 'names',
    tipo: 'titulo',
    texto: 'Seu Nome & Nome do Parceiro',
    posicao: { x: 50, y: 25 },
    fonte: {
      familia: 'serif',
      tamanho: 32,
      peso: 'bold',
      estilo: 'normal',
      cor: 'hsl(160, 25%, 15%)'
    },
    editavel: true,
    visivel: true
  },
  {
    id: 'message',
    tipo: 'mensagem',
    texto: 'O amor é a ponte entre duas almas',
    posicao: { x: 50, y: 70 },
    fonte: {
      familia: 'serif',
      tamanho: 14,
      peso: 'normal',
      estilo: 'italic',
      cor: 'hsl(160, 25%, 15%)'
    },
    editavel: true,
    visivel: true
  }
];

export const DesignCustomizer: React.FC<DesignCustomizerProps> = ({
  casal,
  design,
  selected,
  onSelect,
  onDesignChange,
  onNext,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState('cores');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Initialize default text elements if not present
  React.useEffect(() => {
    if (!design.elementosTexto || design.elementosTexto.length === 0) {
      onDesignChange({
        ...design,
        elementosTexto: defaultTextElements
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
      fonte: {
        familia: 'serif',
        tamanho: 16,
        peso: 'normal',
        estilo: 'normal',
        cor: design.corTexto || 'hsl(160, 25%, 15%)'
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Preview Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Visualização</h3>
          <Button
            variant={editMode ? "default" : "outline"}
            size="sm"
            onClick={() => setEditMode(!editMode)}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {editMode ? 'Sair do Modo Edição' : 'Modo Edição'}
          </Button>
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
            <span>Personalização</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="cores">Cores</TabsTrigger>
              <TabsTrigger value="fundo">Fundo</TabsTrigger>
              <TabsTrigger value="textos">Textos</TabsTrigger>
              <TabsTrigger value="elementos">Elementos</TabsTrigger>
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
                <Label className="text-sm font-medium mb-3 block">Imagem de Fundo</Label>
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

              <div className="space-y-4">
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
                            {fontFamilies.map((font) => (
                              <SelectItem key={font.value} value={font.value}>
                                {font.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-xs">Tamanho</Label>
                        <Input
                          type="number"
                          value={elemento.fonte.tamanho}
                          onChange={(e) => updateTextElement(elemento.id, {
                            fonte: { ...elemento.fonte, tamanho: parseInt(e.target.value) }
                          })}
                          className="text-xs"
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
                            {fontWeights.map((weight) => (
                              <SelectItem key={weight.value} value={weight.value}>
                                {weight.label}
                              </SelectItem>
                            ))}
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
                            {fontStyles.map((style) => (
                              <SelectItem key={style.value} value={style.value}>
                                {style.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
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
                    >
                      <element.icon className="w-6 h-6" />
                      <span className="text-xs">{element.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {design.elementos && design.elementos.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Elementos Adicionados: {design.elementos.filter(el => el.visivel).length}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Clique nos elementos no preview para editá-los individualmente.
                  </p>
                </div>
              )}
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