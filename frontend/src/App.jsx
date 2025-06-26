import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';

function App() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("/api/v1/videos/feed");
        setVideos(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className="h-screen w-screen bg-[#121212] text-white overflow-hidden">
      <Navbar />
      <div className="flex h-[calc(100vh-64px)]"> {/* Assuming navbar is 64px, adjust as needed */}
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <section className="min-h-full p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {videos.map((video) => (
                <div className="w-full" key={video._id}>
                  <div className="relative mb-2 w-full pt-[56.25%]"> {/* More precise 16:9 ratio */}
                    <div className="absolute inset-0">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="h-full w-full object-cover rounded-lg transition-transform duration-200 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <span className="absolute bottom-2 right-2 inline-block rounded bg-black/80 backdrop-blur-sm px-2 py-1 text-xs font-medium text-white">
                      {video.duration || "0:00"}
                    </span>
                  </div>
                  <div className="flex gap-x-3">
                    <div className="h-9 w-9 shrink-0">
                      <img
                        src={video.channel?.avatar}
                        alt={video.channel?.name || "Channel"}
                        className="h-full w-full rounded-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0"> {/* min-w-0 prevents flex overflow */}
                      <h6 className="mb-1 font-semibold text-white line-clamp-2 text-sm leading-tight">
                        {video.title}
                      </h6>
                      <p className="text-xs text-gray-400 mb-1">
                        {video.channel?.name || "Unknown Channel"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {video.views} views · {new Date(video.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
