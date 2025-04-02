import type { FC } from "react";
import type { Project } from "@/models/project-model";
import ProjectItemTable from "./project-item-table";
import Table from "@/components/table/table";

interface ProjectListProps {
  projects: Project[];
}
const ProjectTable: FC<ProjectListProps> = ({ projects }) => {
  return (
    <div className="flex justify-center mt-4 overflow-hidden">
      <Table className="w-[80%]">
        <Table.THeader className="w-full">
          <Table.ThCell className="lg:w-[20%]">Nombre</Table.ThCell>
          <Table.ThCell className="lg:w-[10%]">Tipo</Table.ThCell>
          <Table.ThCell className="lg:w-[50%]">Ruta</Table.ThCell>
          <Table.ThCell className="lg:w-[10%]">Opción</Table.ThCell>
        </Table.THeader>
        <Table.TBody>
          {projects.map((project) => (
            <ProjectItemTable key={project.name} project={project} />
          ))}
        </Table.TBody>
      </Table>
    </div>
  )
}
export default ProjectTable