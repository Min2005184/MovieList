// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from './NavigationBar/Menu';
import routes from './Routers/route-config';
import './App.css';
import { AuthProvider } from './components/AuthContext';
import { ProfileProvider } from './pages/UserProfile/useProfile';
import { CommentsProvider } from './pages/REVIEW/CommentContext';
import { SearchProvider, useSearch } from './NavigationBar/SearchContext';

function App() {
  return (
    <div className="container">
      <AuthProvider>
        <ProfileProvider> {/* Wrap with ProfileProvider */}
          <CommentsProvider>
            <SearchProvider>
              <BrowserRouter>
                <Menu />
                <Routes>
                  {routes.map((route) => (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={<route.component />}
                    />
                  ))}
                </Routes>
              </BrowserRouter>
            </SearchProvider>
          </CommentsProvider>
        </ProfileProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
