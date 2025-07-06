import { useState } from 'react';
import { Save, User, Globe, Palette, Shield, Database } from 'lucide-react';
import { useBlog } from '../../contexts/BlogContext';

export function AdminSettings() {
  const { state, dispatch } = useBlog();
  const [activeTab, setActiveTab] = useState('site');
  const [loading, setLoading] = useState(false);

  const [siteSettings, setSiteSettings] = useState({
    title: state.config?.site.title || '',
    subtitle: state.config?.site.subtitle || '',
    description: state.config?.site.description || '',
    author: state.config?.site.author || '',
    email: state.config?.site.email || '',
    url: state.config?.site.url || ''
  });

  const [themeSettings, setThemeSettings] = useState({
    primaryColor: state.config?.site.theme.primaryColor || '#283473',
    secondaryColor: state.config?.site.theme.secondaryColor || '#f8fafc',
    accentColor: state.config?.site.theme.accentColor || '#3b82f6'
  });

  const [socialSettings, setSocialSettings] = useState({
    github: state.config?.social.github || '',
    twitter: state.config?.social.twitter || '',
    linkedin: state.config?.social.linkedin || ''
  });

  const [userSettings, setUserSettings] = useState({
    name: state.currentUser?.name || '',
    email: state.currentUser?.email || '',
    bio: state.currentUser?.bio || '',
    avatar: state.currentUser?.avatar || ''
  });

  const handleSaveSiteSettings = async () => {
    setLoading(true);
    try {
      // 模拟保存操作
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 更新配置
      if (state.config) {
        const updatedConfig = {
          ...state.config,
          site: {
            ...state.config.site,
            ...siteSettings,
            theme: state.config.site.theme
          }
        };
        dispatch({ type: 'SET_CONFIG', payload: updatedConfig });
      }
      
      alert('网站设置保存成功！');
    } catch (error) {
      alert('保存失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveThemeSettings = async () => {
    setLoading(true);
    try {
      // 模拟保存操作
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (state.config) {
        const updatedConfig = {
          ...state.config,
          site: {
            ...state.config.site,
            theme: themeSettings
          }
        };
        dispatch({ type: 'SET_CONFIG', payload: updatedConfig });
      }
      
      alert('主题设置保存成功！页面将刷新以应用新主题。');
      window.location.reload();
    } catch (error) {
      alert('保存失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSocialSettings = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (state.config) {
        const updatedConfig = {
          ...state.config,
          social: socialSettings
        };
        dispatch({ type: 'SET_CONFIG', payload: updatedConfig });
      }
      
      alert('社交链接保存成功！');
    } catch (error) {
      alert('保存失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'site', name: '网站设置', icon: Globe },
    { id: 'theme', name: '主题设置', icon: Palette },
    { id: 'social', name: '社交链接', icon: Globe },
    { id: 'user', name: '个人信息', icon: User },
    { id: 'security', name: '安全设置', icon: Shield },
    { id: 'data', name: '数据管理', icon: Database }
  ];

  const primaryColor = state.config?.site.theme.primaryColor || '#283473';

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
        <p className="text-gray-600">管理网站配置和个人设置</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 侧边导航 */}
        <div className="lg:w-64">
          <nav className="bg-white rounded-xl shadow-lg p-4">
            <ul className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                        isActive 
                          ? 'text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      style={{
                        backgroundColor: isActive ? primaryColor : undefined
                      }}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* 主要内容 */}
        <div className="flex-1">
          {/* 网站设置 */}
          {activeTab === 'site' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">网站基本信息</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      网站标题
                    </label>
                    <input
                      type="text"
                      value={siteSettings.title}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      网站副标题
                    </label>
                    <input
                      type="text"
                      value={siteSettings.subtitle}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, subtitle: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    网站描述
                  </label>
                  <textarea
                    rows={3}
                    value={siteSettings.description}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      作者姓名
                    </label>
                    <input
                      type="text"
                      value={siteSettings.author}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, author: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      联系邮箱
                    </label>
                    <input
                      type="email"
                      value={siteSettings.email}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveSiteSettings}
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-3 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Save className="w-5 h-5" />
                  <span>{loading ? '保存中...' : '保存设置'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 主题设置 */}
          {activeTab === 'theme' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">主题颜色配置</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      主色调
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={themeSettings.primaryColor}
                        onChange={(e) => setThemeSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={themeSettings.primaryColor}
                        onChange={(e) => setThemeSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      次色调
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={themeSettings.secondaryColor}
                        onChange={(e) => setThemeSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={themeSettings.secondaryColor}
                        onChange={(e) => setThemeSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      强调色
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={themeSettings.accentColor}
                        onChange={(e) => setThemeSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                        className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={themeSettings.accentColor}
                        onChange={(e) => setThemeSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* 颜色预览 */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">预览效果</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div 
                      className="h-20 rounded-lg flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: themeSettings.primaryColor }}
                    >
                      主色调
                    </div>
                    <div 
                      className="h-20 rounded-lg flex items-center justify-center text-gray-700 font-medium border"
                      style={{ backgroundColor: themeSettings.secondaryColor }}
                    >
                      次色调
                    </div>
                    <div 
                      className="h-20 rounded-lg flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: themeSettings.accentColor }}
                    >
                      强调色
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveThemeSettings}
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-3 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Save className="w-5 h-5" />
                  <span>{loading ? '保存中...' : '保存主题'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 社交链接 */}
          {activeTab === 'social' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">社交媒体链接</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub
                  </label>
                  <input
                    type="url"
                    value={socialSettings.github}
                    onChange={(e) => setSocialSettings(prev => ({ ...prev, github: e.target.value }))}
                    placeholder="https://github.com/username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={socialSettings.twitter}
                    onChange={(e) => setSocialSettings(prev => ({ ...prev, twitter: e.target.value }))}
                    placeholder="https://twitter.com/username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={socialSettings.linkedin}
                    onChange={(e) => setSocialSettings(prev => ({ ...prev, linkedin: e.target.value }))}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={handleSaveSocialSettings}
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-3 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Save className="w-5 h-5" />
                  <span>{loading ? '保存中...' : '保存链接'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 其他标签的占位内容 */}
          {activeTab === 'user' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">个人信息</h3>
              <p className="text-gray-600">个人信息设置功能开发中...</p>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">安全设置</h3>
              <p className="text-gray-600">安全设置功能开发中...</p>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">数据管理</h3>
              <p className="text-gray-600">数据导入导出功能开发中...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
