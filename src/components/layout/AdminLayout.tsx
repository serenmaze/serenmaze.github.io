import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, LayoutDashboard, FileText, MessageSquare, 
  Settings, LogOut, User, Home
} from 'lucide-react';
import { useBlog } from '../../contexts/BlogContext';

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { state, logout } = useBlog();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navigation = [
    { name: '仪表板', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: '文章管理', href: '/admin/articles', icon: FileText },
    { name: '评论管理', href: '/admin/comments', icon: MessageSquare },
    { name: '系统设置', href: '/admin/settings', icon: Settings },
  ];

  const primaryColor = state.config?.site.theme.primaryColor || '#283473';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 移动端侧边栏遮罩 */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img 
              src={state.config?.site.logo} 
              alt="Logo" 
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-lg font-bold" style={{ color: primaryColor }}>
              管理后台
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                      ${isActive 
                        ? 'text-white shadow-lg' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                    style={{
                      backgroundColor: isActive ? primaryColor : undefined
                    }}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 pt-4 border-t border-gray-200">
            <Link
              to="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>返回博客</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* 主内容区域 */}
      <div className="lg:ml-64">
        {/* 顶部导航栏 */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={state.currentUser?.avatar} 
                  alt="User Avatar" 
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {state.currentUser?.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {state.currentUser?.role === 'admin' ? '管理员' : '用户'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">退出</span>
              </button>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
