import React, { useState, useEffect, createContext, useContext } from 'react';

// --- THEME DEFINITIONS ---
const themes = {
  theme1: {
    name: 'Minimalist',
    styles: {
      background: 'bg-gray-100',
      text: 'text-gray-800',
      primary: 'bg-blue-500',
      primaryText: 'text-white',
      font: 'font-sans',
      layout: 'max-w-4xl mx-auto px-4 py-8',
      card: 'bg-white rounded-lg shadow-md p-6',
      button: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors',
      header: 'bg-white shadow-md',
      link: 'text-gray-600 hover:text-blue-500',
      sidebar: 'hidden',
      content: 'w-full',
    },
  },
  theme2: {
    name: 'Dark Mode',
    styles: {
      background: 'bg-gray-900',
      text: 'text-gray-200',
      primary: 'bg-indigo-600',
      primaryText: 'text-white',
      font: 'font-serif',
      layout: 'flex',
      card: 'bg-gray-800 rounded-lg border border-gray-700 p-6',
      button: 'bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors',
      header: 'bg-gray-800 border-b border-gray-700',
      link: 'text-gray-300 hover:text-indigo-400',
      sidebar: 'w-64 bg-gray-800 p-5 border-r border-gray-700',
      content: 'flex-1 p-8',
    },
  },
  theme3: {
    name: 'Colorful',
    styles: {
      background: 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400',
      text: 'text-gray-800',
      primary: 'bg-yellow-400',
      primaryText: 'text-gray-900',
      font: 'font-pacifico', // Make sure to import this font in your main HTML
      layout: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8',
      card: 'bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform',
      button: 'bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-full shadow-md transition-all',
      header: 'bg-white/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-10',
      link: 'text-purple-600 hover:text-indigo-700 font-semibold',
      sidebar: 'hidden',
      content: 'w-full col-span-full', // Let content span all columns
    },
  },
};

// --- THEME CONTEXT ---
const ThemeContext = createContext(null);

// --- THEME PROVIDER ---
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('theme1');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themes[savedTheme]) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const currentTheme = themes[theme].styles;
    document.body.className = `${currentTheme.background} ${currentTheme.text} ${currentTheme.font} transition-all duration-500`;
  }, [theme]);

  const value = {
    theme,
    setTheme,
    currentTheme: themes[theme],
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// --- HOOK TO USE THEME ---
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// --- FAKE API DATA ---
const useFakeApi = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://fakestoreapi.com/products?limit=6');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProducts(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { products, loading, error };
}


