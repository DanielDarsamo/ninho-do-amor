import React, { useState } from 'react';
import { ProgressSteps } from '@/components/ui/progress-steps';
import { CoupleForm } from '@/components/wedding/couple-form';
import { InvitationPreview } from '@/components/wedding/invitation-preview';
import { DesignCustomizer } from '@/components/wedding/design-customizer';
import { CasalData, ConviteDesign } from '@/types/wedding';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Create = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [casalData, setCasalData] = useState<Partial<CasalData>>({});
  const [designData, setDesignData] = useState<Partial<ConviteDesign>>({
    corPrimaria: 'hsl(142, 35%, 45%)',
    corSecundaria: 'hsl(30, 54%, 98%)',
    corTexto: 'hsl(160, 25%, 15%)',
    fundoOpacidade: 20,
    rsvpHabilitado: true,
    estiloTexto: 'classico',
    elementos: []
  });

  const steps = ['Dados Básicos', 'Personalização', 'Finalização'];

  const handleDataChange = (newData: Partial<CasalData>) => {
    setCasalData(prev => ({ ...prev, ...newData }));
  };

  const handleDesignChange = (newDesign: Partial<ConviteDesign>) => {
    setDesignData(prev => ({ ...prev, ...newDesign }));
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    if (currentStep === 0) {
      navigate('/');
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 0));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-heading text-primary">Ninho do Amor</h1>
            <p className="text-sm text-muted-foreground">Criador de Convites</p>
          </div>
          
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <ProgressSteps steps={steps} currentStep={currentStep} />
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Form */}
          <div>
            {currentStep === 0 && (
              <CoupleForm
                data={casalData}
                onDataChange={handleDataChange}
                onNext={handleNext}
              />
            )}
            
            {currentStep === 1 && (
              <DesignCustomizer
                casal={casalData}
                design={designData}
                onDesignChange={handleDesignChange}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            
            {currentStep === 2 && (
              <div className="bg-card rounded-lg p-6 shadow-elegant">
                <h2 className="text-xl font-heading text-primary mb-4">Finalização</h2>
                <p className="text-muted-foreground">
                  Em breve: Geração do link final e opções de compartilhamento.
                </p>
                <div className="mt-6 space-x-4">
                  <Button variant="outline" onClick={handleBack}>
                    Voltar
                  </Button>
                  <Button className="bg-gradient-primary">
                    Criar Convite
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-8">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium text-muted-foreground">Pré-visualização</h3>
              <p className="text-sm text-muted-foreground">
                Veja como seu convite ficará
              </p>
            </div>
            <InvitationPreview casal={casalData} design={designData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;