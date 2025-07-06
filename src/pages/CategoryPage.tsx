import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Eye, Heart, Tag, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useBlog } from '../contexts/BlogContext';
import { Article } from '../contexts/BlogContext';

export function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const { state } = useBlog();
  const [categoryArticles, setCategoryArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (category) {
      const articles = state.articles
        .filter(article => article.category === decodeURIComponent(category) && article.isPublished)
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      setCategoryArticles(articles);
    }
  }, [category, state.articles]);

  const primaryColor = state.config?.site.theme.primaryColor || '#283473';
  const decodedCategory = category ? decodeURIComponent(category) : '';

  return (
    <div className="min-h-screen">
      {/* 分类头部 */}
      <section 
        className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 text-white py-16"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {decodedCategory}
          </h1>
          <p className="text-lg text-blue-100 mb-6">
            找到 {categoryArticles.length} 篇关于"{decodedCategory}"的文章
          </p>
          <nav className="flex items-center justify-center space-x-2 text-sm">
            <Link to="/" className="text-blue-200 hover:text-white transition-colors">
              首页
            </Link>
            <span className="text-blue-300">/</span>
            <span className="text-white">{decodedCategory}</span>
          </nav>
        </div>
      </section>

      {/* 文章列表 */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 主要内容 */}
          <main className="flex-1">
            {categoryArticles.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Tag className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  暂无文章
                </h3>
                <p className="text-gray-600 mb-6">
                  "{decodedCategory}"分类下还没有发布文章
                </p>
                <Link 
                  to="/"
                  className="inline-flex items-center px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: primaryColor }}
                >
                  返回首页
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {categoryArticles.map((article) => (
                  <article key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img 
                          src={article.featuredImage} 
                          alt={article.title}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span 
                            className="px-3 py-1 rounded-full text-white text-xs font-medium"
                            style={{ backgroundColor: primaryColor }}
                          >
                            {article.category}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {format(new Date(article.publishedAt), 'yyyy年MM月dd日', { locale: zhCN })}
                            </span>
                          </div>
                        </div>

                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                          <Link to={`/article/${article.slug}`}>
                            {article.title}
                          </Link>
                        </h2>

                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{article.readTime} 分钟</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{article.views}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4" />
                              <span>{article.likes}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {article.tags.slice(0, 3).map(tag => (
                              <span 
                                key={tag}
                                className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                              >
                                <Tag className="w-3 h-3" />
                                <span>{tag}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <img 
                                src={article.author.avatar} 
                                alt={article.author.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {article.author.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {article.author.bio}
                                </p>
                              </div>
                            </div>

                            <Link 
                              to={`/article/${article.slug}`}
                              className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                              style={{ backgroundColor: primaryColor }}
                            >
                              阅读全文
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </main>

          {/* 侧边栏 */}
          <aside className="lg:w-80">
            <div className="space-y-6">
              {/* 分类统计 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">分类统计</h3>
                <div className="space-y-3">
                  {[...new Set(state.articles.map(article => article.category))].map(cat => {
                    const count = state.articles.filter(article => article.category === cat && article.isPublished).length;
                    const isActive = cat === decodedCategory;
                    
                    return (
                      <Link
                        key={cat}
                        to={`/category/${encodeURIComponent(cat)}`}
                        className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                          isActive 
                            ? 'text-white' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        style={{
                          backgroundColor: isActive ? primaryColor : undefined
                        }}
                      >
                        <span>{cat}</span>
                        <span className={`text-sm ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                          {count}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* 热门标签 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">热门标签</h3>
                <div className="flex flex-wrap gap-2">
                  {[...new Set(
                    categoryArticles.flatMap(article => article.tags)
                  )].slice(0, 15).map(tag => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 最新文章 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">最新文章</h3>
                <div className="space-y-4">
                  {state.articles
                    .filter(article => article.isPublished)
                    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
                    .slice(0, 5)
                    .map((article) => (
                      <div key={article.id} className="group">
                        <Link 
                          to={`/article/${article.slug}`}
                          className="block"
                        >
                          <div className="flex items-start space-x-3">
                            <img 
                              src={article.featuredImage} 
                              alt={article.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {article.title}
                              </h4>
                              <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                                <Calendar className="w-3 h-3" />
                                <span>
                                  {format(new Date(article.publishedAt), 'MM月dd日', { locale: zhCN })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
