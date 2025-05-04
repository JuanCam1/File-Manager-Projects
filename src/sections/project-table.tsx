import type { FC } from "react";
import type { Project } from "@/models/project-model";
import ProjectItemTable from "./project-item-table";
import Table from "@/components/table/table";

interface ProjectListProps {
  projects: Project[];
  onOpenEdit: (project: Project) => void;
}
const ProjectTable: FC<ProjectListProps> = ({ projects, onOpenEdit }) => {
  return (
    <div className="flex justify-center mt-4 overflow-hidden px-4">
      <Table className="w-full lg:w-[90%]">
        <Table.THeader className="w-full">
          <Table.ThCell className="lg:w-[20%]">Nombre</Table.ThCell>
          <Table.ThCell className="lg:w-[10%]">Tipo</Table.ThCell>
          <Table.ThCell className="lg:w-[45%]">Ruta</Table.ThCell>
          <Table.ThCell className="lg:w-[10%]">Abrir</Table.ThCell>
          <Table.ThCell className="lg:w-[5%]">Editar</Table.ThCell>
        </Table.THeader>
        <Table.TBody>
          {projects.map((project) => (
            <ProjectItemTable
              key={project.name}
              project={project}
              onOpenEdit={onOpenEdit}
            />
          ))}
        </Table.TBody>
      </Table>
    </div>
  );
};
export default ProjectTable;
