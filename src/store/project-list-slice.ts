import type { StateCreator } from "zustand";

export interface ProjectListSlice {
  searchTerm: string;
  viewMode: string;
  debouncedSearchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  setViewMode: (viewMode: string) => void;
  setDebouncedSearchTerm: (debouncedSearchTerm: string) => void;
}

export const createProjectListSlice: StateCreator<
  ProjectListSlice,
  [["zustand/devtools", never]]
> = (set) => ({
  searchTerm: "",
  viewMode: "grid",
  debouncedSearchTerm: "",
  setSearchTerm: (searchTerm: string) => set({ searchTerm }),
  setViewMode: (viewMode: string) => set({ viewMode }),
  setDebouncedSearchTerm: (debouncedSearchTerm: string) =>
    set({ debouncedSearchTerm }),
});
