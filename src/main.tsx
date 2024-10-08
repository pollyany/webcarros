import { createRoot } from "react-dom/client";
import { router } from "./App";
import "./index.css";

import { RouterProvider } from "react-router-dom";
import AuthProvider from "./contexts/AuthContext";

createRoot(document.getElementById("root") as HTMLElement).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
