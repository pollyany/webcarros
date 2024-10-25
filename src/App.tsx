import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./pages/home";
import CarDetail from "./pages/cars/detail";
import Login from "./pages/login";
import Private from "./routes/Private";
import ErrorPage from "./pages/error";
import Cars from "./pages/cars";
import LayoutAdmin from "./components/admin/layout";
import Dashboard from "./pages/admin/dashboard";
import New from "./pages/admin/car/new";
import Edit from "./pages/admin/car/edit";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/veiculos",
        element: <Cars />,
      },
      {
        path: "/veiculos/:id",
        element: <CarDetail />,
      },
    ],
  },
  {
    element: <LayoutAdmin />,
    children: [
      {
        path: "/dashboard",
        element: (
          <Private>
            <Dashboard />
          </Private>
        ),
      },
      {
        path: "/dashboard/new",
        element: (
          <Private>
            <New />
          </Private>
        ),
      },
      {
        path: "/dashboard/edit/:id",
        element: (
          <Private>
            <Edit />
          </Private>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export { router };
