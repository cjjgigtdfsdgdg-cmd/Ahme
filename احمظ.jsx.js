import React, { useEffect, useState } from "react";

export default function MovieApp() {
  const defaultMovies = [
    {
      id: 1,
      title: "رحلة الفضاء",
      year: 2023,
      rating: 8.2,
      description: "فيلم خيالي قصير عن مغامرة في الفضاء.",
      poster: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 2,
      title: "سر المدينة",
      year: 2021,
      rating: 7.5,
      description: "إثارة وتشويق في شوارع المدينة.",
      poster: "https://images.unsplash.com/photo-1517604931442-9ee5d5d4f9f8?w=800&auto=format&fit=crop&q=60",
    },
  ];

  const [movies, setMovies] = useState(() => {
    try {
      const raw = localStorage.getItem("my_movies_ui");
      return raw ? JSON.parse(raw) : defaultMovies;
    } catch {
      return defaultMovies;
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem("my_favorites_ui");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    localStorage.setItem("my_movies_ui", JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    localStorage.setItem("my_favorites_ui", JSON.stringify(favorites));
  }, [favorites]);

  function openEdit(movie) {
    if (!editMode) return;
    setEditing({ ...movie });
    setShowModal(true);
  }

  function openView(movie) {
    if (editMode) return openEdit(movie);
    setViewing(movie);
  }

  function openNew() {
    const newMovie = {
      id: Date.now(),
      title: "فيلم جديد",
      year: new Date().getFullYear(),
      rating: 0,
      description: "اكتب وصفًا للفيلم...",
      poster: "https://via.placeholder.com/400x600?text=Movie+Poster",
    };
    setMovies((m) => [newMovie, ...m]);
    openEdit(newMovie);
  }

  function saveEdit() {
    setMovies((m) => m.map((it) => (it.id === editing.id ? editing : it)));
    setShowModal(false);
    setEditing(null);
  }

  function removeMovie(id) {
    if (!confirm("هل أنت متأكد من حذف هذا الفيلم؟")) return;
    setMovies((m) => m.filter((it) => it.id !== id));
    setFavorites((f) => f.filter((it) => it.id !== id));
  }

  function onPosterFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setEditing((ed) => ({ ...ed, poster: url }));
  }

  function checkPassword() {
    if (password === "20092009") {
      setEditMode(true);
      setShowLogin(false);
      setPassword("");
    } else {
      alert("كلمة السر غير صحيحة");
    }
  }

  function addToFavorites(movie) {
    if (!favorites.find((f) => f.id === movie.id)) {
      setFavorites((f) => [...f, movie]);
      alert("تم الإضافة بنجاح");
    } else {
      alert("الفيلم موجود بالفعل في المفضلات");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold">🎬 مكتبة الأفلام</h1>
        <div className="flex gap-2">
          {editMode ? (
            <>
              <button onClick={openNew} className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg font-semibold">إضافة فيلم</button>
              <button onClick={() => setEditMode(false)} className="bg-gray-700 px-4 py-2 rounded-lg">🔒 إخفاء التعديل</button>
            </>
          ) : (
            <>
              <button onClick={() => setShowLogin(true)} className="bg-gray-700 px-4 py-2 rounded-lg">مالك الموقع</button>
              <button onClick={() => setShowFavorites((f) => !f)} className="bg-yellow-600 px-4 py-2 rounded-lg">المفضلات</button>
            </>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="flex overflow-x-auto gap-4 pb-4">
          {(showFavorites ? favorites : movies).map((movie) => (
            <div key={movie.id} onClick={() => openView(movie)} className="bg-gray-900 rounded-xl overflow-hidden shadow-lg flex-shrink-0 w-56 cursor-pointer">
              <div className="relative w-full pt-[150%] bg-black">
                <img src={movie.poster} alt={movie.title} className="absolute inset-0 w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* نافذة عرض فقط */}
      {viewing && !editMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white text-gray-900 rounded-2xl max-w-md w-full shadow-2xl overflow-auto p-6 text-center">
            <img src={viewing.poster} alt={viewing.title} className="w-40 mx-auto rounded-lg mb-4" />
            <h3 className="text-2xl font-bold mb-2">{viewing.title}</h3>
            <p className="text-sm text-gray-600 mb-1">{viewing.year} • ⭐ {viewing.rating}</p>
            <p className="text-gray-700 mb-4">{viewing.description}</p>
            <button onClick={() => addToFavorites(viewing)} className="bg-red-600 text-white px-4 py-2 rounded-lg mr-2">أضف إلى المفضلات</button>
            <button onClick={() => setViewing(null)} className="bg-gray-700 text-white px-4 py-2 rounded-lg">خروج</button>
          </div>
        </div>
      )}

      {/* نافذة تسجيل دخول */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white text-gray-900 rounded-2xl max-w-sm w-full shadow-2xl p-6">
            <h3 className="text-xl font-bold mb-4">دخول مالك الموقع</h3>
            <input type="password" placeholder="كلمة السر" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded p-2 mb-4" />
            <button onClick={checkPassword} className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full">موافق</button>
            <button onClick={() => setShowLogin(false)} className="mt-2 bg-gray-500 text-white px-4 py-2 rounded-lg w-full">إلغاء</button>
          </div>
        </div>
      )}
    </div>
  );
}
