import type { FC } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { Project } from "@/models/project-model";
import { getDeviceType } from "@/utils/getDeviceType";
import { getIcon, getTitle } from "@/utils/getType";
import Table from "@/components/table/table";
import { useProjectStore } from "@/store";

interface Props {
  project: Project;
}

const ProjectItemTable: FC<Props> = ({ project }) => {
  const handleOpenWithVSCode = useProjectStore(
    (state) => state.handleOpenWithVSCode,
  );
  const type = getDeviceType(project.name);
  const Icon = getIcon(type);
  const title = getTitle(type);
  return (
    <Table.TRow key={project.name}>
      <Table.TdCell className="text-left">{project.name}</Table.TdCell>
      <Table.TdCell>
        <Badge
          variant="outline"
          className="flex justify-center items-center gap-1 px-1 py-2"
        >
          <Icon className="w-4 h-4" />
          <span>{title}</span>
        </Badge>
      </Table.TdCell>
      <Table.TdCell className="pl-2 text-left">{project.path}</Table.TdCell>
      <Table.TdCell>
        <Button size="sm" onClick={() => handleOpenWithVSCode(project.path)}>
          vsc
        </Button>
      </Table.TdCell>
    </Table.TRow>
  );
};
export default ProjectItemTable;
