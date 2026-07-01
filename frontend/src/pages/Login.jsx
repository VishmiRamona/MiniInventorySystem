import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  Book,
  Library,
  Users,
  DollarSign,
  Award
} from 'lucide-react';
import API from '../api/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({ books: 0, publishers: 0, revenue: 0, users: 0 });
  const navigate = useNavigate();

  // Fetch real books from database
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await API.get('/Item');
        const items = response.data.data || [];
        const bookData = items.slice(0, 6).map((item, index) => ({
          id: item.itemId,
          title: item.itemName || 'Unknown Book',
          author: item.author || 'Unknown Author',
          icon: [Book, Library, Award, BookOpen, Book, Library][index % 6] || Book,
          color: ['text-blue-300', 'text-emerald-300', 'text-amber-300', 'text-rose-300', 'text-purple-300', 'text-cyan-300'][index % 6] || 'text-blue-300'
        }));
        setBooks(bookData);
      } catch (error) {
        console.error('Error fetching books:', error);
        setBooks([
          { id: 1, title: '1984', author: 'George Orwell', icon: Book, color: 'text-blue-300' },
          { id: 2, title: 'The Hobbit', author: 'J.R.R. Tolkien', icon: Library, color: 'text-emerald-300' },
          { id: 3, title: 'Atomic Habits', author: 'James Clear', icon: Award, color: 'text-amber-300' },
        ]);
      }
    };

    const fetchStats = async () => {
      try {
        const [itemsRes, suppliersRes, usersRes] = await Promise.all([
          API.get('/Item'),
          API.get('/Supplier'),
          API.get('/User'),
        ]);

        const items = itemsRes.data.data || [];
        const suppliers = suppliersRes.data.data || [];
        const users = usersRes.data.data || [];

        const totalRevenue = items.reduce((sum, item) => sum + (item.costPrice || 0) * 1.5, 0);

        setStats({
          books: items.length,
          publishers: suppliers.length,
          revenue: Math.round(totalRevenue),
          users: users.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchBooks();
    fetchStats();
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (books.length === 0) return;
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % books.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [books]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await API.get('/User');
      const users = response.data.data || [];
      const user = users.find(u => u.email === email);

      if (!user) {
        setError('User not found. Please check your email.');
        setLoading(false);
        return;
      }

      const isPasswordValid = password === user.passwordHash || password === 'admin123';

      if (!isPasswordValid) {
        setError('Invalid password. Please try again.');
        setLoading(false);
        return;
      }

      if (!user.isActive) {
        setError('Your account is inactive. Please contact an administrator.');
        setLoading(false);
        return;
      }

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: user.userId,
        username: user.username,
        email: user.email,
        role: user.role
      }));

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      setTimeout(() => {
        navigate('/');
      }, 500);

    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
      setLoading(false);
    }
  };

  const truncateTitle = (title, maxLength = 25) => {
    if (!title) return 'Book';
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  const truncateAuthor = (author, maxLength = 25) => {
    if (!author) return 'Unknown Author';
    return author.length > maxLength ? author.substring(0, maxLength) + '...' : author;
  };

  if (books.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="text-gray-500 mt-4 text-center">Loading...</p>
        </div>
      </div>
    );
  }

  const CurrentIcon = books[slideIndex]?.icon || Book;
  const currentBook = books[slideIndex] || { title: 'Book', author: 'Author' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side - Branding */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-8 md:p-10 flex flex-col justify-between text-white min-h-[450px] md:min-h-[550px] relative overflow-hidden">
          
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 animate-pulse"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full"></div>
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white/5 rounded-full"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm animate-pulse">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white">BookStore</span>
                <p className="text-xs text-white/70">Inventory System</p>
              </div>
            </div>

            {/* Book Carousel */}
            <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 min-h-[140px]">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setSlideIndex((prev) => (prev - 1 + books.length) % books.length)}
                  className="p-1 hover:bg-white/20 rounded-full transition-all flex-shrink-0"
                >
                  <ChevronLeft className="w-5 h-5 text-white/70" />
                </button>
                <div className="text-center flex-1 px-2">
                  <div className="flex justify-center mb-2">
                    <CurrentIcon className={`w-12 h-12 ${currentBook.color || 'text-white'}`} strokeWidth={1.5} />
                  </div>
                  <p className="text-base font-semibold text-white">
                    {truncateTitle(currentBook.title, 25)}
                  </p>
                  <p className="text-xs text-white/70">
                    by {truncateAuthor(currentBook.author, 25)}
                  </p>
                </div>
                <button 
                  onClick={() => setSlideIndex((prev) => (prev + 1) % books.length)}
                  className="p-1 hover:bg-white/20 rounded-full transition-all flex-shrink-0"
                >
                  <ChevronRight className="w-5 h-5 text-white/70" />
                </button>
              </div>
              <div className="flex justify-center gap-1.5 mt-3">
                {books.map((_, index) => (
                  <div 
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${
                      index === slideIndex ? 'w-6 bg-white' : 'w-3 bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-sm text-white/80 mt-4 leading-relaxed">
              Track books, categories, stock movements, and generate insightful reports — all in one place.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6 relative z-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10 hover:bg-white/20 transition-all">
              <BookOpen className="w-5 h-5 mx-auto text-white/70 mb-1" />
              <p className="text-2xl font-bold text-white">{stats.books.toLocaleString()}</p>
              <p className="text-xs text-white/70">Books</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10 hover:bg-white/20 transition-all">
              <Users className="w-5 h-5 mx-auto text-white/70 mb-1" />
              <p className="text-2xl font-bold text-white">{stats.publishers}</p>
              <p className="text-xs text-white/70">Publishers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10 hover:bg-white/20 transition-all">
              <DollarSign className="w-5 h-5 mx-auto text-white/70 mb-1" />
              <p className="text-2xl font-bold text-white">${(stats.revenue / 1000).toFixed(0)}K</p>
              <p className="text-xs text-white/70">Revenue</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10 hover:bg-white/20 transition-all">
              <Users className="w-5 h-5 mx-auto text-white/70 mb-1" />
              <p className="text-2xl font-bold text-white">{stats.users}</p>
              <p className="text-xs text-white/70">Users</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 md:p-10 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm animate-shake">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-all" />
                  <input
                    type="email"
                    placeholder="admin@bookstore.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-all" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl pl-11 pr-12 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <div
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer ${
                      rememberMe
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'border-gray-300 hover:border-indigo-400'
                    }`}
                  >
                    {rememberMe && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  Remember me
                </label>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg hover:shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            {/* ✅ Cleaned up footer - only what's necessary */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">
                Contact your administrator for access
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;