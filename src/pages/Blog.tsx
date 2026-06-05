import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Eye, Heart, Tag, Search, ArrowRight, ChevronRight } from "lucide-react";
import { BLOG_POSTS } from "@/lib/constants";
import { formatDate, formatNumber } from "@/lib/utils";

const categories = ["All", "AI & Education", "Career Development", "Machine Learning", "Cybersecurity", "Success Stories", "Cloud & DevOps"];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = BLOG_POSTS.filter((post) => {
    const matchCat = activeCategory === "All" || post.category === activeCategory;
    const matchSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = BLOG_POSTS[0];

  return (
    <main className="page-enter pt-20">
      {/* Hero */}
      <section className="py-16 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-80" />
        <div className="relative container-custom text-center">
          <span className="badge-primary mb-4 inline-block !bg-blue-600/20 !text-blue-300 !border-blue-500/30">VedTechno Blog</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Insights for the
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">Modern Developer</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Tutorials, career tips, tech trends, and success stories from our community.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          {/* Featured Post */}
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-foreground mb-5">Featured Article</h2>
            <div className="group grid lg:grid-cols-2 gap-6 bg-card border border-border rounded-2xl overflow-hidden hover:border-blue-600/30 hover:shadow-xl transition-all duration-300">
              <div className="overflow-hidden">
                <img src={featured.thumbnail} alt={featured.title} className="w-full h-56 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-7 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="badge-primary text-xs">{featured.category}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{featured.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{featured.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{featured.excerpt}</p>
                <div className="flex items-center gap-3 mb-5">
                  <img src={featured.authorAvatar} alt={featured.author} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">{featured.author}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(featured.publishedAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-5">
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{formatNumber(featured.views)}</span>
                  <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{formatNumber(featured.likes)}</span>
                </div>
                <button className="btn-primary self-start text-sm">
                  Read Article <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input className="input-field pl-9" placeholder="Search articles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat ? "bg-blue-600 text-white" : "border border-border text-muted-foreground hover:border-blue-600/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          {filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((post) => (
                <article key={post.id} className="feature-card group flex flex-col">
                  <div className="overflow-hidden rounded-xl mb-4">
                    <img src={post.thumbnail} alt={post.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge-primary text-xs">{post.category}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
                      <Clock className="w-3 h-3" />{post.readTime}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{post.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4 flex-1">{post.excerpt}</p>
                  <div className="flex items-center gap-2 pt-3 border-t border-border">
                    <img src={post.authorAvatar} alt={post.author} className="w-7 h-7 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{post.author}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(post.publishedAt)}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatNumber(post.views)}</span>
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{formatNumber(post.likes)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-medium mb-1">No articles found</p>
              <p className="text-muted-foreground text-sm">Try adjusting your search or filter.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
