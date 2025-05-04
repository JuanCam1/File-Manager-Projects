import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from "@tanstack/react-router";

import { routeTree } from "../routeTree.gen";
import { Toaster } from "sonner";

const memoryHistory = createMemoryHistory({
  initialEntries: ["/"],
});

const router = createRouter({ routeTree, history: memoryHistory });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function Main() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster duration={2000} richColors />
    </>
  );
}
