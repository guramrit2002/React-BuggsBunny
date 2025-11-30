import { useState, useEffect } from 'react';
import '../App.css';
import Blog from '../components/Blog';
import Navbar from '../components/navbar';
import axios from 'axios';
import { MdNavigateNext } from 'react-icons/md';
import { GrFormPrevious } from 'react-icons/gr';
import { useAuth } from '../contexts/authcontexts';
import { GiRabbitHead } from "react-icons/gi";

function Bloglist() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [navTab, setNavTab] = useState(0);
    const [lastKey, setLastKey] = useState(null);
    const { currentUser } = useAuth();
    const [apiLoading,setApiLoading] = useState(true)

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                if (!currentUser) {
                    throw new Error('User is not authenticated');
                }

                const idToken = await currentUser.getIdToken(true);
                const response = await axios.get('https://buggsbunny01.pythonanywhere.com/', {
                    headers: {
                        Authorization: `Bearer ${idToken}`
                    },
                });
                setApiLoading(false)
                setBlogs(response.data.blogs);
                setLastKey(response.data.last_key);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
                setApiLoading(false)
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [currentUser]);

    if (loading) {
        return <div style={{'display':'flex','alignItems':'center','justifyContent':'center','width':'100%','height':'fit-content','min-height':'100vh','fontSize':'60px'}}>
            <GiRabbitHead/>
            <p>Loading...</p>
        </div>;
    }

    if (error) {
        return <p>Error loading blogs: {error}</p>;
    }

    const handleNext = () => {
        if (navTab < lastKey) {
            setNavTab(navTab + 1);
        }
    };

    const handlePrevious = () => {
        if (navTab > 0) {
            setNavTab(navTab - 1);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container" style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <div className="blogs">
                
                    {blogs[navTab]?.map((blog) => (
                        <>
                        <Blog key={blog.id} title={blog.title} body={blog.body} date={blog.created_on} url={blog.url} id={blog.id} />
                        </>
                    ))}
                </div>
                <div className="tab-btn">
                    <button onClick={handlePrevious}>
                        <GrFormPrevious />
                    </button>
                    <button onClick={handleNext}>
                        <MdNavigateNext />
                    </button>
                </div>
                
            </div>
            <footer>
                <div className="footer-container">
                    <p>@BuggsBunny</p>
                </div>
            </footer>
            
        </>
    );
}

export default Bloglist;
