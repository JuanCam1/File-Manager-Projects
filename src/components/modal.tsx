import { useState, type FC } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Project } from "@/models/project-model";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { useProjectStore } from "@/store";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  project: Project;
}
const Modal: FC<Props> = ({ open, setOpen, project }) => {
  const [name, setName] = useState(project.name);
  const handleRefresh = useProjectStore((state) => state.handleRefresh);

  const handleUpdateName = async () => {
    try {
      const update = await window.api.renameProjectFolder(project.path, name);

      if (update) {
        toast.success("El nombre del proyecto ha sido actualizado.");
        setOpen(false);
        handleRefresh();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al actualizar el nombre del proyecto.");
    }
  };

  const changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length === 0) {
      return;
    }

    setName(e.target.value);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md dark:bg-zinc-950">
        <DialogHeader>
          <DialogTitle className="dark:text-white text-center font-semibold">
            Actualizar Nombre
          </DialogTitle>
          <DialogDescription>
            Digita el nuevo nombre para el proyecto.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-sm font-medium dark:text-white">
            Nombre Proyecto:
          </Label>
          <Input
            onChange={changeName}
            id="name"
            value={name}
            className="dark:text-zinc-400 dark:bg-zinc-950"
          />
        </div>

        <DialogFooter className="sm:justify-start flex md:justify-center">
          <DialogClose asChild>
            <Button
              type="button"
              variant="default"
              className="text-white"
              onClick={handleUpdateName}
            >
              Actualizar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
