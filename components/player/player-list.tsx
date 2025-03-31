"use client";

import { useState } from "react";
import { Search, Users } from "lucide-react";
import { useTeamStore, Player } from "@/store/team-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { PlayerCard } from "@/components/player/player-card";
import { EditPlayerDialog } from "./edit-player-dialog";

interface PlayerListProps {
  onComplete: () => void;
}

export function PlayerList({ onComplete }: PlayerListProps) {
  const { players, removePlayer } = useTeamStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  const handleEditPlayer = (player: Player) => {
    setCurrentPlayer(player);
    setIsEditDialogOpen(true);
  };

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar jogador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {players.length === 0 ? (
          <div className="text-center py-8 px-4">
            <Users className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
            <h3 className="text-sm font-medium mb-1">
              Nenhum jogador cadastrado
            </h3>
            <p className="text-xs text-muted-foreground">
              Adicione jogadores usando o formulário ao lado.
            </p>
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="text-center py-8 px-4">
            <h3 className="text-sm font-medium mb-1">
              Nenhum resultado encontrado
            </h3>
            <p className="text-xs text-muted-foreground">
              Tente buscar com outro termo.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[280px]">
            <div className="space-y-2">
              {filteredPlayers.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  onEdit={handleEditPlayer}
                  onRemove={removePlayer}
                />
              ))}
            </div>
          </ScrollArea>
        )}

        <Button
          onClick={onComplete}
          disabled={players.length < 2}
          className="w-full"
        >
          Continuar
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {currentPlayer && (
        <EditPlayerDialog
          player={currentPlayer}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      )}
    </>
  );
}
