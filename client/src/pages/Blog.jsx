import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography, Button } from '@mui/material';
import '../styles/Blog.css';

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [aiRecommendedArticle, setAiRecommendedArticle] = useState(null);

  // Sample blog categories
  const categories = [
    { id: 'all', name: 'All Articles' },
    { id: 'resume-tips', name: 'Resume Tips' },
    { id: 'career-advice', name: 'Career Advice' },
    { id: 'ats', name: 'ATS Optimization' },
    { id: 'ai', name: 'AI & Technology' },
  ];

  // Sample articles with AI-driven metadata
  const mockArticles = [
    {
      id: 1,
      title: '10 AI-Powered Resume Tips for 2025',
      excerpt: 'Discover how AI is changing resume writing and how to leverage it for your job search.',
      category: 'resume-tips',
      date: '2025-05-15',
      readTime: '5 min',
      image: '/blog/ai-resume-tips.jpg',
      slug: 'ai-powered-resume-tips-2025',
      aiScore: 90,
      jobMatch: ['Software Engineer', 'Data Scientist'],
    },
    {
      id: 2,
      title: 'How to Beat Applicant Tracking Systems',
      excerpt: 'Learn the secrets to formatting your resume to pass through ATS filters successfully.',
      category: 'ats',
      date: '2025-04-28',
      readTime: '7 min',
      image: '/blog/ats-guide.jpg',
      slug: 'beat-applicant-tracking-systems',
      aiScore: 85,
      jobMatch: ['HR', 'Marketing'],
    },
    {
      id: 3,
      title: 'The Future of Hiring: AI Recruiters',
      excerpt: 'How artificial intelligence is transforming the recruitment process and what it means for job seekers.',
      category: 'ai',
      date: '2025-03-10',
      readTime: '8 min',
      image: '/blog/ai-recruiters.jpg',
      slug: 'future-of-hiring-ai-recruiters',
      aiScore: 95,
      jobMatch: ['Tech', 'Product Management'],
    },
    {
      id: 4,
      title: 'Career Switching in the Digital Age',
      excerpt: 'Practical steps to transition to a new career field with no prior experience.',
      category: 'career-advice',
      date: '2025-02-22',
      readTime: '6 min',
      image: '/blog/career-switching.jpg',
      slug: 'career-switching-digital-age',
      aiScore: 80,
      jobMatch: ['Any'],
    },
  ];

  // Fetch articles and AI recommendation
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Simulate API call
        setArticles(mockArticles);
        // Mock GPT-4o recommendation (e.g., based on ResumeContext user data)
        const recommended = mockArticles.reduce((prev, curr) =>
          prev.aiScore > curr.aiScore ? prev : curr
        );
        setAiRecommendedArticle(recommended);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      setSubscribeError('Please enter a valid email address');
      return;
    }

    try {
      // Simulate newsletter subscription API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubscribed(true);
      setSubscribeError('');
      setEmail('');
    } catch (error) {
      setSubscribeError('Failed to subscribe. Please try again.');
    }
  };

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.jobMatch.some((job) => job.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="blog-page">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>ResumeAI Blog - Expert Resume & Career Advice</title>
        <meta
          name="description"
          content="Explore ResumeAI's blog for expert resume writing tips, career advice, ATS optimization strategies, and AI-powered job search insights."
        />
        <meta name="keywords" content="resume tips, career advice, ATS optimization, AI job search, ResumeAI blog" />
        <meta property="og:title" content="ResumeAI Blog - Expert Resume & Career Advice" />
        <meta
          property="og:description"
          content="Get the latest resume writing tips, career advice, and AI-powered job search insights from ResumeAI experts."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            headline: 'ResumeAI Blog',
            description: 'Expert resume writing tips and career advice powered by AI',
            publisher: {
              '@type': 'Organization',
              name: 'ResumeAI',
              logo: {
                '@type': 'ImageObject',
                url: '/logo.png',
              },
            },
            blogPost: articles.map((article) => ({
              '@type': 'BlogPosting',
              headline: article.title,
              description: article.excerpt,
              datePublished: article.date,
              image: article.image,
              url: `${window.location.origin}/blog/${article.slug}`,
            })),
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <motion.section
        className="blog-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="blog-hero-content">
          <Typography variant="h1">
            <span className="text-red">Resume</span>
            <span className="text-blue">AI</span> Blog
          </Typography>
          <Typography variant="body1" className="blog-hero-subtitle">
            Your source for resume tips, career growth, and AI-driven job search strategies
          </Typography>
          {aiRecommendedArticle && (
            <motion.div
              className="ai-recommendation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Typography variant="body2">
                <strong>AI Pick:</strong> Read "{aiRecommendedArticle.title}" for {aiRecommendedArticle.jobMatch.join(' or ')} roles (Score: {aiRecommendedArticle.aiScore}%)
              </Typography>
              <Button
                variant="contained"
                color="primary"
                href={`/blog/${aiRecommendedArticle.slug}`}
                className="ai-recommendation-btn"
              >
                Read Now
              </Button>
            </motion.div>
          )}
        </div>
        <motion.div
          className="blog-hero-decoration"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="blog-orb-red" />
          <div className="blog-orb-blue" />
        </motion.div>
      </motion.section>

      {/* Main Content */}
      <div className="blog-container">
        {/* Sidebar */}
        <motion.aside
          className="blog-sidebar"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="blog-search">
            <input
              type="text"
              placeholder="Search articles by title or job role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search blog articles"
            />
            <svg className="search-icon" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
              />
            </svg>
          </div>

          <div className="blog-categories">
            <Typography variant="h3">Categories</Typography>
            <ul>
              {categories.map((category) => (
                <motion.li
                  key={category.id}
                  className={activeCategory === category.id ? 'active' : ''}
                  onClick={() => setActiveCategory(category.id)}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {category.name}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="blog-newsletter">
            <Typography variant="h3">Get Career Insights</Typography>
            <AnimatePresence>
              {isSubscribed ? (
                <motion.div
                  className="newsletter-success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <svg className="success-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <Typography variant="body2">Thanks for subscribing!</Typography>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Typography variant="body2">
                    Subscribe to our newsletter for the latest resume tips and career advice
                  </Typography>
                  <form onSubmit={handleSubscribe}>
                    <input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      aria-label="Newsletter email"
                      className={subscribeError ? 'input-error' : ''}
                    />
                    <Button type="submit" variant="contained" color="secondary" className="subscribe-btn">
                      Subscribe
                    </Button>
                    {subscribeError && (
                      <motion.div
                        className="subscribe-error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {subscribeError}
                      </motion.div>
                    )}
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="blog-tags">
            <Typography variant="h3">Popular Tags</Typography>
            <div className="tags-container">
              {['AI', 'Resume Writing', 'Career Change', 'Interview Tips', 'ATS', 'Job Search', 'LinkedIn', 'Cover Letters'].map(
                (tag) => (
                  <motion.span
                    key={tag}
                    className="blog-tag"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {tag}
                  </motion.span>
                )
              )}
            </div>
          </div>
        </motion.aside>

        {/* Articles */}
        <main className="blog-articles">
          {loading ? (
            <motion.div
              className="blog-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="loading-spinner" />
              <Typography variant="body1">Loading articles...</Typography>
            </motion.div>
          ) : filteredArticles.length > 0 ? (
            <motion.div
              className="articles-grid"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
              }}
            >
              <AnimatePresence>
                {filteredArticles.map((article) => (
                  <motion.article
                    key={article.id}
                    className="blog-article-card"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    whileHover={{ y: -10, boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)' }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="article-image">
                      <img src={article.image} alt={article.title} />
                      <span className={`article-category ${article.category}`}>
                        {categories.find((c) => c.id === article.category)?.name}
                      </span>
                    </div>
                    <div className="article-content">
                      <div className="article-meta">
                        <span className="article-date">{article.date}</span>
                        <span className="article-read-time">{article.readTime} read</span>
                      </div>
                      <Typography variant="h2" className="article-title">
                        <a href={`/blog/${article.slug}`}>{article.title}</a>
                      </Typography>
                      <Typography variant="body2" className="article-excerpt">
                        {article.excerpt}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        href={`/blog/${article.slug}`}
                        className="article-read-more"
                      >
                        Read More
                      </Button>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              className="blog-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <svg className="empty-icon" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4-4h-3v3h-2v-3H8v-2h3v-3h2v3h3v2z"
                />
              </svg>
              <Typography variant="h3">No articles found</Typography>
              <Typography variant="body2">Try adjusting your search or category filter</Typography>
            </motion.div>
          )}
        </main>
      </div>

      {/* Featured Article */}
      {articles.length > 0 && (
        <motion.section
          className="blog-featured"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="featured-content">
            <span className="featured-badge">Featured</span>
            <Typography variant="h2">{articles[0].title}</Typography>
            <Typography variant="body2">{articles[0].excerpt}</Typography>
            <Button variant="contained" color="secondary" href={`/blog/${articles[0].slug}`}>
              Read Featured Article
            </Button>
          </div>
          <motion.div
            className="featured-image"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img src={articles[0].image} alt={articles[0].title} />
          </motion.div>
        </motion.section>
      )}
    </div>
  );
};

export default Blog;