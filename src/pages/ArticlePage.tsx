import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, Heart, Tag, Calendar, MessageSquare, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useBlog } from '../contexts/BlogContext';
import { Article, Comment } from '../contexts/BlogContext';
import { CommentSection } from '../components/CommentSection';

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useBlog();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const foundArticle = state.articles.find(a => a.slug === slug && a.isPublished);
    if (foundArticle) {
      setArticle(foundArticle);
      
      // 查找相关文章
      const related = state.articles
        .filter(a => 
          a.id !== foundArticle.id && 
          a.isPublished && 
          (a.category === foundArticle.category || 
           a.tags.some(tag => foundArticle.tags.includes(tag)))
        )
        .slice(0, 3);
      setRelatedArticles(related);
    } else {
      navigate('/');
    }
  }, [slug, state.articles, navigate]);

  const handleLike = () => {
    if (article && !liked) {
      dispatch({ type: 'LIKE_ARTICLE', payload: article.id });
      setLiked(true);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = article?.title || '';
    
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        console.log('分享取消');
      }
    } else {
      // 复制到剪贴板
      navigator.clipboard.writeText(url);
      alert('链接已复制到剪贴板');
    }
  };

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  const primaryColor = state.config?.site.theme.primaryColor || '#283473';
  const articleComments = state.comments.filter(comment => 
    comment.articleId === article.id && comment.isApproved
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 返回按钮 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回</span>
        </button>
      </div>

      {/* 文章头部 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 mb-4">
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

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {article.title}
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              {article.excerpt}
            </p>

            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{article.readTime} 分钟阅读</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{article.views} 次阅读</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{article.likes} 次点赞</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-4 h-4" />
                <span>{articleComments.length} 条评论</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 特色图片 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="relative z-10">
          <img 
            src={article.featuredImage} 
            alt={article.title}
            className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
          />
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 文章内容 */}
          <main className="flex-1">
            <article className="bg-white rounded-xl shadow-lg p-8">
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    code({className, children, ...props}: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      const isInline = !match;
                      return !isInline ? (
                        <SyntaxHighlighter
                          style={oneDark as any}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    h1: ({children}) => <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">{children}</h1>,
                    h2: ({children}) => <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-3">{children}</h2>,
                    h3: ({children}) => <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">{children}</h3>,
                    p: ({children}) => <p className="text-gray-700 leading-relaxed mb-4">{children}</p>,
                    ul: ({children}) => <ul className="list-disc list-inside space-y-1 mb-4 text-gray-700">{children}</ul>,
                    ol: ({children}) => <ol className="list-decimal list-inside space-y-1 mb-4 text-gray-700">{children}</ol>,
                    blockquote: ({children}) => (
                      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 text-gray-700 italic">
                        {children}
                      </blockquote>
                    ),
                    table: ({children}) => (
                      <div className="overflow-x-auto mb-4">
                        <table className="min-w-full border border-gray-300">{children}</table>
                      </div>
                    ),
                    th: ({children}) => (
                      <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left">{children}</th>
                    ),
                    td: ({children}) => (
                      <td className="border border-gray-300 px-4 py-2">{children}</td>
                    ),
                  }}
                >
                  {article.content}
                </ReactMarkdown>
              </div>

              {/* 标签 */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                  <Tag className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 font-medium">标签：</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 作者信息和操作按钮 */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={article.author.avatar} 
                      alt={article.author.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {article.author.name}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {article.author.bio}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleLike}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        liked 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                      <span>{article.likes + (liked ? 1 : 0)}</span>
                    </button>

                    <button
                      onClick={handleShare}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>分享</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* 评论区域 */}
            <div className="mt-8">
              <CommentSection articleId={article.id} comments={articleComments} />
            </div>
          </main>

          {/* 侧边栏 */}
          <aside className="lg:w-80">
            {/* 相关文章 */}
            {relatedArticles.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">相关文章</h3>
                <div className="space-y-4">
                  {relatedArticles.map(relatedArticle => (
                    <div key={relatedArticle.id} className="group">
                      <Link 
                        to={`/article/${relatedArticle.slug}`}
                        className="block"
                      >
                        <div className="flex items-start space-x-3">
                          <img 
                            src={relatedArticle.featuredImage} 
                            alt={relatedArticle.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {relatedArticle.title}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                              <Eye className="w-3 h-3" />
                              <span>{relatedArticle.views}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 目录（如果需要的话） */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">分享</h3>
              <div className="space-y-2">
                <button
                  onClick={handleShare}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>分享文章</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span>打印文章</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
