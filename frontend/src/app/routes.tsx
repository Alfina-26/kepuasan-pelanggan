import { createBrowserRouter } from "react-router";
import Root from "./pages/Root";
import Login from "./pages/Login";
import Register from "./pages/register"; // ← TAMBAH INI
import AdminDashboard from "./pages/ManagerDashboard";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerSurvey from "./pages/CustomerSurvey";
import CustomerSurveyHistory from "./pages/CustomerSurveyHistory";
import UploadDataset from "./pages/UploadDataset";
import Training from "./pages/Training";
import Evaluation from "./pages/Evaluation";
import Prediction from "./pages/Prediction";
import Visualization from "./pages/Visualization";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Login },
      { path: "login", Component: Login },
      { path: "register", Component: Register }, // ← TAMBAH INI
      { path: "admin", Component: AdminDashboard },
      { path: "developer", Component: DeveloperDashboard },
      { path: "customer", Component: CustomerDashboard },
      { path: "customer-survey", Component: CustomerSurvey },
      { path: "customer-survey-history", Component: CustomerSurveyHistory },
      { path: "upload", Component: UploadDataset },
      { path: "training", Component: Training },
      { path: "evaluation", Component: Evaluation },
      { path: "prediction", Component: Prediction },
      { path: "visualization", Component: Visualization },
      { path: "reports", Component: Reports },
      { path: "*", Component: NotFound },
    ],
  },
]);