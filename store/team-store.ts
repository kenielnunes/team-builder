"use client";

import { create } from "zustand";

export interface Player {
  id: string;
  name: string;
  skill?: number;
  role?: string;
}

export interface Team {
  players: Player[];
}

interface TeamStore {
  players: Player[];
  teams: Team[];
  addPlayer: (player: Player) => void;
  updatePlayer: (id: string, updatedPlayer: Partial<Player>) => void;
  removePlayer: (id: string) => void;
  resetPlayers: () => void;
  resetTeams: () => void;
  generateTeams: (numberOfTeams: number, method: string) => void;
  updateTeams: (newTeams: Team[]) => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
}

export const useTeamStore = create<TeamStore>((set, get) => ({
  players: [],
  teams: [],

  addPlayer: (player) => {
    set((state) => ({
      players: [...state.players, player],
    }));

    const { saveToLocalStorage } = get();

    saveToLocalStorage();
  },

  updatePlayer: (id, updatedPlayer) => {
    set((state) => ({
      players: state.players.map((player) =>
        player.id === id ? { ...player, ...updatedPlayer } : player
      ),
    }));

    const { saveToLocalStorage } = get();

    saveToLocalStorage();
  },

  removePlayer: (id) => {
    set((state) => ({
      players: state.players.filter((player) => player.id !== id),
    }));
    const { saveToLocalStorage } = get();

    saveToLocalStorage();
  },

  resetPlayers: () => {
    const { saveToLocalStorage } = get();

    saveToLocalStorage();

    set({ players: [] });
  },

  resetTeams: () => {
    const { saveToLocalStorage } = get();

    saveToLocalStorage();

    set({ teams: [] });
  },

  generateTeams: (numberOfTeams, method) => {
    const { players } = get();
    let teamPlayers: Player[] = [...players];

    // Ordena os jogadores com base no método selecionado
    if (method === "skill") {
      // Ordena por nível de habilidade (do mais alto para o mais baixo)
      teamPlayers.sort((a, b) => (b.skill || 0) - (a.skill || 0));
    } else if (method === "role") {
      // Agrupa jogadores por função
      const roleGroups: Record<string, Player[]> = {};

      players.forEach((player) => {
        const role = player.role || "undefined";
        if (!roleGroups[role]) {
          roleGroups[role] = [];
        }
        roleGroups[role].push(player);
      });

      // Achata os grupos em um único array
      teamPlayers = Object.values(roleGroups).flat();
    } else {
      // Aleatório - embaralha o array
      teamPlayers = teamPlayers.sort(() => Math.random() - 0.5);
    }

    // Cria equipes vazias
    const teams: Team[] = Array.from({ length: numberOfTeams }, () => ({
      players: [],
    }));

    if (method === "skill") {
      // Distribui jogadores em um padrão de draft em zigue-zague
      let direction = 1;
      let currentTeam = 0;

      teamPlayers.forEach((player) => {
        teams[currentTeam].players.push(player);

        // Altera a direção ao atingir o primeiro ou último time
        if (currentTeam === 0) {
          direction = 1;
        } else if (currentTeam === numberOfTeams - 1) {
          direction = -1;
        }

        currentTeam += direction;
      });
    } else if (method === "role") {
      // Distribui jogadores por função
      const roleGroups: Record<string, Player[]> = {};

      players.forEach((player) => {
        const role = player.role || "undefined";
        if (!roleGroups[role]) {
          roleGroups[role] = [];
        }
        roleGroups[role].push(player);
      });

      // Distribui cada função uniformemente entre as equipes
      Object.values(roleGroups).forEach((rolePlayers) => {
        // Embaralha jogadores dentro de cada função
        const shuffledRolePlayers = [...rolePlayers].sort(
          () => Math.random() - 0.5
        );

        // Distribui para as equipes
        shuffledRolePlayers.forEach((player, index) => {
          const teamIndex = index % numberOfTeams;
          teams[teamIndex].players.push(player);
        });
      });
    } else {
      // Distribuição aleatória
      teamPlayers.forEach((player, index) => {
        const teamIndex = index % numberOfTeams;
        teams[teamIndex].players.push(player);
      });
    }

    set({ teams });
    get().saveToLocalStorage();
  },

  updateTeams: (newTeams) => {
    set({ teams: newTeams });
  },

  saveToLocalStorage: () => {
    if (typeof window !== "undefined") {
      const { players, teams } = get();

      // Save current state
      localStorage.setItem("teamBuilder_players", JSON.stringify(players));
      localStorage.setItem("teamBuilder_teams", JSON.stringify(teams));

      // Save to history (keep last 5 team formations)
      const historyString = localStorage.getItem("teamBuilder_history") || "[]";
      const history = JSON.parse(historyString);

      if (teams.length > 0) {
        const newEntry = {
          date: new Date().toISOString(),
          teams,
          players,
        };

        // Add new entry and keep only the last 5
        const updatedHistory = [newEntry, ...history].slice(0, 5);
        localStorage.setItem(
          "teamBuilder_history",
          JSON.stringify(updatedHistory)
        );
      }
    }
  },

  loadFromLocalStorage: () => {
    if (typeof window !== "undefined") {
      try {
        const playersString = localStorage.getItem("teamBuilder_players");
        const teamsString = localStorage.getItem("teamBuilder_teams");

        if (playersString) {
          const players = JSON.parse(playersString);
          set({ players });
        }

        if (teamsString) {
          const teams = JSON.parse(teamsString);
          set({ teams });
        }
      } catch (error) {
        console.error("Error loading from localStorage:", error);
      }
    }
  },
}));
