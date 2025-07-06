import { useState } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { MessageSquare, Reply, Send } from 'lucide-react';
import { useBlog } from '../contexts/BlogContext';
import { Comment } from '../contexts/BlogContext';

interface CommentSectionProps {
  articleId: string;
  comments: Comment[];
}

export function CommentSection({ articleId, comments }: CommentSectionProps) {
  const { dispatch } = useBlog();
  const [newComment, setNewComment] = useState({
    author: '',
    email: '',
    content: ''
  });
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.author || !newComment.email || !newComment.content) {
      alert('请填写所有必填字段');
      return;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      articleId,
      author: newComment.author,
      email: newComment.email,
      content: newComment.content,
      createdAt: new Date().toISOString(),
      isApproved: true,
      replies: []
    };

    dispatch({ type: 'ADD_COMMENT', payload: comment });
    setNewComment({ author: '', email: '', content: '' });
    alert('评论提交成功！');
  };

  const handleSubmitReply = (parentId: string) => {
    if (!replyContent.trim()) {
      alert('请输入回复内容');
      return;
    }

    const reply: Comment = {
      id: Date.now().toString(),
      articleId,
      author: '匿名用户',
      email: 'anonymous@email.com',
      content: replyContent,
      createdAt: new Date().toISOString(),
      isApproved: true
    };

    // 找到父评论并添加回复
    const parentComment = comments.find(c => c.id === parentId);
    if (parentComment) {
      const updatedComment = {
        ...parentComment,
        replies: [...(parentComment.replies || []), reply]
      };
      dispatch({ type: 'UPDATE_COMMENT', payload: updatedComment });
    }

    setReplyContent('');
    setReplyTo(null);
    alert('回复提交成功！');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center space-x-2 mb-6">
        <MessageSquare className="w-6 h-6 text-blue-600" />
        <h3 className="text-2xl font-bold text-gray-900">
          评论 ({comments.length})
        </h3>
      </div>

      {/* 评论表单 */}
      <form onSubmit={handleSubmitComment} className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">发表评论</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              姓名 *
            </label>
            <input
              type="text"
              id="author"
              value={newComment.author}
              onChange={(e) => setNewComment(prev => ({ ...prev, author: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入您的姓名"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              邮箱 *
            </label>
            <input
              type="email"
              id="email"
              value={newComment.email}
              onChange={(e) => setNewComment(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入您的邮箱"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            评论内容 *
          </label>
          <textarea
            id="content"
            rows={4}
            value={newComment.content}
            onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="请输入您的评论..."
            required
          />
        </div>

        <button
          type="submit"
          className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Send className="w-4 h-4" />
          <span>发表评论</span>
        </button>
      </form>

      {/* 评论列表 */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">还没有评论，快来发表第一条评论吧！</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              {/* 主评论 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {comment.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h5 className="font-semibold text-gray-900">{comment.author}</h5>
                    <span className="text-gray-500 text-sm">
                      {format(new Date(comment.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    {comment.content}
                  </p>
                  
                  <button
                    onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm transition-colors"
                  >
                    <Reply className="w-4 h-4" />
                    <span>回复</span>
                  </button>

                  {/* 回复表单 */}
                  {replyTo === comment.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <textarea
                        rows={3}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-3"
                        placeholder="请输入回复内容..."
                      />
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSubmitReply(comment.id)}
                          className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Send className="w-3 h-3" />
                          <span>提交回复</span>
                        </button>
                        <button
                          onClick={() => {
                            setReplyTo(null);
                            setReplyContent('');
                          }}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 回复列表 */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start space-x-3 pl-6 border-l-2 border-gray-200">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-semibold text-xs">
                                {reply.author.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h6 className="font-medium text-gray-900 text-sm">{reply.author}</h6>
                              <span className="text-gray-500 text-xs">
                                {format(new Date(reply.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
                              </span>
                            </div>
                            
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
