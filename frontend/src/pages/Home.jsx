import { useState, useEffect } from "react";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts?_limit=3")
      .then((response) => response.json())
.then((data) => {
  const announcements = [
    {
      id: data[0].id,
      title: "TechFest 2026 registrations are now open!"
    },
    {
      id: data[1].id,
      title: "Hackathon participants can now view the competition schedule."
    },
    {
      id: data[2].id,
      title: "Workshop seats are filling up. Register early to secure your spot!"
    }
  ];

  setPosts(announcements);
  setLoading(false);
})
      .catch(() => {
        setError("Could not load announcements");
        setLoading(false);
      });
  }, []);

  return (
    <div className="page">
      <h1>Welcome to TechFest 2026</h1>
      <p>Three days of hackathons, workshops and competitions.</p>

      <h2>Announcements</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;