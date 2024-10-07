import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./components/logIn/Login";
import SignUp from "./components/logIn/Signup";
import Landingpage from "./components/landingpage/Landingpage";
import Dashboard from "./components/landingpage/dashboard/Dashboard";
import Products from "./components/landingpage/products/Products";
import Billing from "./components/landingpage/billing/Billing";
import Addproduct from "./components/landingpage/products/Addproduct";
import Addbill from "./components/landingpage/billing/Addbill";
import BillDetails from "./components/landingpage/billing/Billingdetails";
import Myacount from "./components/landingpage/myacount/Myacount";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
      errorElement: <h1>Error 404! Page Not Found!</h1>,
    },

    {
      path: "/signup",
      element: <SignUp />,
      errorElement: <h1>Error 404! Page Not Found!</h1>,
    },

    {
      path: "/landingpage",
      element: <Landingpage />,
      errorElement: <h1>Error 404! Page Not Found!</h1>,
      children: [
        {
          path: "/landingpage/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/landingpage/products",
          element: <Products />,
        },
        {
          path: "/landingpage/billing",
          element: <Billing />,
        },
        {
          path: "/landingpage/products/app-product",
          element: <Addproduct />,
        },
        {
          path: "/landingpage/billing/app-bill",
          element: <Addbill />,
        },
        {
          path: "/landingpage/billing/details",
          element: <BillDetails />,
        },
        {
          path: "/landingpage/myacount",
          element: <Myacount />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
