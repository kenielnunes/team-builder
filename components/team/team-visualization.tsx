"use client";

import { useState } from "react";
import { useTeamStore } from "@/store/team-store";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { RefreshCw, Save, Trophy, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TeamCard } from "@/components/team/team-card";

export function TeamVisualization({ onBack }: { onBack: () => void }) {
  const { toast } = useToast();
  const { teams, updateTeams, saveToLocalStorage } = useTeamStore();
  const [localTeams, setLocalTeams] = useState(teams);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // If dropped in the same team at the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Create a deep copy of the teams
    const newTeams = JSON.parse(JSON.stringify(localTeams));

    // Get source and destination team indices
    const sourceTeamIndex = Number.parseInt(source.droppableId.split("-")[1]);
    const destTeamIndex = Number.parseInt(
      destination.droppableId.split("-")[1]
    );

    // Get the player being moved
    const [movedPlayer] = newTeams[sourceTeamIndex].players.splice(
      source.index,
      1
    );

    // Add the player to the destination team
    newTeams[destTeamIndex].players.splice(destination.index, 0, movedPlayer);

    // Update the local state
    setLocalTeams(newTeams);
  };

  const calculateTeamSkill = (teamIndex: number) => {
    return localTeams[teamIndex].players.reduce(
      (sum, player) => sum + (player.skill || 0),
      0
    );
  };

  const handleSaveChanges = () => {
    updateTeams(localTeams);
    saveToLocalStorage();
    toast({
      title: "Alterações salvas",
      description: "As alterações nos times foram salvas com sucesso.",
    });
  };

  const handleResetChanges = () => {
    setLocalTeams(teams);
    toast({
      title: "Alterações descartadas",
      description: "As alterações nos times foram descartadas.",
    });
  };

  const teamsAreDifferent =
    JSON.stringify(teams) !== JSON.stringify(localTeams);

  const getTeamColor = (index: number) => {
    const colors = [
      "border-t-primary",
      "border-t-secondary",
      "border-t-accent",
      "border-t-blue-400",
      "border-t-indigo-400",
      "border-t-purple-400",
    ];
    return colors[index % colors.length];
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium flex items-center gap-2 text-primary">
          <Trophy className="h-4 w-4" />
          Times Formados
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetChanges}
            disabled={!teamsAreDifferent}
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            Desfazer
          </Button>
          <Button
            size="sm"
            onClick={handleSaveChanges}
            disabled={!teamsAreDifferent}
          >
            <Save className="mr-1 h-3 w-3" />
            Salvar
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Arraste e solte os jogadores para reorganizar os times manualmente.
      </p>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {localTeams.map((team, teamIndex) => (
            <Droppable key={teamIndex} droppableId={`team-${teamIndex}`}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <TeamCard
                    teamIndex={teamIndex}
                    players={team.players}
                    teamColor={getTeamColor(teamIndex)}
                    teamSkill={calculateTeamSkill(teamIndex)}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <div className="flex justify-start mt-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ChevronLeft className="mr-1 h-3 w-3" />
          Voltar para Configuração
        </Button>
      </div>
    </motion.div>
  );
}
