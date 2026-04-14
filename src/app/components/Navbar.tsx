import { useNavigate } from 'react-router-dom';
import { LogOut, Home } from 'lucide-react';

export function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  navigate('/');
};

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/80">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 group"
            >
              <div className="size-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">PA</span>
              </div>
              <span className="font-semibold text-xl text-foreground bg-gradient-to-r from-violet-500 to-purple-600 supports-[(-webkit-background-clip:text)]:bg-clip-text supports-[(-webkit-background-clip:text)]:text-transparent">
                PromptArena AI
              </span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-foreground hover:bg-accent transition-colors"
            >
              <Home className="size-4" />
              <span>Dashboard</span>
            </button>

            {username && (
  <div className="flex items-center gap-3 px-4 py-2 bg-accent/50 rounded-lg">
    <div className="size-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
      <span className="text-white text-sm font-medium">
        {username.charAt(0).toUpperCase()}
      </span>
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-medium text-foreground">
        {username}
      </span>
    </div>
  </div>
)}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="size-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
