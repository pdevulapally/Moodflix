"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";

interface Post {
  id: string;
  author: string;
  authorPhoto?: string;
  content: string;
  timestamp: number;
  likes: number;
  replies: Post[];
}

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const router = useRouter();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const postsQuery = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(fetchedPosts);
    });

    return () => {
      unsubscribeAuth();
      unsubscribePosts();
    };
  }, []);

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    if (!user) {
      toast({
        title: "Login Required",
        description: "You need to be logged in to post.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await addDoc(collection(db, "posts"), {
        author: user.displayName || "Anonymous",
        authorPhoto: user.photoURL || "",
        content: newPost,
        timestamp: Date.now(),
        likes: 0,
        replies: [],
      });
      setNewPost("");
      toast({
        title: "Post Created",
        description: "Your post has been successfully created.",
      });
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "An error occurred while creating your post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const postRef = doc(db, "posts", postId);
      const post = posts.find((p) => p.id === postId);
      if (post) {
        await updateDoc(postRef, { likes: post.likes + 1 });
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, "posts", postId));
      toast({
        title: "Post Deleted",
        description: "Your post has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEditPost = async (postId: string) => {
    if (!editingContent.trim()) return;

    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, { content: editingContent });
      setEditingPostId(null);
      setEditingContent("");
      toast({
        title: "Post Updated",
        description: "Your post has been successfully updated.",
      });
    } catch (error) {
      console.error("Error editing post:", error);
    }
  };

  const handleReplyPost = async (postId: string, replyContent: string) => {
    if (!replyContent.trim()) return;

    try {
      const postRef = doc(db, "posts", postId);
      const post = posts.find((p) => p.id === postId);
      if (post) {
        const updatedReplies = [...post.replies, { author: user.displayName || "Anonymous", content: replyContent, timestamp: Date.now() }];
        await updateDoc(postRef, { replies: updatedReplies });
        toast({
          title: "Reply Added",
          description: "Your reply has been successfully added.",
        });
      }
    } catch (error) {
      console.error("Error replying to post:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">Community</h1>

      {user ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create a Post</CardTitle>
            <CardDescription>Share your thoughts with the community</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitPost}>
              <Textarea
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="mb-4"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Posting..." : "Post"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <p className="text-center text-gray-500">Login to create posts.</p>
      )}

      <div className="space-y-6">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts yet. Be the first to share something!</p>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="bg-card">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={post.authorPhoto || `https://api.dicebear.com/6.x/initials/svg?seed=${post.author}`} />
                    <AvatarFallback>{post.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{post.author}</CardTitle>
                    <CardDescription>{new Date(post.timestamp).toLocaleString()}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {editingPostId === post.id ? (
                  <div>
                    <Textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="mb-4"
                    />
                    <Button onClick={() => handleEditPost(post.id)} className="mr-2">
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setEditingPostId(null)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <p>{post.content}</p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div>
                  <Button variant="outline" onClick={() => handleLikePost(post.id)}>
                    Like ({post.likes})
                  </Button>
                  <Button variant="outline" className="ml-2" onClick={() => handleReplyPost(post.id, "Sample Reply")}>
                    Reply
                  </Button>
                </div>
                {user?.displayName === post.author && (
                  <div>
                    <Button variant="outline" className="mr-2" onClick={() => setEditingPostId(post.id)}>
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={() => handleDeletePost(post.id)}>
                      Delete
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
