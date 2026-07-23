import { Navigate, Route, Routes } from 'react-router-dom';

import LandingPage from '../pages/public/LandingPage/LandingPage';
import LoginPage from '../pages/public/LoginPage/LoginPage';
import RegisterPage from '../pages/public/RegisterPage/RegisterPage';
import ProjectRequirementsPage from "../pages/client/ProjectRequirementsPage/ProjectRequirementsPage";

import ClientDashboardPage from '../pages/client/ClientDashboardPage/ClientDashboardPage';
import NewProjectPage from '../pages/client/NewProjectPage/NewProjectPage';
import ClientProjectPage from '../pages/client/ClientProjectPage/ClientProjectPage';

import TeamDashboardPage from '../pages/team/TeamDashboardPage/TeamDashboardPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage/AdminDashboardPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/client/dashboard"
        element={<ClientDashboardPage />}
      />

      <Route
        path="/client/projects/new"
        element={<NewProjectPage />}
      />

      <Route
        path="/client/projects/new/requirements"
        element={<ProjectRequirementsPage />}
      />

      <Route
        path="/client/projects/:projectId"
        element={<ClientProjectPage />}
      />

      <Route
        path="/team/dashboard"
        element={<TeamDashboardPage />}
      />

      <Route
        path="/admin/dashboard"
        element={<AdminDashboardPage />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;