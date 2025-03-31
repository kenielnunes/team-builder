"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTeamStore, Player } from "@/store/team-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ROLES } from "@/lib/constants";

const playerSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  skill: z.number().optional(),
  role: z.string().optional(),
});

type PlayerFormValues = z.infer<typeof playerSchema>;

interface EditPlayerDialogProps {
  player: Player;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPlayerDialog({
  player,
  open,
  onOpenChange,
}: EditPlayerDialogProps) {
  const { toast } = useToast();
  const { updatePlayer } = useTeamStore();
  const [editSliderValue, setEditSliderValue] = useState<number | undefined>(
    undefined
  );
  const [editUseSkill, setEditUseSkill] = useState(false);

  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      name: "",
      skill: undefined,
      role: "",
    },
  });

  // Update form when player changes
  useEffect(() => {
    if (player) {
      setEditUseSkill(player.skill !== undefined);
      setEditSliderValue(player.skill);

      form.reset({
        name: player.name,
        skill: player.skill,
        role: player.role || "none",
      });
    }
  }, [player, form]);

  const handleSubmit = (data: PlayerFormValues) => {
    // Only include skill if editUseSkill is true
    const updatedPlayer = {
      name: data.name,
      role: data.role === "none" ? "" : data.role,
      ...(editUseSkill && data.skill !== undefined
        ? { skill: data.skill }
        : { skill: undefined }),
    };

    updatePlayer(player.id, updatedPlayer);

    toast({
      title: "Jogador atualizado",
      description: `${data.name} foi atualizado com sucesso.`,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Jogador</DialogTitle>
          <DialogDescription>
            Atualize as informações do jogador conforme necessário.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
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
                id="edit-use-skill"
                checked={editUseSkill}
                onCheckedChange={setEditUseSkill}
              />
              <label htmlFor="edit-use-skill" className="text-sm font-medium">
                Definir nível de habilidade
              </label>
            </div>

            {editUseSkill && (
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
                          value={
                            editSliderValue !== undefined
                              ? [editSliderValue]
                              : [5]
                          }
                          onValueChange={(value) => {
                            setEditSliderValue(value[0]);
                            field.onChange(value[0]);
                          }}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Iniciante</span>
                          <Badge variant="secondary">
                            {editSliderValue || 5}
                          </Badge>
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
                  <Select onValueChange={field.onChange} value={field.value}>
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

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                <Check className="mr-2 h-4 w-4" />
                Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
