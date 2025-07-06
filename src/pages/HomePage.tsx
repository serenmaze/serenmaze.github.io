import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Clock, Eye, Heart, Tag, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useBlog } from '../contexts/BlogContext';
import { Article } from '../contexts/BlogContext';

export function HomePage() {
  const { state } = useBlog();
  const [searchParams] = useSearchParams();
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    let articles = state.articles.filter(article => article.isPublished);

    // 搜索过滤
    if (searchQuery) {
      articles = articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // 分类过滤
    if (selectedCategory) {
      articles = articles.filter(article => article.category === selectedCategory);
    }

    // 按发布时间排序
    articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    setFilteredArticles(articles);
  }, [state.articles, searchQuery, selectedCategory]);

  const categories = [...new Set(state.articles.map(article => article.category))];

  const primaryColor = state.config?.site.theme.primaryColor || '#283473';

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 text-white py-20"
        style={{
          backgroundImage: `linear-gradient(rgba(40, 52, 115, 0.8), rgba(40, 52, 115, 0.8)), url(${state.config?.site.heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {state.config?.site.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            {state.config?.site.subtitle}
          </p>
          <p className="text-lg text-blue-200 max-w-3xl mx-auto">
            {state.config?.site.description}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Articles */}
          <main className="flex-1">
            {/* 搜索结果提示 */}
            {searchQuery && (
              <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">
                  搜索 "{searchQuery}" 的结果：找到 {filteredArticles.length} 篇文章
                </p>
              </div>
            )}

            {/* 分类过滤 */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === '' 
                      ? 'text-white shadow-lg' 
                      : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === '' ? primaryColor : undefined
                  }}
                >
                  全部
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category 
                        ? 'text-white shadow-lg' 
                        : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                    }`}
                    style={{
                      backgroundColor: selectedCategory === category ? primaryColor : undefined
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles List */}
            <div className="space-y-8">
              {filteredArticles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">
                    {searchQuery ? '没有找到相关文章' : '还没有发布文章'}
                  </p>
                </div>
              ) : (
                filteredArticles.map((article) => (
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
                ))
              )}
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:w-80">
            <div className="space-y-6">
              {/* Author Info */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center">
                  <img 
                    src={state.config?.site.logo} 
                    alt="Author"
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {state.config?.site.author}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {state.config?.site.description}
                  </p>
                  <div className="flex justify-center space-x-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {state.stats?.dashboard.totalArticles} 篇文章
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {state.stats?.dashboard.totalViews} 次阅读
                    </span>
                  </div>
                </div>
              </div>

              {/* Popular Articles */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">热门文章</h3>
                <div className="space-y-4">
                  {state.articles
                    .filter(article => article.isPublished)
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 5)
                    .map((article, index) => (
                      <div key={article.id} className="flex items-start space-x-3">
                        <span 
                          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <Link 
                            to={`/article/${article.slug}`}
                            className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                          >
                            {article.title}
                          </Link>
                          <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                            <Eye className="w-3 h-3" />
                            <span>{article.views}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">标签云</h3>
                <div className="flex flex-wrap gap-2">
                  {[...new Set(state.articles.flatMap(article => article.tags))]
                    .slice(0, 20)
                    .map(tag => (
                      <span 
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
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
