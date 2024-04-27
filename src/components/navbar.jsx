import { Link } from 'react-router-dom';
import { GiHamburgerMenu, GiRabbitHead } from "react-icons/gi";
import { useAuth } from '../contexts/authcontexts';
import { useState } from 'react';
import '../App.css';

function Navbar() {
    const { logout, currentUser } = useAuth();
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleNavbar = () => {
        setIsExpanded(!isExpanded);
    };

    const collapseNavbar = () => {
        setIsExpanded(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
            collapseNavbar(); // Collapse the navbar after logout
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    return (
        <nav className={`navbar ${isExpanded ? 'expanded' : ''}`}>
            <div className='inner-header'>
                <div className='Logo'>
                    <h1 style={{display:"flex",alignItems:"center",justifyContent:"center"}}>Buggsbunny <GiRabbitHead /></h1>
                    
                </div>
                <GiHamburgerMenu className='ham' onClick={toggleNavbar} />
            </div>
            
            <ul className={`tabs ${isExpanded ? 'visible' : 'hidden'}`} onClick={collapseNavbar}>
                <li><Link to="/" onClick={collapseNavbar}>Home</Link></li>
                <li><Link to="/blogs" onClick={collapseNavbar}>Blog</Link></li>
                <li><Link to="/newblog" onClick={collapseNavbar}>Create New</Link></li>
                <li><Link to="/profile" onClick={collapseNavbar}>Profile</Link></li>
                {currentUser ? (
                    <li><Link onClick={handleLogout}>Logout</Link></li>
                ) : (
                    <li><Link to="/login" onClick={collapseNavbar}>Login</Link></li>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
