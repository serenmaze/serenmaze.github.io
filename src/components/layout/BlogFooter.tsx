import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { useBlog } from '../../contexts/BlogContext';

export function BlogFooter() {
  const { state } = useBlog();
  const currentYear = new Date().getFullYear();

  const primaryColor = state.config?.site.theme.primaryColor || '#283473';

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 网站信息 */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src={state.config?.site.logo} 
                alt="Logo" 
                className="w-10 h-10 rounded-full object-cover"
              />
              <h3 className="text-lg font-bold" style={{ color: primaryColor }}>
                {state.config?.site.title}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              {state.config?.site.description}
            </p>
            <div className="flex space-x-4">
              <a 
                href={state.config?.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href={state.config?.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href={state.config?.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href={`mailto:${state.config?.site.email}`}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* 导航链接 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              导航
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                  首页
                </a>
              </li>
              <li>
                <a href="/category/技术" className="text-gray-600 hover:text-gray-900 transition-colors">
                  技术文章
                </a>
              </li>
              <li>
                <a href="/category/生活" className="text-gray-600 hover:text-gray-900 transition-colors">
                  生活感悟
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                  关于我
                </a>
              </li>
            </ul>
          </div>

          {/* 最新文章 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              最新文章
            </h4>
            <ul className="space-y-2">
              {state.articles.slice(0, 3).map((article) => (
                <li key={article.id}>
                  <a 
                    href={`/article/${article.slug}`}
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm line-clamp-2"
                  >
                    {article.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © {currentYear} {state.config?.site.author}. 保留所有权利。
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                隐私政策
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                使用条款
              </a>
              <a href="/admin/login" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                管理员
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
