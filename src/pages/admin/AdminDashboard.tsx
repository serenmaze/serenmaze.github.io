import { FileText, Eye, Heart, MessageSquare, TrendingUp, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useBlog } from '../../contexts/BlogContext';

export function AdminDashboard() {
  const { state } = useBlog();
  const stats = state.stats?.dashboard;
  const primaryColor = state.config?.site.theme.primaryColor || '#283473';

  const COLORS = [primaryColor, '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const statsCards = [
    {
      title: '总文章数',
      value: stats?.totalArticles || 0,
      icon: FileText,
      color: 'bg-blue-500',
      change: '+2 本月'
    },
    {
      title: '总阅读量',
      value: stats?.totalViews || 0,
      icon: Eye,
      color: 'bg-green-500',
      change: '+12% 本周'
    },
    {
      title: '总点赞数',
      value: stats?.totalLikes || 0,
      icon: Heart,
      color: 'bg-red-500',
      change: '+8% 本周'
    },
    {
      title: '总评论数',
      value: stats?.totalComments || 0,
      icon: MessageSquare,
      color: 'bg-purple-500',
      change: '+5 本周'
    }
  ];

  const recentArticles = state.articles
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 5);

  const pendingComments = state.comments.filter(comment => !comment.isApproved);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">仪表板</h1>
        <p className="text-gray-600">欢迎回来，{state.currentUser?.name}</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value.toLocaleString()}</p>
                  <p className="text-sm text-green-600 mt-1">{card.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 每周阅读量趋势 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">每周阅读量</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats?.weeklyViews || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="views" 
                stroke={primaryColor} 
                strokeWidth={2}
                dot={{ fill: primaryColor, strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 分类统计 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">文章分类分布</h3>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats?.categoryStats || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${percentage.toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {(stats?.categoryStats || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 热门文章 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">热门文章</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats?.topArticles || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="views" fill={primaryColor} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 底部区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最新文章 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">最新文章</h3>
          <div className="space-y-4">
            {recentArticles.map((article) => (
              <div key={article.id} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <img 
                  src={article.featuredImage} 
                  alt={article.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 line-clamp-1">
                    {article.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {format(new Date(article.publishedAt), 'yyyy年MM月dd日', { locale: zhCN })}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{article.views}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Heart className="w-3 h-3" />
                      <span>{article.likes}</span>
                    </span>
                    <span 
                      className={`px-2 py-1 rounded text-white text-xs ${
                        article.isPublished ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                    >
                      {article.isPublished ? '已发布' : '草稿'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 待审核评论 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            待审核评论 ({pendingComments.length})
          </h3>
          <div className="space-y-4">
            {pendingComments.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">暂无待审核评论</p>
              </div>
            ) : (
              pendingComments.slice(0, 5).map((comment) => (
                <div key={comment.id} className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">{comment.author}</span>
                        <span className="text-sm text-gray-500">
                          {format(new Date(comment.createdAt), 'MM月dd日 HH:mm', { locale: zhCN })}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm line-clamp-2">
                        {comment.content}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors">
                        通过
                      </button>
                      <button className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors">
                        拒绝
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 快速操作 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">快速操作</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            onClick={() => window.location.href = '/admin/articles/new'}
          >
            <FileText className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">写新文章</span>
          </button>
          
          <button 
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            onClick={() => window.location.href = '/admin/articles'}
          >
            <Eye className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">管理文章</span>
          </button>
          
          <button 
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
            onClick={() => window.location.href = '/admin/comments'}
          >
            <MessageSquare className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">管理评论</span>
          </button>
          
          <button 
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-colors"
            onClick={() => window.location.href = '/admin/settings'}
          >
            <Users className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">系统设置</span>
          </button>
        </div>
      </div>
    </div>
  );
}
