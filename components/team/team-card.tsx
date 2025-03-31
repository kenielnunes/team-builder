"use client";

import type { Player } from "@/store/team-store";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Draggable } from "@hello-pangea/dnd";
import { ROLES } from "@/lib/constants";

interface TeamCardProps {
  teamIndex: number;
  players: Player[];
  teamColor: string;
  teamSkill: number;
}

export function TeamCard({
  teamIndex,
  players,
  teamColor,
  teamSkill,
}: TeamCardProps) {
  const getSkillVariant = (skill?: number) => {
    if (!skill) return "secondary";
    if (skill <= 3) return "secondary";
    if (skill <= 7) return "default";
    return "destructive";
  };

  const getRoleVariant = () => {
    return "outline";
  };

  return (
    <Card className={`border-t-4 ${teamColor}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">
            Time {teamIndex + 1}
          </CardTitle>
          <Badge>Nível: {teamSkill}</Badge>
        </div>
        <CardDescription className="text-xs">
          {players.length} jogadores
        </CardDescription>
      </CardHeader>
      <CardContent>
        {players.map((player, playerIndex) => (
          <Draggable
            key={player.id}
            draggableId={player.id}
            index={playerIndex}
          >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={`p-3 border rounded-md bg-card text-sm mb-2 ${
                  snapshot.isDragging ? "shadow-md border-primary/20" : ""
                }`}
              >
                <div className="font-medium">{player.name}</div>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {player.skill !== undefined && (
                    <Badge variant={getSkillVariant(player.skill)}>
                      Nível: {player.skill}
                    </Badge>
                  )}
                  {player.role && (
                    <Badge variant={"default"}>
                      {ROLES.find((r) => r.value === player.role)?.label ||
                        player.role}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </Draggable>
        ))}
      </CardContent>
    </Card>
  );
}
