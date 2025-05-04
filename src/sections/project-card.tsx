import type { FC } from "react";
import type { Project } from "@/models/project-model";
import ProjectItem from "./project-item";

interface Props {
  projects: Project[];
  onOpenEdit: (project: Project) => void;
}
const ProjectCard: FC<Props> = ({ projects, onOpenEdit }) => {
  return (
    <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4">
      {projects.map((project) => (
        <ProjectItem
          key={project.path}
          project={project}
          onOpenEdit={onOpenEdit}
        />
      ))}
    </div>
  );
};
export default ProjectCard;
