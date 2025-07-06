import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Eye, ArrowLeft, Image } from 'lucide-react';
import { useBlog } from '../../contexts/BlogContext';
import { Article } from '../../contexts/BlogContext';

export function ArticleEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useBlog();
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: '',
    tags: '',
    isPublished: false
  });
  
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      const article = state.articles.find(a => a.id === id);
      if (article) {
        setFormData({
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          featuredImage: article.featuredImage,
          category: article.category,
          tags: article.tags.join(', '),
          isPublished: article.isPublished
        });
        setIsEditing(true);
      }
    }
  }, [id, state.articles]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const articleData: Article = {
        id: id || Date.now().toString(),
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        featuredImage: formData.featuredImage || '/images/tech-article.webp',
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        author: state.currentUser ? {
          name: state.currentUser.name,
          avatar: state.currentUser.avatar,
          bio: state.currentUser.bio
        } : {
          name: '管理员',
          avatar: '/images/admin-avatar.jpg',
          bio: '博客管理员'
        },
        publishedAt: isEditing ? state.articles.find(a => a.id === id)?.publishedAt || new Date().toISOString() : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublished: formData.isPublished,
        readTime: Math.ceil(formData.content.length / 200),
        views: isEditing ? state.articles.find(a => a.id === id)?.views || 0 : 0,
        likes: isEditing ? state.articles.find(a => a.id === id)?.likes || 0 : 0
      };

      if (isEditing) {
        dispatch({ type: 'UPDATE_ARTICLE', payload: articleData });
      } else {
        dispatch({ type: 'ADD_ARTICLE', payload: articleData });
      }

      navigate('/admin/articles');
    } catch (error) {
      console.error('保存文章失败:', error);
      alert('保存失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const primaryColor = state.config?.site.theme.primaryColor || '#283473';
  const categories = [...new Set(state.articles.map(article => article.category))];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/articles')}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? '编辑文章' : '新建文章'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? '修改现有文章内容' : '创建一篇新的博客文章'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本信息 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">基本信息</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                文章标题 *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="输入文章标题..."
                required
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                URL别名 *
              </label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="url-alias"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                分类 *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">选择分类</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
                <option value="技术">技术</option>
                <option value="生活">生活</option>
                <option value="思考">思考</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                标签
              </label>
              <input
                type="text"
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="用逗号分隔多个标签，如：React, JavaScript, 前端"
              />
            </div>

            <div className="lg:col-span-2">
              <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-2">
                特色图片URL
              </label>
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <input
                    type="url"
                    id="featuredImage"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <button
                  type="button"
                  className="px-4 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Image className="w-5 h-5" />
                </button>
              </div>
              {formData.featuredImage && (
                <img 
                  src={formData.featuredImage} 
                  alt="预览" 
                  className="mt-3 w-32 h-20 object-cover rounded-lg"
                />
              )}
            </div>

            <div className="lg:col-span-2">
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                文章摘要 *
              </label>
              <textarea
                id="excerpt"
                rows={3}
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="简要描述文章内容..."
                required
              />
            </div>
          </div>
        </div>

        {/* 文章内容 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">文章内容</h3>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Markdown内容 *
            </label>
            <textarea
              id="content"
              rows={20}
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
              placeholder="在这里使用Markdown语法编写文章内容..."
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              支持完整的Markdown语法，包括代码块、表格、列表等。
            </p>
          </div>
        </div>

        {/* 发布设置 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">发布设置</h3>
          
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
              立即发布文章
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            取消勾选将保存为草稿，可以稍后发布
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/articles')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          
          {formData.title && formData.content && (
            <button
              type="button"
              className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Eye className="w-5 h-5" />
              <span>预览</span>
            </button>
          )}
          
          <button
            type="submit"
            disabled={loading || !formData.title || !formData.content}
            className="flex items-center space-x-2 px-6 py-3 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: primaryColor }}
          >
            <Save className="w-5 h-5" />
            <span>
              {loading ? '保存中...' : (isEditing ? '更新文章' : '保存文章')}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
