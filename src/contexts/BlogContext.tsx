import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// 数据类型定义
export interface Author {
  name: string;
  avatar: string;
  bio: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  author: Author;
  publishedAt: string;
  updatedAt: string;
  isPublished: boolean;
  readTime: number;
  views: number;
  likes: number;
}

export interface Comment {
  id: string;
  articleId: string;
  author: string;
  email: string;
  content: string;
  createdAt: string;
  isApproved: boolean;
  replies?: Comment[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar: string;
  bio: string;
  createdAt: string;
  isActive: boolean;
}

export interface SiteConfig {
  site: {
    title: string;
    subtitle: string;
    description: string;
    author: string;
    email: string;
    url: string;
    logo: string;
    heroImage: string;
    theme: {
      primaryColor: string;
      secondaryColor: string;
      accentColor: string;
    };
  };
  social: {
    github: string;
    twitter: string;
    linkedin: string;
  };
  navigation: Array<{
    name: string;
    path: string;
  }>;
}

export interface Stats {
  dashboard: {
    totalArticles: number;
    publishedArticles: number;
    draftArticles: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    pendingComments: number;
    weeklyViews: Array<{ day: string; views: number }>;
    topArticles: Array<{ id: string; title: string; views: number }>;
    categoryStats: Array<{ name: string; count: number; percentage: number }>;
  };
}

// 状态接口
interface BlogState {
  articles: Article[];
  comments: Comment[];
  users: User[];
  config: SiteConfig | null;
  stats: Stats | null;
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// 动作类型
type BlogAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ARTICLES'; payload: Article[] }
  | { type: 'SET_COMMENTS'; payload: Comment[] }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'SET_CONFIG'; payload: SiteConfig }
  | { type: 'SET_STATS'; payload: Stats }
  | { type: 'SET_AUTH'; payload: { user: User | null; isAuthenticated: boolean } }
  | { type: 'ADD_ARTICLE'; payload: Article }
  | { type: 'UPDATE_ARTICLE'; payload: Article }
  | { type: 'DELETE_ARTICLE'; payload: string }
  | { type: 'ADD_COMMENT'; payload: Comment }
  | { type: 'UPDATE_COMMENT'; payload: Comment }
  | { type: 'DELETE_COMMENT'; payload: string }
  | { type: 'LIKE_ARTICLE'; payload: string };

// 初始状态
const initialState: BlogState = {
  articles: [],
  comments: [],
  users: [],
  config: null,
  stats: null,
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Reducer
function blogReducer(state: BlogState, action: BlogAction): BlogState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_ARTICLES':
      return { ...state, articles: action.payload };
    case 'SET_COMMENTS':
      return { ...state, comments: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'SET_CONFIG':
      return { ...state, config: action.payload };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'SET_AUTH':
      return { 
        ...state, 
        currentUser: action.payload.user, 
        isAuthenticated: action.payload.isAuthenticated 
      };
    case 'ADD_ARTICLE':
      return { ...state, articles: [action.payload, ...state.articles] };
    case 'UPDATE_ARTICLE':
      return {
        ...state,
        articles: state.articles.map(article =>
          article.id === action.payload.id ? action.payload : article
        ),
      };
    case 'DELETE_ARTICLE':
      return {
        ...state,
        articles: state.articles.filter(article => article.id !== action.payload),
      };
    case 'ADD_COMMENT':
      return { ...state, comments: [...state.comments, action.payload] };
    case 'UPDATE_COMMENT':
      return {
        ...state,
        comments: state.comments.map(comment =>
          comment.id === action.payload.id ? action.payload : comment
        ),
      };
    case 'DELETE_COMMENT':
      return {
        ...state,
        comments: state.comments.filter(comment => comment.id !== action.payload),
      };
    case 'LIKE_ARTICLE':
      return {
        ...state,
        articles: state.articles.map(article =>
          article.id === action.payload 
            ? { ...article, likes: article.likes + 1 }
            : article
        ),
      };
    default:
      return state;
  }
}

// 上下文
const BlogContext = createContext<{
  state: BlogState;
  dispatch: React.Dispatch<BlogAction>;
  loadData: () => Promise<void>;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  resetData: () => Promise<void>;
} | null>(null);

// Provider 组件
export function BlogProvider({ children }: { children: ReactNode }) {
  // 数据持久化助手函数
  const saveToLocalStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(`blog_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error(`保存${key}数据到本地存储失败:`, error);
    }
  };

  const getFromLocalStorage = (key: string) => {
    try {
      const data = localStorage.getItem(`blog_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`从本地存储读取${key}数据失败:`, error);
      return null;
    }
  };

  // 包装reducer以添加持久化功能
  const persistentReducer = (state: BlogState, action: BlogAction): BlogState => {
    const newState = blogReducer(state, action);
    
    // 只对数据变更操作进行持久化
    switch (action.type) {
      case 'SET_ARTICLES':
      case 'ADD_ARTICLE':
      case 'UPDATE_ARTICLE':
      case 'DELETE_ARTICLE':
      case 'LIKE_ARTICLE':
        saveToLocalStorage('articles', newState.articles);
        break;
      case 'SET_COMMENTS':
      case 'ADD_COMMENT':
      case 'UPDATE_COMMENT':
      case 'DELETE_COMMENT':
        saveToLocalStorage('comments', newState.comments);
        break;
      case 'SET_USERS':
        saveToLocalStorage('users', newState.users);
        break;
      case 'SET_CONFIG':
        saveToLocalStorage('config', newState.config);
        break;
      case 'SET_STATS':
        saveToLocalStorage('stats', newState.stats);
        break;
    }
    
    return newState;
  };

  const [state, dispatch] = useReducer(persistentReducer, initialState);

  // 加载数据
  const loadData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // 优先从localStorage读取数据，如果没有则从JSON文件读取
      let articles = getFromLocalStorage('articles');
      let comments = getFromLocalStorage('comments');
      let users = getFromLocalStorage('users');
      let config = getFromLocalStorage('config');
      let stats = getFromLocalStorage('stats');

      // 如果localStorage中没有数据，从JSON文件加载
      if (!articles || !comments || !users || !config || !stats) {
        const [articlesRes, commentsRes, usersRes, configRes, statsRes] = await Promise.all([
          fetch('/data/articles.json'),
          fetch('/data/comments.json'),
          fetch('/data/users.json'),
          fetch('/data/config.json'),
          fetch('/data/stats.json'),
        ]);

        if (!articles) {
          articles = await articlesRes.json();
          saveToLocalStorage('articles', articles);
        }
        if (!comments) {
          comments = await commentsRes.json();
          saveToLocalStorage('comments', comments);
        }
        if (!users) {
          users = await usersRes.json();
          saveToLocalStorage('users', users);
        }
        if (!config) {
          config = await configRes.json();
          saveToLocalStorage('config', config);
        }
        if (!stats) {
          stats = await statsRes.json();
          saveToLocalStorage('stats', stats);
        }
      }

      dispatch({ type: 'SET_ARTICLES', payload: articles });
      dispatch({ type: 'SET_COMMENTS', payload: comments });
      dispatch({ type: 'SET_USERS', payload: users });
      dispatch({ type: 'SET_CONFIG', payload: config });
      dispatch({ type: 'SET_STATS', payload: stats });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '数据加载失败' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // 登录
  const login = async (username: string, password: string): Promise<boolean> => {
    // 模拟登录验证
    if (username === 'admin' && password === 'admin123') {
      const adminUser = state.users.find(user => user.username === 'admin');
      if (adminUser) {
        dispatch({ 
          type: 'SET_AUTH', 
          payload: { user: adminUser, isAuthenticated: true } 
        });
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        return true;
      }
    }
    return false;
  };

  // 登出
  const logout = () => {
    dispatch({ 
      type: 'SET_AUTH', 
      payload: { user: null, isAuthenticated: false } 
    });
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
  };

  // 重置数据到原始状态
  const resetData = async () => {
    // 清除本地存储的数据
    localStorage.removeItem('blog_articles');
    localStorage.removeItem('blog_comments');
    localStorage.removeItem('blog_users');
    localStorage.removeItem('blog_config');
    localStorage.removeItem('blog_stats');
    
    // 重新加载原始数据
    await loadData();
  };

  // 检查本地存储的认证状态
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const currentUser = localStorage.getItem('currentUser');
    
    if (isAuthenticated && currentUser) {
      dispatch({ 
        type: 'SET_AUTH', 
        payload: { user: JSON.parse(currentUser), isAuthenticated: true } 
      });
    }
  }, []);

  // 初始化数据
  useEffect(() => {
    loadData();
  }, []);

  return (
    <BlogContext.Provider value={{ state, dispatch, loadData, login, logout, resetData }}>
      {children}
    </BlogContext.Provider>
  );
}

// 自定义 Hook
export function useBlog() {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
}
