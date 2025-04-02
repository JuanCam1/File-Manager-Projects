import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createProjectSlice, type ProjectSlice } from "./current-slice";
import { createProjectListSlice, type ProjectListSlice } from "./project-list-slice";

type ProjectState = ProjectSlice & ProjectListSlice
export const useProjectStore = create<ProjectState>()(
  devtools(
    (...a) => ({
      ...createProjectSlice(...a),
      ...createProjectListSlice(...a),
    }),
    { name: "app-store" }
  )
);