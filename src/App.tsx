import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

// Public Pages
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Research from './pages/Research';
import History from './pages/History';
import Team from './pages/public/Team';
import News from './pages/News';
import FAQ from './pages/FAQ';
import ResearchPaperDetail from './pages/ResearchPaperDetail';
import ProjectDetail from './pages/ProjectDetail';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import TeamMembers from './pages/admin/TeamMembers';
import AdminProjects from './pages/admin/Projects';
import AdminResearch from './pages/admin/Research';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        
        {/* Research Areas Routes */}
        <Route path="/research" element={<Layout><Research /></Layout>} />
        <Route path="/research/:paperId" element={<Layout><ResearchPaperDetail /></Layout>} />
        <Route path="/research/nlp" element={<Layout><Navigate to="/research#nlp" replace /></Layout>} />
        <Route path="/research/vision" element={<Layout><Navigate to="/research#vision" replace /></Layout>} />
        <Route path="/research/quantum" element={<Layout><Navigate to="/research#quantum" replace /></Layout>} />
        <Route path="/research/security" element={<Layout><Navigate to="/research#security" replace /></Layout>} />
        
        {/* Projects Routes */}
        <Route path="/projects" element={<Layout><Projects /></Layout>} />
        <Route path="/projects/:projectId" element={<Layout><ProjectDetail /></Layout>} />
        <Route path="/projects/ai-agriculture" element={<Layout><Navigate to="/projects#ai-agriculture" replace /></Layout>} />
        <Route path="/projects/blockchain" element={<Layout><Navigate to="/projects#blockchain" replace /></Layout>} />
        <Route path="/projects/deepfake-detection" element={<Layout><Navigate to="/projects#deepfake-detection" replace /></Layout>} />
        <Route path="/projects/machine-learning" element={<Layout><Navigate to="/projects#machine-learning" replace /></Layout>} />
        
        {/* Other Public Routes */}
        <Route path="/history" element={<Layout><History /></Layout>} />
        <Route path="/news" element={<Layout><News /></Layout>} />
        <Route path="/team" element={<Layout><Team /></Layout>} />
        <Route path="/faq" element={<Layout><FAQ /></Layout>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="team" element={<TeamMembers />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="research" element={<AdminResearch />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        } />

        {/* 404 - Not Found */}
        <Route path="*" element={
          <Layout>
            <div className="container py-20 text-center">
              <h1 className="text-5xl font-bold mb-4">404</h1>
              <p className="text-xl mb-8">Page not found</p>
              <a href="/" className="btn btn-primary">Go Home</a>
            </div>
          </Layout>
        } />
      </Routes>
    </AuthProvider>
  );
}
export default App;

