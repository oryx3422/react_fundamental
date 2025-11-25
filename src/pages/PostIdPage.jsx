import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFetching } from "../hooks/useFetching";
import PostService from "../API/PostService";
import Loader from "../components/UI/Loader/Loader";

const PostIdPage = () => {
  const params = useParams();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [fetchPostById, isLoading, error] = useFetching(async (id) => {
    const response = await PostService.getById(id);
    setPost(response.data);
  });

  const [fetchComments, isCommLoading, CommError] = useFetching(async (id) => {
    const response = await PostService.getPostCommentsById(id);
    setComments(response.data);
  });

  useEffect(() => {
    fetchPostById(params.id);
    fetchComments(params.id);
  }, []);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          {post.id}. {post.title}
        </div>
      )}
      <h1>Комментарии</h1>
      <div>
        {isCommLoading ? (
          <Loader />
        ) : (
          <div>
            {comments.map((comm) => (
              <div key={comm.id} style={{ marginBottom: 30 }}>
                <h5 style={{ margin: 0 }}>{comm.email}</h5>
                <div>{comm.body}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostIdPage;
