import { useState, useEffect } from "react";
import axios from "axios";

function GetPosts() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/posts/${id}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Download function
  const downloadFile = (fileName) => {
    const fileUrl = `http://localhost:8000/uploads/${fileName}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName; // Sets the download filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const searchPosts = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      fetchPosts();
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8000/api/posts/search?query=${query}`);
      setPosts(response.data);
    } catch (error) {
      console.error("Error searching posts:", error);
    }
  };

  const downloadImage = async (fileName) => {
    try {
      const fileUrl = `http://localhost:8000/api/download/${fileName}`;
      const response = await axios.get(fileUrl, { responseType: "blob" });

      const blob = new Blob([response.data], { type: response.data.type });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName; // Suggested filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold">Posts</h2>

      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Search by title or tag..."
          value={searchQuery}
          onChange={(e) => searchPosts(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      <div className="mt-4 space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="p-4 border rounded shadow">
              <h3 className="text-lg font-bold">{post.title}</h3>
              <p>{post.content}</p>
              <p className="text-sm text-gray-500">Tags: {post.tags.join(", ")}</p>

              {post.file && (
                <div className="mt-2">
                  <img src={`http://localhost:8000/uploads/${post.file}`} alt="Post" className="w-full h-auto" />
                
                  <button 
                  onClick={() => downloadImage(post.file)} 
                  className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">
                  ⬇ Download Image
                </button>
                </div>
              )}

              <button onClick={() => deletePost(post._id)} className="mt-2 bg-red-500 text-white px-3 py-1 rounded">
                Delete
              </button>
             
            </div>
          ))
        ) : (
          <p className="text-gray-500">No posts found.</p>
        )}
      </div>
    </div>
  );
}

export default GetPosts;
