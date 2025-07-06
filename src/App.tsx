import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BlogProvider } from './contexts/BlogContext';
import { BlogLayout } from './components/layout/BlogLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { HomePage } from './pages/HomePage';
import { ArticlePage } from './pages/ArticlePage';
import { CategoryPage } from './pages/CategoryPage';
import { AboutPage } from './pages/AboutPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminArticles } from './pages/admin/AdminArticles';
import { AdminComments } from './pages/admin/AdminComments';
import { AdminSettings } from './pages/admin/AdminSettings';
import { ArticleEditor } from './pages/admin/ArticleEditor';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <BlogProvider>
      <Router>
        <Routes>
          {/* 前端博客路由 */}
          <Route path="/" element={<BlogLayout />}>
            <Route index element={<HomePage />} />
            <Route path="article/:slug" element={<ArticlePage />} />
            <Route path="category/:category" element={<CategoryPage />} />
            <Route path="about" element={<AboutPage />} />
          </Route>

          {/* 管理员登录 */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* 管理后台路由 */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="articles" element={<AdminArticles />} />
            <Route path="articles/new" element={<ArticleEditor />} />
            <Route path="articles/edit/:id" element={<ArticleEditor />} />
            <Route path="comments" element={<AdminComments />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* 404 重定向到首页 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </BlogProvider>
  );
}

export default App;
