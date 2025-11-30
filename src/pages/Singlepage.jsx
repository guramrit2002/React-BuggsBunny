import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import axios from "axios";
import { useParams } from "react-router";
import { IKContext, IKImage } from "imagekitio-react";
import { urlEndpoint } from "../imagekit/imagekitConfig";
import { useAuth } from "../contexts/authcontexts";
import { GiRabbitHead } from "react-icons/gi";
function Singlepage() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading,setLoading] = useState(false)
    const {currentUser}  = useAuth();

    useEffect(() => {
        const fetchBlog = async () => {
            try{
                if (!currentUser) {
                    throw new Error('User is not authenticated');
                }
                const idToken = await currentUser.getIdToken(true);
                axios.get(`https://buggsbunny01.pythonanywhere.com/blog/${id}`,{
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    }
                })
                .then((response) => {
                    console.log(response.data)
                    setData(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                    setError(error);
                });
            }
            catch(error){
                console.log(error)
            }
        }
        fetchBlog()
    }, [id,currentUser]);

    function extractDate(isoString) {
        const date = new Date(isoString);
        return date.toISOString().split('T')[0];
    }

    if (error) return <p>Error loading the blog post.</p>;
    if (!data) {
        return <div style={{'display':'flex','alignItems':'center','justifyContent':'center','width':'100%','height':'fit-content','min-height':'100vh','fontSize':'60px'}}>
            <GiRabbitHead/>
            <p>Loading ...</p>
        </div>;
    } // Ensure data is not null before trying to access it

    return (
        <>
            <Navbar />
            <div className='container single-blog'>
            {loading ? 
                (
                    <h1 style={{'margin':"20rem"}}>{console.log('loading....')}</h1>
                )
            :
            (
                <>
                <div className='blog-image'>
                    <IKContext urlEndpoint={urlEndpoint}>
                        <IKImage
                            urlEndpoint={urlEndpoint}
                            src={data.url}
                            style={{ 'height': '100%', 'width': '100%' }}

                        />
                    </IKContext>
                </div>
                <div className='blog-title'>
                    <h1>{data.title}</h1>
                    <div className="sub-title">
                        <p>{extractDate(data.created_on)}</p>
                        <p>{data.author}</p>
                    </div>
                </div>
                <div className='blog-content'>
                    <p>{data.body}</p>
                </div>
                </>
            )
            }
            </div>
            <footer>
                <div className='footer-container'>
                    <p>@BuggsBunny</p>
                </div>
            </footer>
        </>
    );
}

export default Singlepage;
