import { useEffect, useState } from "react";
import Blog from "../components/Blog";
import Navbar from "../components/navbar";
import axios from "axios";
import { useAuth } from "../contexts/authcontexts";
import { GiRabbitHead } from "react-icons/gi";


function Profilepage() {
    const { currentUser } = useAuth();
    const [userBlogs, setUserBlogs] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); // Initialize loading state to true

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                if (!currentUser) {
                    throw new Error('User is not authenticated');
                }
                
                const idToken = await currentUser.getIdToken(true);
                axios.get(`https:/buggbunny01.pythonanywhere.com/getuserblogs/${currentUser.email}`, {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    }
                })
                .then((response) => {
                    setError('');
                    setUserBlogs(response.data);
                    setLoading(false); // Set loading state to false when data is fetched
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                    setError(error);
                    setLoading(false); // Set loading state to false in case of error
                });
            } catch(error) {
                console.error(error);
                setLoading(false); // Set loading state to false in case of error
            }
        };
        fetchBlog();
    }, [currentUser]);

    return (
        <>
            <Navbar />
            <div className="container" style={{ flexDirection: 'column' }}>
                <h1 className="user-head">Blogs by <span>{currentUser ? currentUser.email : 'Guest'}</span></h1>
                {loading ? ( // Conditional rendering based on loading state
                <div style={{'display':'flex','alignItems':'center','justifyContent':'center','width':'100%','fontSize':'20px','padding':'1rem'}}>
                <p>Getting your blogs be here ...</p>
            </div>
                ) : (
                    <div className='blogs'>
                    {
                        userBlogs.length > 0 ? userBlogs.map(blog => (
                            <Blog key={blog.id} title={blog.title} body={blog.body} date={blog.created_on} url={blog.url} id={blog.id} called={'profile'} />
                        )):
                        <p style={{fontSize:'20px',textAlign:'center'}}>No Blogs here !!!!</p>
                    }
                        
                    </div>
                )}
            </div>
            <footer>
                <div className='footer-container'>
                    <p>@BuggsBunny</p>
                </div>
            </footer>
        </>
    );
}

export default Profilepage;
