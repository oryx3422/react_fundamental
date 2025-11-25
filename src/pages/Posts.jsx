import { useState, useEffect, useRef } from "react";
import axios from "axios";

import PostForm from "../components/PostForm";
import MyModal from "../components/UI/modal/MyModal";
import MySelect from "../components/UI/select/MySelect";
import PostFilter from "../components/PostFilter";
import PostList from "../components/PostList";
import Pagination from "../components/UI/pagination/Pagination";

import MyButton from "../components/UI/button/MyButton";
import Loader from "../components/UI/Loader/Loader";

import { usePosts } from "../hooks/usePosts";
import PostService from "../API/PostService";
import { useFetching } from "../hooks/useFetching";
import { getPageCount } from "../components/utils/pages";
import { useObserver } from "../hooks/useObserver";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState({ sort: "", query: "" });
  const [modal, setModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const lastElement = useRef();

  const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
    const response = await PostService.getAll(limit, page);
    setPosts([...posts, ...response.data]);
    const totalCount = response.headers["x-total-count"];
    setTotalPages(getPageCount(totalCount, limit));
  });

  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);

  useObserver(lastElement, page < totalPages, isPostsLoading, () => {
    setPage(page + 1);
  });

  useEffect(() => {
    fetchPosts(limit, page);
  }, [page, limit]);

  const createPost = (newPost) => {
    setPosts([...posts, newPost]);
    setModal(false);
  };

  const removePost = (post) => {
    setPosts(posts.filter((p) => p.id !== post.id));
  };

  const changePage = (page) => {
    setPage(page);
  };

  return (
    <div className="App">
      <MyButton style={{ marginTop: 30 }} onClick={() => setModal(true)}>
        Создать пост
      </MyButton>
      <MyModal visible={modal} setVisible={setModal}>
        <PostForm create={createPost} />
      </MyModal>

      <hr style={{ margin: "15px 0" }} />

      <PostFilter filter={filter} setFilter={setFilter} />
      {postError && <h1>Ошибка ${postError}</h1>}

      <MySelect
        value={limit}
        onChange={(value) => setLimit(value)}
        defaultValue={"Кол-во элементов на странице"}
        options={[
          { value: 5, name: "5" },
          { value: 10, name: "10" },
          { value: 50, name: "50" },
          { value: -1, name: "Показать все" },
        ]}
      ></MySelect>

      <PostList
        remove={removePost}
        posts={sortedAndSearchedPosts}
        title={"Список постов"}
      />
      <div ref={lastElement} style={{ background: "red", height: 20 }}></div>
      {isPostsLoading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 50,
          }}
        >
          <Loader />
        </div>
      )}

      <Pagination changePage={changePage} page={page} totalPages={totalPages} />
    </div>
  );
}

export default Posts;
