import { Mail, Github, Twitter, Linkedin, MapPin, Calendar, Code, Heart } from 'lucide-react';
import { useBlog } from '../contexts/BlogContext';

export function AboutPage() {
  const { state } = useBlog();
  const primaryColor = state.config?.site.theme.primaryColor || '#283473';

  const skills = [
    'React & TypeScript',
    'Node.js & Express',
    'MongoDB & PostgreSQL',
    'Next.js & Gatsby',
    'TailwindCSS',
    'Docker & AWS',
    'GraphQL',
    'Python'
  ];

  const timeline = [
    {
      year: '2024',
      title: '全栈工程师',
      company: '某知名科技公司',
      description: '负责前后端开发，技术栈包括React、Node.js等'
    },
    {
      year: '2022',
      title: '前端开发工程师',
      company: '创业公司',
      description: '主要负责前端产品开发和技术选型'
    },
    {
      year: '2020',
      title: '计算机科学学士',
      company: '某重点大学',
      description: '专业课程包括数据结构、算法、计算机网络等'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 text-white py-20"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <img 
              src={state.config?.site.logo} 
              alt="作者头像"
              className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-white shadow-lg"
            />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              关于{state.config?.site.author}
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              {state.config?.site.description}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* 个人介绍 */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">个人简介</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                你好！我是{state.config?.site.author}，一名充满热情的全栈开发工程师。我专注于使用现代Web技术栈构建高质量的应用程序，
                同时也热爱分享技术知识和生活感悟。
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                在技术领域，我主要专注于React生态系统、Node.js后端开发以及云原生技术。
                我相信技术应该服务于人，创造真正有价值的产品是我不断追求的目标。
              </p>
              <p className="text-gray-700 leading-relaxed">
                除了编程，我还喜欢写作、阅读和旅行。我认为技术与人文的结合能够创造出更有温度的产品，
                这也是我创建这个博客的初衷——分享技术的同时，也分享生活的思考。
              </p>
            </div>
          </section>

          {/* 联系方式 */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">联系方式</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5" style={{ color: primaryColor }} />
                  <div>
                    <span className="text-gray-600">邮箱：</span>
                    <a 
                      href={`mailto:${state.config?.site.email}`}
                      className="text-blue-600 hover:underline ml-1"
                    >
                      {state.config?.site.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5" style={{ color: primaryColor }} />
                  <div>
                    <span className="text-gray-600">位置：</span>
                    <span className="text-gray-900 ml-1">中国·北京</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Github className="w-5 h-5" style={{ color: primaryColor }} />
                  <div>
                    <span className="text-gray-600">GitHub：</span>
                    <a 
                      href={state.config?.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-1"
                    >
                      @liming
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Twitter className="w-5 h-5" style={{ color: primaryColor }} />
                  <div>
                    <span className="text-gray-600">Twitter：</span>
                    <a 
                      href={state.config?.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-1"
                    >
                      @liming
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 技能栈 */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Code className="w-6 h-6 mr-2" style={{ color: primaryColor }} />
              技能栈
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {skills.map((skill, index) => (
                <div 
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg text-center hover:shadow-md transition-shadow"
                >
                  <span className="text-gray-800 font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 时间线 */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-2" style={{ color: primaryColor }} />
              工作经历
            </h2>
            <div className="space-y-6">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div 
                    className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {item.year}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-blue-600 mb-2">{item.company}</p>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 博客统计 */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Heart className="w-6 h-6 mr-2" style={{ color: primaryColor }} />
              博客数据
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: primaryColor }}>
                  {state.stats?.dashboard.totalArticles || 0}
                </div>
                <div className="text-gray-600 text-sm">文章总数</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: primaryColor }}>
                  {state.stats?.dashboard.totalViews || 0}
                </div>
                <div className="text-gray-600 text-sm">总阅读量</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: primaryColor }}>
                  {state.stats?.dashboard.totalLikes || 0}
                </div>
                <div className="text-gray-600 text-sm">总点赞数</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: primaryColor }}>
                  {state.stats?.dashboard.totalComments || 0}
                </div>
                <div className="text-gray-600 text-sm">评论总数</div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">让我们保持联系</h2>
            <p className="text-blue-100 mb-6">
              如果你对我的文章感兴趣，或者想要交流技术话题，欢迎通过以下方式联系我。
            </p>
            <div className="flex justify-center space-x-4">
              <a 
                href={`mailto:${state.config?.site.email}`}
                className="flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>发送邮件</span>
              </a>
              <a 
                href={state.config?.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>关注 GitHub</span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
