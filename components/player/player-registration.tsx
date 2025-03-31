"use client";

import { UserPlus, Users } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlayerForm } from "@/components/player/player-form";
import { PlayerList } from "@/components/player/player-list";

interface PlayerRegistrationProps {
  onComplete: () => void;
}

export function PlayerRegistration({ onComplete }: PlayerRegistrationProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <UserPlus className="h-4 w-4" />
                Adicionar Jogador
              </CardTitle>
              <CardDescription>
                Preencha os dados do jogador para adicioná-lo à lista.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlayerForm />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Users className="h-4 w-4" />
                Jogadores Cadastrados
              </CardTitle>
              <CardDescription>
                Clique em um jogador para editar suas informações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlayerList onComplete={onComplete} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
