import { Link } from 'react-router-dom';
import '../App.css';
import { useAuth } from '../contexts/authcontexts';

function Navbar() {
    const { logout, currentUser } = useAuth();

    async function handleLogout() {
        try {
            await logout();
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    }

    return (
        <nav className='navbar'>
            <div className='Logo'>
                <h1>Buggsbunny</h1>
            </div>
            <ul className='tabs'>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/blogs">Blog</Link></li>
                <li><Link to="/newblog">Create New</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                {currentUser ?(
                    <li><Link onClick={handleLogout}>Logout</Link></li>
                    
                ):(
                    <li><Link to={"/login"}>Login</Link></li>
                )
            }
            </ul>
        </nav>
    );
}

export default Navbar;
