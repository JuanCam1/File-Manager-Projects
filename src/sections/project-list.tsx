import { useEffect, useState } from "react";

import { useProjectStore } from "@/store";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ProjectTable from "./project-table";
import ProjectCard from "./project-card";
import SkeletonList from "@/components/skeleton-list";
import { Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@/models/project-model";
import Modal from "@/components/modal";

interface ProjectListProps {
  loading: boolean;
}
const ProjectList: React.FC<ProjectListProps> = ({ loading }) => {
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const projects = useProjectStore((state) => state.projects);
  const viewMode = useProjectStore((state) => state.viewMode);
  const setViewMode = useProjectStore((state) => state.setViewMode);
  const searchTerm = useProjectStore((state) => state.searchTerm);
  const setSearchTerm = useProjectStore((state) => state.setSearchTerm);
  const setDebouncedSearchTerm = useProjectStore(
    (state) => state.setDebouncedSearchTerm,
  );
  const debouncedSearchTerm = useProjectStore(
    (state) => state.debouncedSearchTerm,
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
  );

  if (loading) {
    return <SkeletonList />;
  }

  const onClearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
  };

  const onOpenEdit = (project: Project) => {
    setProjectToEdit(project);
    setIsOpenEdit(true);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-evenly items-center gap-4 my-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Bucar proyecto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="dark:bg-zinc-950 w-80 dark:text-white"
          />
          <Button onClick={onClearSearch}>
            <Eraser color="white" />
          </Button>
        </div>
        <Tabs
          value={viewMode}
          onValueChange={setViewMode}
          className="w-[200px]"
        >
          <TabsList className="grid grid-cols-2 dark:bg-zinc-800 w-full">
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs value={viewMode} className="w-full">
        <TabsContent
          value="grid"
          className="mt-0 pt-2 border dark:border-zinc-600 rounded-md h-[500px] overflow-y-scroll scrollbar scrollbar-thumb-zinc-400 scrollbar-track-zinc-300 dark:scrollbar-thumb-zinc-950 dark:scrollbar-track-zinc-800"
        >
          <ProjectCard projects={filteredProjects} onOpenEdit={onOpenEdit} />
        </TabsContent>

        <TabsContent
          value="list"
          className="mt-0 pt-2 border dark:border-zinc-600 rounded-md h-[500px] overflow-y-scroll scrollbar scrollbar-thumb-zinc-400 scrollbar-track-zinc-300 dark:scrollbar-thumb-zinc-950 dark:scrollbar-track-zinc-800"
        >
          <ProjectTable projects={filteredProjects} onOpenEdit={onOpenEdit} />
        </TabsContent>
      </Tabs>

      {isOpenEdit && projectToEdit && (
        <Modal
          open={isOpenEdit}
          setOpen={setIsOpenEdit}
          project={projectToEdit}
        />
      )}
    </div>
  );
};

export default ProjectList;
