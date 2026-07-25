import { Navigate, Route, Routes } from 'react-router-dom';

import LandingPage from '../pages/public/LandingPage/LandingPage';
import LoginPage from '../pages/public/LoginPage/LoginPage';
import RegisterPage from '../pages/public/RegisterPage/RegisterPage';
import ProjectRequirementsPage from "../pages/client/ProjectRequirementsPage/ProjectRequirementsPage";
import ProjectDetailsPage from '../pages/client/ProjectDetailsPage/ProjectDetailsPage';
import ProjectReviewPage from '../pages/client/ProjectReviewPage/ProjectReviewPage';

import ClientDashboardPage from '../pages/client/ClientDashboardPage/ClientDashboardPage';
import NewProjectPage from '../pages/client/NewProjectPage/NewProjectPage';
import ClientProjectPage from '../pages/client/ClientProjectPage/ClientProjectPage';

import TeamDashboardPage from '../pages/team/TeamDashboardPage/TeamDashboardPage';
import TeamProjectPage from '../pages/team/TeamProjectPage/TeamProjectPage';
import ProjectMessagesPage from '../pages/shared/ProjectMessagesPage/ProjectMessagesPage';
import ProjectRoadmapPage from '../pages/shared/ProjectRoadmapPage/ProjectRoadmapPage';
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
        path="/client/projects/new/details"
        element={<ProjectDetailsPage />}
      />

      <Route
        path="/client/projects/new/review"
        element={<ProjectReviewPage />}
      />

      <Route
        path="/client/projects/:projectId"
        element={<ClientProjectPage />}
      />

      <Route
        path="/client/projects/:projectId/roadmap"
        element={<ProjectRoadmapPage role="client" />}
      />

      <Route
        path="/team/projects/:projectId/roadmap"
        element={<ProjectRoadmapPage role="team" />}
      />

      <Route
        path="/team/dashboard"
        element={<TeamDashboardPage />}
      />

      <Route
        path="/team/projects/:projectId"
        element={<TeamProjectPage />}
      />

      <Route
        path="/client/projects/:projectId/messages"
        element={<ProjectMessagesPage role="client" />}
      />

      <Route
        path="/team/projects/:projectId/messages"
        element={<ProjectMessagesPage role="team" />}
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