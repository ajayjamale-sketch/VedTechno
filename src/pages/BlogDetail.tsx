import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Eye, Heart, Share2, Twitter, Linkedin, Facebook } from "lucide-react";
import { BLOG_POSTS } from "@/lib/constants";
import { formatDate, formatNumber } from "@/lib/utils";
import NotFound from "./NotFound";

export default function BlogDetail() {
  const { id } = useParams();
  const post = BLOG_POSTS.find((p) => p.id === id);

  if (!post) {
    return <NotFound />;
  }

  return (
    <main className="page-enter pt-24 pb-20">
      <div className="container-custom max-w-4xl">
        <Link to="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
        </Link>
        
        <article>
          <header className="mb-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="badge-primary">{post.category}</span>
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> {post.readTime}
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight mb-8">
              {post.title}
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-3">
                <img src={post.authorAvatar} alt={post.author} className="w-10 h-10 rounded-full object-cover ring-2 ring-border" />
                <div className="text-left">
                  <p className="font-semibold text-foreground">{post.author}</p>
                  <p className="text-muted-foreground">{formatDate(post.publishedAt)}</p>
                </div>
              </div>
              
              <div className="hidden sm:block w-px h-8 bg-border" />
              
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {formatNumber(post.views)} views</span>
                <span className="flex items-center gap-1.5"><Heart className="w-4 h-4" /> {formatNumber(post.likes)} likes</span>
              </div>
            </div>
          </header>
          
          <div className="rounded-2xl overflow-hidden mb-12 shadow-lg border border-border">
            <img src={post.thumbnail} alt={post.title} className="w-full h-[400px] sm:h-[500px] object-cover" />
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-3xl mx-auto mb-16">
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              {post.excerpt}
            </p>
            {/* Mock content since we don't have full post body in constants */}
            <h2>Introduction</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <h3>Key Takeaways</h3>
            <ul>
              <li>Understanding the core concepts and their applications.</li>
              <li>Implementing best practices for optimal performance.</li>
              <li>Navigating common pitfalls and how to avoid them.</li>
            </ul>
            <h2>Deep Dive</h2>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
            <blockquote>
              "The best way to predict the future is to invent it." - Alan Kay
            </blockquote>
            <p>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            </p>
            <h2>Conclusion</h2>
            <p>
              Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-foreground">Share this article:</span>
              <div className="flex gap-2">
                <button className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                  <Twitter className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                  <Linkedin className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                  <Facebook className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-muted px-4 py-2 rounded-full">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span className="text-sm font-medium text-foreground">{formatNumber(post.likes)} likes</span>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
