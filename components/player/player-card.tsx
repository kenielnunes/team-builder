"use client";

import { X, Pencil } from "lucide-react";
import { Player } from "@/store/team-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROLES } from "@/lib/constants";

interface PlayerCardProps {
  player: Player;
  onEdit: (player: Player) => void;
  onRemove: (id: string) => void;
}

export function PlayerCard({ player, onEdit, onRemove }: PlayerCardProps) {
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
    <div
      className="flex items-center justify-between p-3 rounded-md bg-card border hover:bg-accent/5 hover:border-accent/30 cursor-pointer transition-all duration-200"
      onClick={() => onEdit(player)}
    >
      <div>
        <div className="font-medium text-sm flex items-center gap-1">
          {player.name}
          <Pencil className="h-3 w-3 text-muted-foreground ml-1" />
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {player.skill !== undefined && (
            <Badge variant={getSkillVariant(player.skill)}>
              Nível: {player.skill}
            </Badge>
          )}
          {player.role && (
            <Badge variant={"default"}>
              {ROLES.find((r) => r.value === player.role)?.label || player.role}
            </Badge>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(player.id);
        }}
        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
