'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  Save,
  X,
  Upload,
  Eye,
  EyeOff,
  Pin
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { Badge } from '@/src/components/ui/badge';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  highlight: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
  gradient_class: string;
  page_type: string;
  display_order: number;
  is_active: boolean;
}

interface PageContent {
  id: number;
  page_name: string;
  section_name: string;
  content_type: string;
  content_key: string;
  content_value: string;
  is_active: boolean;
}

interface MediaFile {
  id: number;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  alt_text: string;
  description: string;
  category: string;
  is_active: boolean;
}

interface ForumCategory {
  id: number;
  name: string;
  description: string;
  icon_name: string;
  color_class: string;
  display_order: number;
  posts_count: number;
  is_active: boolean;
}

interface ForumPost {
  id: number;
  title: string;
  content: string;
  user_name: string;
  user_id: string;
  casino_name?: string;
  rating?: number;
  post_type: string;
  is_pinned: boolean;
  is_locked: boolean;
  is_approved: boolean;
  views_count: number;
  likes_count: number;
  replies_count: number;
  created_at: string;
  forum_categories?: {
    name: string;
  };
}

export default function ContentManagementPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [pageContents, setPageContents] = useState<PageContent[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [forumCategories, setForumCategories] = useState<ForumCategory[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [editingContent, setEditingContent] = useState<PageContent | null>(null);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [showContentForm, setShowContentForm] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Fetch data
  useEffect(() => {
    fetchBanners();
    fetchPageContents();
    fetchMediaFiles();
    fetchForumCategories();
    fetchForumPosts();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/admin/banners');
      const data = await response.json();
      setBanners(data.banners || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  const fetchPageContents = async () => {
    try {
      const response = await fetch('/api/admin/content');
      const data = await response.json();
      setPageContents(data.contents || []);
    } catch (error) {
      console.error('Error fetching page contents:', error);
    }
  };

  const fetchMediaFiles = async () => {
    try {
      const response = await fetch('/api/admin/media');
      const data = await response.json();
      setMediaFiles(data.mediaFiles || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching media files:', error);
      setLoading(false);
    }
  };

  const fetchForumCategories = async () => {
    try {
      const response = await fetch('/api/forum/categories');
      const data = await response.json();
      setForumCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching forum categories:', error);
    }
  };

  const fetchForumPosts = async () => {
    try {
      const response = await fetch('/api/forum/posts?limit=50');
      const data = await response.json();
      setForumPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching forum posts:', error);
    }
  };

  // Banner CRUD operations
  const saveBanner = async (bannerData: Partial<Banner>) => {
    try {
      const method = editingBanner ? 'PUT' : 'POST';
      const response = await fetch('/api/admin/banners', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerData),
      });

      if (response.ok) {
        await fetchBanners();
        setEditingBanner(null);
        setShowBannerForm(false);
      }
    } catch (error) {
      console.error('Error saving banner:', error);
    }
  };

  const deleteBanner = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/banners?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchBanners();
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
  };

  // Content CRUD operations
  const saveContent = async (contentData: Partial<PageContent>) => {
    try {
      const method = editingContent ? 'PUT' : 'POST';
      const response = await fetch('/api/admin/content', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentData),
      });

      if (response.ok) {
        await fetchPageContents();
        setEditingContent(null);
        setShowContentForm(false);
      }
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  // File upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'banner');

    try {
      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await fetchMediaFiles();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploadingFile(false);
    }
  };

  // Forum management functions
  const togglePostApproval = async (postId: number, isApproved: boolean) => {
    try {
      const response = await fetch('/api/forum/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: postId,
          is_approved: !isApproved,
          user_id: 'admin' // Admin override
        })
      });

      if (response.ok) {
        await fetchForumPosts();
      }
    } catch (error) {
      console.error('Error toggling post approval:', error);
    }
  };

  const togglePostPin = async (postId: number, isPinned: boolean) => {
    try {
      const response = await fetch('/api/forum/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: postId,
          is_pinned: !isPinned,
          user_id: 'admin' // Admin override
        })
      });

      if (response.ok) {
        await fetchForumPosts();
      }
    } catch (error) {
      console.error('Error toggling post pin:', error);
    }
  };

  const deleteForumPost = async (postId: number) => {
    try {
      const response = await fetch(`/api/forum/posts?id=${postId}&user_id=admin`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchForumPosts();
      }
    } catch (error) {
      console.error('Error deleting forum post:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-casino-dark flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-casino-neon-green mx-auto mb-4"></div>
          <p className="text-lg">Loading content management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-casino-dark p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Content Management System</h1>
          <p className="text-gray-400">Manage banners, page content, and media files</p>
        </motion.div>

        <Tabs defaultValue="banners" className="space-y-6">
          <TabsList className="bg-casino-card-bg border border-casino-border-subtle">
            <TabsTrigger value="banners" className="text-white data-[state=active]:bg-casino-neon-green data-[state=active]:text-casino-dark">
              Banner Management
            </TabsTrigger>
            <TabsTrigger value="content" className="text-white data-[state=active]:bg-casino-neon-green data-[state=active]:text-casino-dark">
              Page Content
            </TabsTrigger>
            <TabsTrigger value="media" className="text-white data-[state=active]:bg-casino-neon-green data-[state=active]:text-casino-dark">
              Media Files
            </TabsTrigger>
            <TabsTrigger value="forum" className="text-white data-[state=active]:bg-casino-neon-green data-[state=active]:text-casino-dark">
              Forum Management
            </TabsTrigger>
          </TabsList>

          {/* Banner Management Tab */}
          <TabsContent value="banners" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Banner Management</h2>
              <Button
                onClick={() => setShowBannerForm(true)}
                className="bg-casino-neon-green hover:bg-casino-neon-green/80 text-casino-dark"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Banner
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((banner) => (
                <Card key={banner.id} className="bg-casino-card-bg border-casino-border-subtle">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white text-lg">{banner.title}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {banner.page_type}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingBanner(banner)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteBanner(banner.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-gray-300 text-sm">{banner.subtitle}</p>
                      <p className="text-casino-neon-green text-sm font-medium">{banner.highlight}</p>
                      {banner.image_url && (
                        <img 
                          src={banner.image_url} 
                          alt={banner.title}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <span>Order: {banner.display_order}</span>
                        <span className="flex items-center gap-1">
                          {banner.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {banner.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Page Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Page Content Management</h2>
              <Button
                onClick={() => setShowContentForm(true)}
                className="bg-casino-neon-green hover:bg-casino-neon-green/80 text-casino-dark"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Content
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pageContents.map((content) => (
                <Card key={content.id} className="bg-casino-card-bg border-casino-border-subtle">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white text-lg">
                          {content.page_name} / {content.section_name}
                        </CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {content.content_key}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingContent(content)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-gray-300 text-sm">
                        {content.content_value.length > 100 
                          ? content.content_value.substring(0, 100) + '...'
                          : content.content_value
                        }
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <span>Type: {content.content_type}</span>
                        <span className="flex items-center gap-1">
                          {content.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {content.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Media Files Tab */}
          <TabsContent value="media" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Media File Management</h2>
              <div className="flex gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <span
                    className={`inline-flex items-center px-4 py-2 bg-casino-neon-green hover:bg-casino-neon-green/80 text-casino-dark cursor-pointer rounded-md font-medium transition-colors ${uploadingFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadingFile ? 'Uploading...' : 'Upload Image'}
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {mediaFiles.map((media) => (
                <Card key={media.id} className="bg-casino-card-bg border-casino-border-subtle">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <img 
                        src={media.file_path} 
                        alt={media.alt_text || media.original_name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div>
                        <p className="text-white text-sm font-medium truncate">
                          {media.original_name}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {(media.file_size / 1024).toFixed(1)} KB
                        </p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {media.category}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigator.clipboard.writeText(media.file_path)}
                        >
                          Copy URL
                        </Button>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          {media.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Forum Management Tab */}
          <TabsContent value="forum" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Forum Management</h2>
            </div>

            {/* Forum Categories */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {forumCategories.map((category) => (
                  <Card key={category.id} className="bg-casino-card-bg border-casino-border-subtle">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">{category.name}</h4>
                        <Badge variant="outline">
                          {category.posts_count} posts
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{category.description}</p>
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <span>Order: {category.display_order}</span>
                        <span className="flex items-center gap-1">
                          {category.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {category.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Forum Posts */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Recent Posts</h3>
              <div className="space-y-3">
                {forumPosts.slice(0, 10).map((post) => (
                  <Card key={post.id} className="bg-casino-card-bg border-casino-border-subtle">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            {post.is_pinned && (
                              <Badge className="bg-casino-neon-green text-casino-dark">
                                Pinned
                              </Badge>
                            )}
                            {!post.is_approved && (
                              <Badge variant="destructive">
                                Pending Approval
                              </Badge>
                            )}
                            <Badge variant="outline">
                              {post.post_type}
                            </Badge>
                            {post.casino_name && (
                              <Badge variant="outline" className="text-casino-neon-green border-casino-neon-green">
                                {post.casino_name}
                              </Badge>
                            )}
                          </div>

                          <h4 className="font-semibold text-white mb-1 truncate">{post.title}</h4>
                          <p className="text-sm text-gray-400 mb-2 line-clamp-2">{post.content}</p>

                          <div className="flex items-center space-x-4 text-xs text-gray-400">
                            <span>By: {post.user_name}</span>
                            <span>Category: {post.forum_categories?.name}</span>
                            <span>{post.likes_count} likes</span>
                            <span>{post.replies_count} replies</span>
                            <span>{post.views_count} views</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            size="sm"
                            variant={post.is_pinned ? "default" : "outline"}
                            onClick={() => togglePostPin(post.id, post.is_pinned)}
                            className={post.is_pinned ? "bg-casino-neon-green text-casino-dark" : ""}
                          >
                            <Pin className="w-4 h-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant={post.is_approved ? "default" : "outline"}
                            onClick={() => togglePostApproval(post.id, post.is_approved)}
                            className={post.is_approved ? "bg-green-600 text-white" : "bg-yellow-600 text-white"}
                          >
                            {post.is_approved ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteForumPost(post.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
