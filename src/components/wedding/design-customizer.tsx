import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CasalData, ConviteDesign, ElementoDesign } from '@/types/wedding';
import { Heart, Flower, Music, Upload, Palette, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export const DesignCustomizer: React.FC<DesignCustomizerProps> = ({
  casal,
  design,
  onDesignChange,
  onNext,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState('cores');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

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
      tipo: type,
      posicao: { x: Math.random() * 100, y: Math.random() * 100 },
      tamanho: 24,
      cor: design.corPrimaria || 'hsl(142, 35%, 45%)',
      rotacao: 0
    };

    const currentElements = design.elementos || [];
    onDesignChange({
      ...design,
      elementos: [...currentElements, newElement]
    });
  };

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="text-xl font-heading text-primary flex items-center space-x-2">
          <Palette className="w-5 h-5" />
          <span>Personalização do Convite</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cores">Cores</TabsTrigger>
            <TabsTrigger value="fundo">Fundo</TabsTrigger>
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
                    className="cursor-pointer p-3 rounded-lg border border-border hover:border-primary transition-all"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: palette.primary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: palette.secondary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: palette.text }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{palette.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium">Cores Personalizadas</Label>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Label className="w-24 text-xs">Primária:</Label>
                  <Input
                    type="color"
                    value={design.corPrimaria || '#6B8E5A'}
                    onChange={(e) => handleCustomColorChange('corPrimaria', e.target.value)}
                    className="w-16 h-8 p-1 border-0"
                  />
                  <Input
                    value={design.corPrimaria || '#6B8E5A'}
                    onChange={(e) => handleCustomColorChange('corPrimaria', e.target.value)}
                    className="flex-1 text-xs"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <Label className="w-24 text-xs">Secundária:</Label>
                  <Input
                    type="color"
                    value={design.corSecundaria || '#FDF8F2'}
                    onChange={(e) => handleCustomColorChange('corSecundaria', e.target.value)}
                    className="w-16 h-8 p-1 border-0"
                  />
                  <Input
                    value={design.corSecundaria || '#FDF8F2'}
                    onChange={(e) => handleCustomColorChange('corSecundaria', e.target.value)}
                    className="flex-1 text-xs"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <Label className="w-24 text-xs">Texto:</Label>
                  <Input
                    type="color"
                    value={design.corTexto || '#2D5A3D'}
                    onChange={(e) => handleCustomColorChange('corTexto', e.target.value)}
                    className="w-16 h-8 p-1 border-0"
                  />
                  <Input
                    value={design.corTexto || '#2D5A3D'}
                    onChange={(e) => handleCustomColorChange('corTexto', e.target.value)}
                    className="flex-1 text-xs"
                  />
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
                  Elementos Adicionados: {design.elementos.length}
                </Label>
                <p className="text-xs text-muted-foreground">
                  Os elementos aparecerão aleatoriamente no convite. Você pode adicionar mais clicando nos botões acima.
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
  );
};