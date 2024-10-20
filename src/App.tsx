import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./pages/home";
import CarDetail from "./pages/car";
import Dashboard from "./pages/dashboard";
import New from "./pages/dashboard/new";
import Login from "./pages/login";
import  Private  from "./routes/Private";
import Edit from "./pages/dashboard/edit";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/car/:id",
        element: <CarDetail/>
      },
      {
        path: "/dashboard",
        element: <Private><Dashboard/></Private>
      },
      {
        path: "/dashboard/new",
        element: <Private><New/></Private>
      },
      {
        path: "/dashboard/edit/:id",
        element: <Private><Edit/></Private>
      }
    ]
  },
  {
    path: "/login",
    element: <Login />,
  }
]);

export { router };
