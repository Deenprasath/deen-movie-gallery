import React, { useEffect, useState } from 'react';

function App() {
  const [movies, setMovies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/movies')
      .then((response) => response.json())
      .then(data => {
        setMovies(data);
        setFiltered(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not fetch movies');
        setLoading(false);
      });
  }, []);

  const doSearch = (val) => {
    setSearch(val);
    setFiltered(
      movies.filter(m =>
        m.title.toLowerCase().includes(val.toLowerCase()) ||
        (m.genres && m.genres.some(g => g.toLowerCase().includes(val.toLowerCase())))
      )
    );
  };

  const uniqueGenres = Array.from(new Set(movies.flatMap(m => m.genres || [])));

  function filterGenre(genre) {
    setFiltered(movies.filter(m => m.genres?.includes(genre)));
    setSearch('');
  }

  function clearGenre() {
    setFiltered(movies);
    setSearch('');
  }

  return (
    <div style={{
      fontFamily: 'Segoe UI, Verdana, Arial, sans-serif',
      padding: '32px',
      background: 'linear-gradient(120deg, #EEF2F6 0%, #E6E8FC 100%)',
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Frosted glass blur background */}
      <div
        style={{
          position: "absolute", left: "-60px", top: "40px", width: "520px", height: "460px",
          background: "linear-gradient(135deg,rgba(197,247,213,0.24),rgba(149,167,242,0.19),rgba(247,206,248,0.25))",
          filter: "blur(80px)", zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute", right: "-80px", bottom: "0", width: "590px", height: "350px",
          background: "linear-gradient(120deg,rgba(251,229,186,0.17),rgba(206,159,252,0.14))",
          filter: "blur(80px)", zIndex: 0,
        }}
      />

      {/* Top-right designer badge */}
      <div style={{
        position: 'fixed',
        top: '30px',
        right: '40px',
        zIndex: 9,
        background: 'linear-gradient(90deg, #8957af 0%, #e86a92 100%)',
        color: '#fff',
        padding: '9px 27px 8px 27px',
        borderRadius: '16px',
        fontSize: '1.15rem',
        fontFamily: 'Oswald, Segoe UI, Arial, sans-serif',
        fontWeight: 700,
        letterSpacing: '3px',
        boxShadow: '0 2px 12px #dbafe4',
        border: '2px solid #b084cc'
      }}>
        DeenStream List
      </div>
      <h1 style={{
        fontSize: '2.5rem',
        marginBottom: '28px',
        color: '#32094b',
        fontWeight: 'bold',
        letterSpacing: '2px',
        textAlign: 'center',
        background: 'linear-gradient(90deg, #8957af 10%, #e86a92 80%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 2px 12px #ece8fa'
      }}>
        🎬 My Movie Gallery
      </h1>
      {/* Search Bar */}
      <div style={{
        textAlign: 'center',
        marginBottom: '23px'
      }}>
        <input
          type="text"
          placeholder="Search by title or genre..."
          value={search}
          onChange={e => doSearch(e.target.value)}
          style={{
            width: "300px",
            fontSize: "1.05rem",
            padding: "9px 14px",
            borderRadius: "7px",
            border: "1.5px solid #b29cd3",
            marginRight: "10px",
            boxShadow: "0 2px 20px #efefef"
          }}
        />
        <button
          style={{
            background: 'linear-gradient(90deg, #8957af 0%, #e86a92 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '7px',
            fontWeight: 600,
            fontSize: '1rem',
            boxShadow: '0 2px 6px #ded4e4',
            padding: '9px 14px',
            cursor: 'pointer',
            marginLeft: '8px'
          }}
          onClick={clearGenre}
        >
          Show All
        </button>
      </div>

      {/* Genre Filtering */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '28px'
      }}>
        {uniqueGenres.map(genre => (
          <span
            key={genre}
            style={{
              background: 'linear-gradient(90deg, #b084cc 0%, #f7cacd 100%)',
              color: '#32094b',
              fontWeight: 500,
              borderRadius: '15px',
              padding: '6px 20px',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px #ece4f3',
              border: search === genre ? "2px solid #8957af" : "2px solid transparent"
            }}
            onClick={() => filterGenre(genre)}
          >
            {genre}
          </span>
        ))}
      </div>

      {/* Loading Spinner */}
      {loading &&
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          marginTop: '50px', fontSize: '2rem', color: '#e86a92'
        }}>
          <span className="loader"></span> Loading movies...
        </div>
      }
      {error && <div style={{ color: 'crimson', marginBottom: '22px', textAlign: 'center', fontWeight: 600 }}>{error}</div>}
      {!loading && filtered.length === 0 && <div style={{ textAlign: 'center' }}>No movies found.</div>}

      {/* Movie Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '38px',
          marginTop: '10px',
        }}
      >
        {filtered.map((m) => (
          <div
            key={m.imdbId}
            style={{
              background: 'rgba(255,255,255,0.97)',
              borderRadius: '18px',
              boxShadow: '0 8px 36px #dfc2f2',
              overflow: 'hidden',
              textAlign: 'center',
              padding: '22px 11px 32px 11px',
              transition: 'transform 0.22s, box-shadow 0.18s',
              willChange: 'transform'
            }}
            className="movie-card"
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-7px) scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
          >
            <div style={{
              position: "relative", width: "100%", display: 'flex', justifyContent: 'center'
            }}>
              <img
                src={m.poster}
                alt={m.title}
                style={{
                  width: "180px",
                  height: "260px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  boxShadow: "0 2px 12px #DED4E4",
                  marginBottom: "10px",
                  transition: "box-shadow 0.2s"
                }}
                className="movie-poster"
                onMouseOver={e => e.currentTarget.style.boxShadow = "0 4px 32px #e86a92"}
                onMouseOut={e => e.currentTarget.style.boxShadow = "0 2px 12px #DED4E4"}
              />
              <div style={{
                position: "absolute", top: "8px", right: "12px", fontSize: "1.2rem",
                background: "#e86a92", borderRadius: "50%", color: "white", width: "32px", height: "32px",
                display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 'bold',
                boxShadow: "0 2px 6px #ded4e4"
              }} title={m.genres && m.genres[0]}>
                {m.genres && m.genres[0]?.charAt(0)}
              </div>
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '1.18rem', marginBottom: '7px', color: '#541970', letterSpacing: '1px'}}>
              {m.title}
            </div>
            <div style={{ color: '#888', fontSize: '1.05rem', marginBottom: '7px'}}>
              <span style={{ color: '#9E53D8', fontWeight: 600 }}>IMDB:</span> {m.imdbId}
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginBottom: "8px" }}>
              {m.genres && m.genres.slice(0,2).map(g => (
                <span key={g} style={{
                  background: 'linear-gradient(90deg, #b084cc 0%, #f7cacd 100%)',
                  color: '#32094b',
                  fontWeight: 500,
                  borderRadius: '12px',
                  padding: '4px 13px',
                  fontSize: '0.95rem',
                  boxShadow: '0 1px 8px #e9e4f3',
                  marginLeft: '2px'
                }}>{g}</span>
              ))}
            </div>
            <button
              style={{
                background: 'linear-gradient(90deg, #8957af 0%, #e86a92 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1.05rem',
                boxShadow: '0 2px 6px #ded4e4',
                padding: '8px 16px',
                cursor: 'pointer',
                marginTop: '5px',
                transition: 'background 0.17s'
              }}
              onClick={() => window.open(m.trailerLink, '_blank')}
            >
              🎥 Trailer
            </button>
          </div>
        ))}
      </div>

      {/* Loader CSS */}
      <style>
        {`
          .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #e86a92;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            animation: spin 1s linear infinite;
            display: inline-block;
          }
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}
      </style>
    </div>
  );
}

export default App;
