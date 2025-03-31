"use client";

import { useState } from "react";
import { useTeamStore } from "@/store/team-store";
import { Wand2, AlertCircle, Settings, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

type BalancingMethod = "random" | "skill" | "role";

export function TeamConfiguration({
  onComplete,
  onBack,
}: {
  onComplete: () => void;
  onBack: () => void;
}) {
  const { toast } = useToast();
  const { players, generateTeams } = useTeamStore();
  const [numberOfTeams, setNumberOfTeams] = useState(2);
  const [balancingMethod, setBalancingMethod] =
    useState<BalancingMethod>("random");

  const maxTeams = Math.floor(players.length / 2);

  const handleGenerateTeams = () => {
    if (numberOfTeams > players.length) {
      toast({
        title: "Configuração inválida",
        description:
          "O número de times não pode ser maior que o número de jogadores.",
        variant: "destructive",
      });
      return;
    }

    if (numberOfTeams < 2) {
      toast({
        title: "Configuração inválida",
        description: "É necessário formar pelo menos 2 times.",
        variant: "destructive",
      });
      return;
    }

    generateTeams(numberOfTeams, balancingMethod);
    toast({
      title: "Times gerados",
      description: `${numberOfTeams} times foram formados com sucesso.`,
    });
    onComplete();
  };

  const hasSkillInfo = players.some((player) => player.skill !== undefined);
  const hasRoleInfo = players.some(
    (player) => player.role !== undefined && player.role !== ""
  );

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Settings className="h-4 w-4" />
            Configuração dos Times
          </CardTitle>
          <CardDescription>
            Defina como os times serão formados e equilibrados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="numberOfTeams">Número de Times</Label>
            <div className="flex items-center gap-4">
              <Input
                id="numberOfTeams"
                type="number"
                min={2}
                max={maxTeams}
                value={numberOfTeams}
                onChange={(e) =>
                  setNumberOfTeams(Number.parseInt(e.target.value) || 2)
                }
                className="w-20"
              />
              <span className="text-xs text-muted-foreground">
                Máximo recomendado: {maxTeams} times (com {players.length}{" "}
                jogadores)
              </span>
            </div>
            {players.length % numberOfTeams !== 0 && (
              <Alert variant="warning" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Atenção</AlertTitle>
                <AlertDescription className="text-xs">
                  Com {players.length} jogadores e {numberOfTeams} times, a
                  distribuição não será igual. Alguns times terão{" "}
                  {Math.ceil(players.length / numberOfTeams)} jogadores e outros{" "}
                  {Math.floor(players.length / numberOfTeams)}.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>Método de Balanceamento</Label>
            <RadioGroup
              value={balancingMethod}
              onValueChange={(value) =>
                setBalancingMethod(value as BalancingMethod)
              }
              className="space-y-3"
            >
              <div className="flex items-start space-x-2 p-2 rounded-md hover:bg-accent/10">
                <RadioGroupItem value="random" id="random" />
                <div className="grid gap-1.5">
                  <Label htmlFor="random" className="font-medium">
                    Aleatório
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Distribui os jogadores de forma totalmente randômica entre
                    os times.
                  </p>
                </div>
              </div>

              <div
                className={`flex items-start space-x-2 p-2 rounded-md ${
                  hasSkillInfo ? "hover:bg-accent/10" : "opacity-60"
                }`}
              >
                <RadioGroupItem
                  value="skill"
                  id="skill"
                  disabled={!hasSkillInfo}
                />
                <div className="grid gap-1.5">
                  <Label htmlFor="skill" className="font-medium">
                    Por Nível de Habilidade
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {hasSkillInfo
                      ? "Equilibra os times com base no nível de habilidade dos jogadores."
                      : "Nenhum jogador tem nível de habilidade definido."}
                  </p>
                </div>
              </div>

              <div
                className={`flex items-start space-x-2 p-2 rounded-md ${
                  hasRoleInfo ? "hover:bg-accent/10" : "opacity-60"
                }`}
              >
                <RadioGroupItem
                  value="role"
                  id="role"
                  disabled={!hasRoleInfo}
                />
                <div className="grid gap-1.5">
                  <Label htmlFor="role" className="font-medium">
                    Por Função
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {hasRoleInfo
                      ? "Distribui os jogadores para que cada time tenha uma mistura equilibrada de funções."
                      : "Nenhum jogador tem função definida."}
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Button onClick={handleGenerateTeams}>
            <Wand2 className="mr-2 h-4 w-4" />
            Gerar Times
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
