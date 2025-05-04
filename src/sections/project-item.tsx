import type { FC } from "react";
import type { Project } from "@/models/project-model";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDeviceType } from "@/utils/getDeviceType";
import { getIcon, getTitle } from "@/utils/getType";
import { useProjectStore } from "@/store";
import { PencilLine, SquareTerminal } from "lucide-react";
import VisualIcon from "@/assets/vsc-icon";

interface ProjectItemProps {
  project: Project;
  onOpenEdit: (project: Project) => void;
}

const ProjectItem: FC<ProjectItemProps> = ({ project, onOpenEdit }) => {
  const handleOpenWithVSCode = useProjectStore(
    (state) => state.handleOpenWithVSCode,
  );
  const handleOpenTerminal = useProjectStore(
    (state) => state.handleOpenTerminal,
  );
  const type = getDeviceType(project.name);
  const Icon = getIcon(type);
  const title = getTitle(type);

  return (
    <Card className="dark:bg-zinc-800 border border-zinc-200 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg truncate">{project.name}</CardTitle>
          <Badge
            variant="outline"
            className="flex justify-center items-center gap-1 px-3 py-2"
          >
            <Icon className="w-4 h-4" />
            <span>{title}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-muted-foreground text-sm truncate">{project.path}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="dark:bg-zinc-950"
            size="sm"
            onClick={() => handleOpenWithVSCode(project.path)}
          >
            <VisualIcon />
          </Button>
          <Button
            variant="outline"
            className="text-white dark:bg-zinc-950"
            size="sm"
            onClick={() => handleOpenTerminal(project.path)}
          >
            <SquareTerminal className="w-4 h-4" />
          </Button>
        </div>
        <Button
          variant="outline"
          className="text-white dark:bg-zinc-950"
          size="sm"
          onClick={() => onOpenEdit(project)}
        >
          <PencilLine className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectItem;
