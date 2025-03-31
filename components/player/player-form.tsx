"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTeamStore, Player } from "@/store/team-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ROLES } from "@/lib/constants";

const playerSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  skill: z.number().optional(),
  role: z.string().optional(),
});

export type PlayerFormValues = z.infer<typeof playerSchema>;

const defaultValues: PlayerFormValues = {
  name: "",
  skill: undefined,
  role: "",
};

export function PlayerForm() {
  const { toast } = useToast();
  const { addPlayer } = useTeamStore();
  const [sliderValue, setSliderValue] = useState<number | undefined>(undefined);
  const [useSkill, setUseSkill] = useState(false);

  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(playerSchema),
    defaultValues,
  });

  const onSubmit = (data: PlayerFormValues) => {
    // Only include skill if useSkill is true
    const playerData: Player = {
      id: Date.now().toString(),
      name: data.name,
      role: data.role === "none" ? "" : data.role,
      ...(useSkill && data.skill !== undefined ? { skill: data.skill } : {}),
    };

    addPlayer(playerData);

    toast({
      title: "Jogador adicionado",
      description: `${data.name} foi adicionado à lista.`,
    });

    form.reset(defaultValues);
    setSliderValue(undefined);
    setUseSkill(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Jogador</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-2 mb-2">
          <Switch
            id="use-skill"
            checked={useSkill}
            onCheckedChange={setUseSkill}
          />
          <label htmlFor="use-skill" className="text-sm font-medium">
            Definir nível de habilidade
          </label>
        </div>

        {useSkill && (
          <FormField
            control={form.control}
            name="skill"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nível de Habilidade (1-10)</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={sliderValue !== undefined ? [sliderValue] : [5]}
                      onValueChange={(value) => {
                        setSliderValue(value[0]);
                        field.onChange(value[0]);
                      }}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Iniciante</span>
                      <Badge variant="secondary">{sliderValue || 5}</Badge>
                      <span>Profissional</span>
                    </div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Função no Jogo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma função (opcional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Opcional: Selecione a função principal do jogador
              </FormDescription>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Jogador
        </Button>
      </form>
    </Form>
  );
}
