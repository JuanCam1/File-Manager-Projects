import type { FC } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PencilLine, SquareTerminal } from "lucide-react";

import type { Project } from "@/models/project-model";
import { getDeviceType } from "@/utils/getDeviceType";
import { getIcon, getTitle } from "@/utils/getType";
import Table from "@/components/table/table";
import { useProjectStore } from "@/store";
import VisualIcon from "@/assets/vsc-icon";

interface Props {
  project: Project;
  onOpenEdit: (project: Project) => void;
}

const ProjectItemTable: FC<Props> = ({ project, onOpenEdit }) => {
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
    <Table.TRow key={project.name}>
      <Table.TdCell className="text-left">{project.name}</Table.TdCell>
      <Table.TdCell className="flex justify-center">
        <Badge
          variant="outline"
          className="flex justify-center items-center gap-1 px-1 py-2 lg:w-[60%]"
        >
          <Icon className="w-4 h-4" />
          <span>{title}</span>
        </Badge>
      </Table.TdCell>
      <Table.TdCell className=" pl-2 text-left">{project.path}</Table.TdCell>
      <Table.TdCell className="flex items-center justify-center gap-2">
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
          size="sm"
          className="dark:bg-zinc-950"
          onClick={() => handleOpenTerminal(project.path)}
        >
          <SquareTerminal />
        </Button>
      </Table.TdCell>
      <Table.TdCell>
        <Button
          variant="outline"
          className="dark:text-white dark:bg-zinc-950"
          size="sm"
          onClick={() => onOpenEdit(project)}
        >
          <PencilLine className="w-4 h-4" />
        </Button>
      </Table.TdCell>
    </Table.TRow>
  );
};
export default ProjectItemTable;
