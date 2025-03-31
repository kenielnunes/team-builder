"use client";

import { useState, useEffect } from "react";
import { PlayerRegistration } from "@/components/player/player-registration";
import { TeamConfiguration } from "@/components/team/team-configuration";
import { TeamVisualization } from "@/components/team/team-visualization";
import { useTeamStore } from "@/store/team-store";
import {
  Share2,
  RotateCcw,
  Moon,
  Sun,
  Users,
  Settings,
  Trophy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const { players, teams, resetTeams, resetPlayers, loadFromLocalStorage } =
    useTeamStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadFromLocalStorage();
    // No automatic navigation - always start at step 0
  }, [loadFromLocalStorage]);

  const handleCopyToClipboard = () => {
    if (teams.length === 0) {
      toast({
        title: "Nenhum time formado",
        description: "Forme times primeiro para poder copiar.",
        variant: "destructive",
      });
      return;
    }

    let teamsText = "Times Formados:\n\n";

    teams.forEach((team, index) => {
      teamsText += `Time ${index + 1}:\n`;
      let totalSkill = 0;

      team.players.forEach((player) => {
        teamsText += `- ${player.name}`;
        if (player.skill) teamsText += ` (Nível: ${player.skill})`;
        if (player.role) teamsText += ` (Função: ${player.role})`;
        teamsText += "\n";
        totalSkill += player.skill || 0;
      });

      teamsText += `Nível total do time: ${totalSkill}\n\n`;
    });

    navigator.clipboard.writeText(teamsText);
    toast({
      title: "Copiado!",
      description: "Os times foram copiados para a área de transferência.",
    });
  };

  const handleReset = () => {
    if (confirm("Tem certeza que deseja resetar todos os jogadores e times?")) {
      resetPlayers();
      resetTeams();
      setActiveStep(0);
      toast({
        title: "Resetado",
        description: "Todos os jogadores e times foram removidos.",
      });
    }
  };

  const nextStep = () => {
    setActiveStep((prev) => Math.min(prev + 1, 2));
  };

  const prevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  if (!mounted) {
    return null;
  }

  const steps = [
    { name: "Cadastrar Jogadores", icon: <Users className="h-4 w-4" /> },
    { name: "Configurar Times", icon: <Settings className="h-4 w-4" /> },
    { name: "Visualizar Times", icon: <Trophy className="h-4 w-4" /> },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.header
        className="mb-10 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent relative inline-block">
          TEAM BUILDER
        </h1>
        <div className="h-0.5 w-1/2 mx-auto mt-2 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
        <p className="text-muted-foreground mt-4 max-w-md mx-auto">
          Crie times equilibrados automaticamente com base em habilidade ou
          função
        </p>

        <div className="flex justify-between items-center mt-8 mb-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 mr-2" />
            ) : (
              <Moon className="h-4 w-4 mr-2" />
            )}
            <span className="hidden sm:inline">
              {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
            </span>
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyToClipboard}
              disabled={teams.length === 0}
              className="flex items-center"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Copiar Times
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleReset}
              className="flex items-center"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Resetar
            </Button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="relative mb-16">
          <div className="flex justify-between max-w-md mx-auto">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative flex flex-col items-center`}
              >
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full z-10 transition-all
                    ${
                      activeStep === index
                        ? "bg-primary text-primary-foreground shadow-[0_0_0_4px_rgba(var(--primary),0.2)]"
                        : activeStep > index
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  onClick={() => {
                    if (
                      index === 0 ||
                      (index === 1 && players.length >= 2) ||
                      (index === 2 && teams.length > 0)
                    ) {
                      setActiveStep(index);
                    }
                  }}
                  style={{
                    cursor:
                      index === 0 ||
                      (index === 1 && players.length >= 2) ||
                      (index === 2 && teams.length > 0)
                        ? "pointer"
                        : "not-allowed",
                  }}
                >
                  {step.icon}
                </div>
                <span className="text-xs font-medium mt-2">{step.name}</span>
              </div>
            ))}
          </div>
          <div className="h-px absolute top-5 left-0 right-0 max-w-md mx-auto -z-10 bg-muted">
            <div
              className="h-full bg-primary transition-all"
              style={{
                width: `${(activeStep / (steps.length - 1)) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="relative overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-primary to-secondary absolute top-0 left-0"></div>
          <div className="p-6">
            {activeStep === 0 && <PlayerRegistration onComplete={nextStep} />}
            {activeStep === 1 && (
              <TeamConfiguration onComplete={nextStep} onBack={prevStep} />
            )}
            {activeStep === 2 && <TeamVisualization onBack={prevStep} />}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
