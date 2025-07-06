import { useState } from 'react';
import { Search, MessageSquare, Check, X, Trash2, Eye, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useBlog } from '../../contexts/BlogContext';
import { Comment } from '../../contexts/BlogContext';

export function AdminComments() {
  const { state, dispatch } = useBlog();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // 过滤评论
  const filteredComments = state.comments
    .filter(comment => {
      const matchesSearch = comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           comment.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'approved' && comment.isApproved) ||
                           (statusFilter === 'pending' && !comment.isApproved);
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleApproveComment = (commentId: string) => {
    const comment = state.comments.find(c => c.id === commentId);
    if (comment) {
      const updatedComment = { ...comment, isApproved: true };
      dispatch({ type: 'UPDATE_COMMENT', payload: updatedComment });
    }
  };

  const handleRejectComment = (commentId: string) => {
    const comment = state.comments.find(c => c.id === commentId);
    if (comment) {
      const updatedComment = { ...comment, isApproved: false };
      dispatch({ type: 'UPDATE_COMMENT', payload: updatedComment });
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('确定要删除这条评论吗？此操作不可撤销。')) {
      dispatch({ type: 'DELETE_COMMENT', payload: commentId });
    }
  };

  const getArticleTitle = (articleId: string) => {
    const article = state.articles.find(a => a.id === articleId);
    return article ? article.title : '未知文章';
  };

  const primaryColor = state.config?.site.theme.primaryColor || '#283473';

  const stats = {
    total: state.comments.length,
    approved: state.comments.filter(c => c.isApproved).length,
    pending: state.comments.filter(c => !c.isApproved).length
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">评论管理</h1>
        <p className="text-gray-600">共 {stats.total} 条评论</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">总评论数</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">已通过</p>
              <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100">
              <X className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">待审核</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 搜索和过滤器 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索评论内容或作者..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">所有状态</option>
            <option value="approved">已通过</option>
            <option value="pending">待审核</option>
          </select>
        </div>
      </div>

      {/* 评论列表 */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {filteredComments.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到评论</h3>
            <p className="text-gray-600">
              {searchQuery || statusFilter !== 'all' 
                ? '请尝试调整搜索条件' 
                : '还没有收到任何评论'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredComments.map((comment) => (
              <div key={comment.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* 评论头部信息 */}
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-semibold text-sm">
                          {comment.author.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900">{comment.author}</h4>
                          <span 
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              comment.isApproved 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {comment.isApproved ? '已通过' : '待审核'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>{comment.email}</span>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {format(new Date(comment.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 评论内容 */}
                    <div className="mb-4">
                      <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                    </div>

                    {/* 文章信息 */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                      <Eye className="w-4 h-4" />
                      <span>评论文章：</span>
                      <span className="font-medium text-gray-900">
                        {getArticleTitle(comment.articleId)}
                      </span>
                    </div>

                    {/* 回复 */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="pl-6 border-l-2 border-gray-200 mt-4">
                        <h5 className="text-sm font-medium text-gray-900 mb-3">
                          回复 ({comment.replies.length})
                        </h5>
                        <div className="space-y-3">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-medium text-gray-900 text-sm">{reply.author}</span>
                                <span className="text-xs text-gray-500">
                                  {format(new Date(reply.createdAt), 'MM月dd日 HH:mm', { locale: zhCN })}
                                </span>
                              </div>
                              <p className="text-gray-700 text-sm">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div className="ml-6 flex flex-col space-y-2">
                    {!comment.isApproved ? (
                      <button
                        onClick={() => handleApproveComment(comment.id)}
                        className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                      >
                        <Check className="w-4 h-4" />
                        <span>通过</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRejectComment(comment.id)}
                        className="flex items-center space-x-1 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
                      >
                        <X className="w-4 h-4" />
                        <span>撤销</span>
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="flex items-center space-x-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>删除</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 批量操作提示 */}
      {stats.pending > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center">
            <X className="w-6 h-6 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-yellow-800">
                有 {stats.pending} 条评论待审核
              </h3>
              <p className="text-yellow-700 mt-1">
                请及时审核用户评论，保持良好的互动体验。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
