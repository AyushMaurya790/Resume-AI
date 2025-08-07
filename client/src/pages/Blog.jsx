import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import '../styles/Blog.css';

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  // Sample blog categories
  const categories = [
    { id: 'all', name: 'All Articles' },
    { id: 'resume-tips', name: 'Resume Tips' },
    { id: 'career-advice', name: 'Career Advice' },
    { id: 'ats', name: 'ATS Optimization' },
    { id: 'ai', name: 'AI & Technology' }
  ];

  // Fetch blog articles (simulated)
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // In a real app, this would be an API call
        const mockArticles = [
          {
            id: 1,
            title: "10 AI-Powered Resume Tips for 2025",
            excerpt: "Discover how AI is changing resume writing and how to leverage it for your job search.",
            category: 'resume-tips',
            date: '2025-05-15',
            readTime: '5 min',
            image: '/blog/ai-resume-tips.jpg',
            slug: 'ai-powered-resume-tips-2025'
          },
          {
            id: 2,
            title: "How to Beat Applicant Tracking Systems",
            excerpt: "Learn the secrets to formatting your resume to pass through ATS filters successfully.",
            category: 'ats',
            date: '2025-04-28',
            readTime: '7 min',
            image: '/blog/ats-guide.jpg',
            slug: 'beat-applicant-tracking-systems'
          },
          {
            id: 3,
            title: "The Future of Hiring: AI Recruiters",
            excerpt: "How artificial intelligence is transforming the recruitment process and what it means for job seekers.",
            category: 'ai',
            date: '2025-03-10',
            readTime: '8 min',
            image: '/blog/ai-recruiters.jpg',
            slug: 'future-of-hiring-ai-recruiters'
          },
          {
            id: 4,
            title: "Career Switching in the Digital Age",
            excerpt: "Practical steps to transition to a new career field with no prior experience.",
            category: 'career-advice',
            date: '2025-02-22',
            readTime: '6 min',
            image: '/blog/career-switching.jpg',
            slug: 'career-switching-digital-age'
          }
        ];
        
        setArticles(mockArticles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription logic
    console.log('Subscribing email:', email);
    setIsSubscribed(true);
    setEmail('');
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="blog-page">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>ResumeAI Blog - Career Advice & Resume Tips</title>
        <meta name="description" content="Get the latest resume writing tips, career advice, and insights on AI-powered job search tools from ResumeAI experts." />
        <meta property="og:title" content="ResumeAI Blog - Career Advice & Resume Tips" />
        <meta property="og:description" content="Get the latest resume writing tips, career advice, and insights on AI-powered job search tools." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourapp.com/blog" />
        <meta name="twitter:card" content="summary_large_image" />
        
        {/* Schema.org markup */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Blog",
              "headline": "ResumeAI Blog",
              "description": "Career advice and resume writing tips powered by AI",
              "publisher": {
                "@type": "Organization",
                "name": "ResumeAI",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://yourapp.com/logo.png"
                }
              }
            }
          `}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="blog-hero">
        <div className="blog-hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-red">Resume</span>
            <span className="text-blue">AI</span> Blog
          </motion.h1>
          <p className="blog-hero-subtitle">
            Expert advice on resumes, career growth, and AI-powered job search
          </p>
        </div>
        <div className="blog-hero-decoration">
          <div className="blog-orb-red"></div>
          <div className="blog-orb-blue"></div>
        </div>
      </section>

      {/* Main Content */}
      <div className="blog-container">
        {/* Sidebar */}
        <aside className="blog-sidebar">
          {/* Search */}
          <div className="blog-search">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="search-icon">{/* Search icon SVG */}</svg>
          </div>

          {/* Categories */}
          <div className="blog-categories">
            <h3>Categories</h3>
            <ul>
              {categories.map(category => (
                <li 
                  key={category.id}
                  className={activeCategory === category.id ? 'active' : ''}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="blog-newsletter">
            <h3>Get Career Insights</h3>
            {isSubscribed ? (
              <div className="newsletter-success">
                <svg className="success-icon">{/* Checkmark icon */}</svg>
                <p>Thanks for subscribing!</p>
              </div>
            ) : (
              <>
                <p>Subscribe to our newsletter for the latest resume tips</p>
                <form onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn-red">
                    Subscribe
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Popular Tags */}
          <div className="blog-tags">
            <h3>Popular Tags</h3>
            <div className="tags-container">
              {['AI', 'Resume Writing', 'Career Change', 'Interview Tips', 'ATS', 'Job Search', 'LinkedIn', 'Cover Letters'].map(tag => (
                <span key={tag} className="blog-tag">{tag}</span>
              ))}
            </div>
          </div>
        </aside>

        {/* Articles */}
        <main className="blog-articles">
          {loading ? (
            <div className="blog-loading">
              <div className="loading-spinner"></div>
              <p>Loading articles...</p>
            </div>
          ) : filteredArticles.length > 0 ? (
            filteredArticles.map(article => (
              <motion.article 
                key={article.id}
                className="blog-article-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <div className="article-image">
                  <img src={article.image} alt={article.title} />
                  <span className={`article-category ${article.category}`}>
                    {categories.find(c => c.id === article.category)?.name}
                  </span>
                </div>
                <div className="article-content">
                  <div className="article-meta">
                    <span className="article-date">{article.date}</span>
                    <span className="article-read-time">{article.readTime} read</span>
                  </div>
                  <h2 className="article-title">
                    <a href={`/blog/${article.slug}`}>{article.title}</a>
                  </h2>
                  <p className="article-excerpt">{article.excerpt}</p>
                  <a href={`/blog/${article.slug}`} className="article-read-more btn-blue">
                    Read More
                  </a>
                </div>
              </motion.article>
            ))
          ) : (
            <div className="blog-empty">
              <svg className="empty-icon">{/* Empty state icon */}</svg>
              <h3>No articles found</h3>
              <p>Try adjusting your search or category filter</p>
            </div>
          )}
        </main>
      </div>

      {/* Featured Article */}
      {articles.length > 0 && (
        <section className="blog-featured">
          <div className="featured-content">
            <span className="featured-badge">Featured</span>
            <h2>{articles[0].title}</h2>
            <p>{articles[0].excerpt}</p>
            <a href={`/blog/${articles[0].slug}`} className="btn-red">
              Read Featured Article
            </a>
          </div>
          <div className="featured-image">
            <img src={articles[0].image} alt={articles[0].title} />
          </div>
        </section>
      )}
    </div>
  );
};

export default Blog;