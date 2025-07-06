import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, Eye, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useBlog } from '../../contexts/BlogContext';
import { Article } from '../../contexts/BlogContext';

export function AdminArticles() {
  const { state, dispatch } = useBlog();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('publishedAt');

  // 过滤和排序文章
  const filteredArticles = state.articles
    .filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === '' || article.category === selectedCategory;
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'published' && article.isPublished) ||
                           (statusFilter === 'draft' && !article.isPublished);
      
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'views':
          return b.views - a.views;
        case 'likes':
          return b.likes - a.likes;
        case 'publishedAt':
        default:
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
    });

  const categories = [...new Set(state.articles.map(article => article.category))];
  const primaryColor = state.config?.site.theme.primaryColor || '#283473';

  const handleDeleteArticle = (articleId: string) => {
    if (window.confirm('确定要删除这篇文章吗？此操作不可撤销。')) {
      dispatch({ type: 'DELETE_ARTICLE', payload: articleId });
    }
  };

  const togglePublishStatus = (article: Article) => {
    const updatedArticle = {
      ...article,
      isPublished: !article.isPublished,
      updatedAt: new Date().toISOString()
    };
    dispatch({ type: 'UPDATE_ARTICLE', payload: updatedArticle });
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和新建按钮 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">文章管理</h1>
          <p className="text-gray-600">共 {state.articles.length} 篇文章</p>
        </div>
        <Link
          to="/admin/articles/new"
          className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
          style={{ backgroundColor: primaryColor }}
        >
          <Plus className="w-5 h-5" />
          <span>新建文章</span>
        </Link>
      </div>

      {/* 搜索和过滤器 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索文章..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 分类筛选 */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">所有分类</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* 状态筛选 */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">所有状态</option>
            <option value="published">已发布</option>
            <option value="draft">草稿</option>
          </select>

          {/* 排序 */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="publishedAt">发布时间</option>
            <option value="title">标题</option>
            <option value="views">阅读量</option>
            <option value="likes">点赞数</option>
          </select>
        </div>
      </div>

      {/* 文章列表 */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到文章</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedCategory || statusFilter !== 'all' 
                ? '请尝试调整搜索条件' 
                : '还没有创建任何文章'
              }
            </p>
            <Link
              to="/admin/articles/new"
              className="inline-flex items-center space-x-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: primaryColor }}
            >
              <Plus className="w-5 h-5" />
              <span>创建第一篇文章</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    文章
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    分类/标签
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    统计
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    发布时间
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-4">
                        <img 
                          src={article.featuredImage} 
                          alt={article.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {article.excerpt}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span 
                          className="inline-block px-2 py-1 text-xs font-medium text-white rounded-full"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {article.category}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {article.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              <Tag className="w-3 h-3" />
                              <span>{tag}</span>
                            </span>
                          ))}
                          {article.tags.length > 2 && (
                            <span className="text-xs text-gray-500">+{article.tags.length - 2}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{article.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>❤️</span>
                          <span>{article.likes}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublishStatus(article)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          article.isPublished
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        } transition-colors cursor-pointer`}
                      >
                        {article.isPublished ? '已发布' : '草稿'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {format(new Date(article.publishedAt), 'yyyy-MM-dd', { locale: zhCN })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/article/${article.slug}`}
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="预览"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/articles/edit/${article.id}`}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="编辑"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 批量操作（如果需要的话） */}
      {filteredArticles.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">快速统计</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: primaryColor }}>
                {filteredArticles.filter(a => a.isPublished).length}
              </div>
              <div className="text-sm text-gray-600">已发布</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredArticles.filter(a => !a.isPublished).length}
              </div>
              <div className="text-sm text-gray-600">草稿</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredArticles.reduce((sum, a) => sum + a.views, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">总阅读量</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredArticles.reduce((sum, a) => sum + a.likes, 0)}
              </div>
              <div className="text-sm text-gray-600">总点赞数</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