// --- COMPONENTS ---
const Header = () => {
  const { theme, setTheme, currentTheme } = useTheme();
  const [page, setPage] = useState('home');

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };
  
  const headerStyle = currentTheme.styles.header;
  const linkStyle = currentTheme.styles.link;

  return (
    <header className={`${headerStyle} p-4 flex justify-between items-center`}>
      <h1 className="text-2xl font-bold">MyApp</h1>
       <nav className="hidden md:flex items-center space-x-4">
            <a href="#home" onClick={() => setPage('home')} className={`${linkStyle} ${page === 'home' ? 'font-bold' : ''}`}>Home</a>
            <a href="#about" onClick={() => setPage('about')} className={`${linkStyle} ${page === 'about' ? 'font-bold' : ''}`}>About</a>
            <a href="#contact" onClick={() => setPage('contact')} className={`${linkStyle} ${page === 'contact' ? 'font-bold' : ''}`}>Contact</a>
        </nav>
      <div>
        <select value={theme} onChange={handleThemeChange} className="bg-transparent border rounded p-2">
          {Object.keys(themes).map((key) => (
            <option key={key} value={key} className="text-gray-800">
              {themes[key].name}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
};

const Sidebar = () => {
    const { currentTheme } = useTheme();
    const { sidebar, link } = currentTheme.styles;

    if (sidebar === 'hidden') return null;

    return (
        <aside className={sidebar}>
            <h2 className="text-xl font-bold mb-5">Navigation</h2>
            <nav className="flex flex-col space-y-3">
                <a href="#home" className={link}>Home</a>
                <a href="#about" className={link}>About</a>
                <a href="#contact" className={link}>Contact</a>
            </nav>
        </aside>
    );
}

const MainContent = ({ children }) => {
    const { currentTheme } = useTheme();
    const { layout } = currentTheme.styles;
    
    // For Theme 3, we need to wrap children in a container that spans all grid columns
    if (currentTheme.name === 'Colorful') {
        return <main className={currentTheme.styles.content}>{children}</main>
    }

    return <main className={currentTheme.styles.content}>{children}</main>;
}


const Home = () => {
  const { currentTheme } = useTheme();
  const { products, loading, error } = useFakeApi();
  const { card, button, layout } = currentTheme.styles;
  
  const PageLayout = ({children}) => {
      const { layout } = currentTheme.styles;
      return <div className={layout}>{children}</div>;
  }

  return (
      <PageLayout>
          <div className={currentTheme.name === 'Colorful' ? 'col-span-full' : ''}>
              <h2 className="text-4xl font-bold mb-4">Home Page</h2>
              <p className="mb-6">Welcome to our awesome application! Here's some dynamic content.</p>
              <button className={button}>Get Started</button>
          </div>

          {loading && <p className={currentTheme.name === 'Colorful' ? 'col-span-full' : ''}>Loading products...</p>}
          {error && <p className={currentTheme.name === 'Colorful' ? 'col-span-full' : ''}>Error: {error}</p>}
          
          {products.map(product => (
              <div key={product.id} className={card}>
                  <img src={product.image} alt={product.title} className="w-full h-48 object-contain mb-4 rounded-md"/>
                  <h3 className="text-lg font-bold mb-2">{product.title}</h3>
                  <p className="text-sm opacity-80 mb-4 line-clamp-3">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xl">${product.price}</span>
                    <button className={button}>Buy Now</button>
                  </div>
              </div>
          ))}
      </PageLayout>
  );
};

const About = () => {
  const { currentTheme } = useTheme();
  const { card, button, layout } = currentTheme.styles;

  return (
    <div className={layout}>
        <div className={card + (currentTheme.name === 'Colorful' ? ' col-span-full' : '')}>
            <h2 className="text-4xl font-bold mb-4">About Us</h2>
            <p className="mb-4">
                We are a team of passionate developers dedicated to creating beautiful and functional web applications. This project demonstrates our ability to work with modern web technologies like React, Tailwind CSS, and Context API.
            </p>
            <p className="mb-6">
                Our mission is to build user-centric products that are not only powerful but also a delight to use. We believe in clean code, thoughtful design, and continuous learning.
            </p>
            <button className={button}>Learn More</button>
        </div>
    </div>
  );
};

const Contact = () => {
  const { currentTheme } = useTheme();
  const { card, button, layout } = currentTheme.styles;

  return (
    <div className={layout}>
        <div className={card + (currentTheme.name === 'Colorful' ? ' col-span-full' : '')}>
            <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
            <p className="mb-6">
                Have a question or want to work with us? Drop us a line!
            </p>
            <form className="space-y-4">
                <input type="text" placeholder="Your Name" className="w-full p-3 rounded-lg bg-gray-200 dark:bg-gray-700 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="email" placeholder="Your Email" className="w-full p-3 rounded-lg bg-gray-200 dark:bg-gray-700 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <textarea placeholder="Your Message" rows="5" className="w-full p-3 rounded-lg bg-gray-200 dark:bg-gray-700 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                <button type="submit" className={button}>Send Message</button>
            </form>
        </div>
    </div>
  );
};


// --- APP ---
export default function App() {
    const [page, setPage] = useState('home');

    // A simple router
    const renderPage = () => {
        const hash = window.location.hash.substring(1);
        switch (hash) {
            case 'about':
                return <About />;
            case 'contact':
                return <Contact />;
            case 'home':
            default:
                return <Home />;
        }
    };
    
    const [currentPage, setCurrentPage] = useState(renderPage());

    useEffect(() => {
        const handleHashChange = () => {
            setCurrentPage(renderPage());
        };
        window.addEventListener('hashchange', handleHashChange);
        // Set initial page
        handleHashChange();
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);


  return (
    <ThemeProvider>
        <AppContent />
    </ThemeProvider>
  );
}

const AppContent = () => {
    const { currentTheme } = useTheme();
    const [page, setPage] = useState('home');

    const renderPage = () => {
        switch (page) {
            case 'about':
                return <About />;
            case 'contact':
                return <Contact />;
            case 'home':
            default:
                return <Home />;
        }
    };
    
    // This is a simple navigation handler. In a real app, you'd use React Router.
    const navigate = (targetPage) => {
        setPage(targetPage);
    };

    return (
        <div className="min-h-screen">
            <Header navigate={navigate} />
            <div className={currentTheme.styles.layout}>
                <Sidebar />
                <MainContent>
                    {renderPage()}
                </MainContent>
            </div>
        </div>
    );
};
  
