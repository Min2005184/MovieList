import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { useProfile } from '../pages/UserProfile/useProfile'; 
import './Menu.css';
import { useSearch } from './SearchContext';
import { Input } from 'reactstrap';

const Menu: React.FC = () => {
  const { isAuthenticated, MemberId, logout } = useAuth();
  const { profile } = useProfile();  
  const { setSearchTerm } = useSearch();
  const [ term, setTerm ] = useState("");

  const handleSearchChange = () => {
    setSearchTerm(term);
  };

  return (
    <nav className="navbar">
      <div className="container-fluid">
        <div className="navbar-brand">
          <div className="navbar-collapse">
            <NavLink className="navbar-brand" to="/">AniMin</NavLink>
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to={`/animeList/${MemberId}`}>Anime</NavLink>
              </li>
              
              {!isAuthenticated ? (
                <li className="nav-item">
                  <NavLink className="nav-link register-link" to="/register">Register</NavLink>
                </li>
              ) : (
                <li className="nav-item dropdown">
                  <div className="profile-dropdown">
                    <NavLink className="nav-link" to="/edit-profile">
                      {profile?.profileImage ? (
                        <img src={profile.profileImage} alt="Profile" className="navbar-profile-image" />
                      ) : (
                        'Profile'
                      )}
                    </NavLink>
                    <ul className="dropdown-menu">
                      <li>
                        <NavLink className="dropdown-item" to="/edit-profile">Edit Profile</NavLink>
                      </li>
                      <li>
                        <NavLink className='dropdown-item' onClick={logout} to='/animeList'>Logout</NavLink>
                      </li>
                    </ul>
                  </div>
                </li>
              )}
            </ul>
            
            <Input 
                type="text" 
                placeholder="Search..." 
                value={term} 
                onChange={(e) => setTerm(e.target.value)} 
              />
            <button onClick={handleSearchChange}>search</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
