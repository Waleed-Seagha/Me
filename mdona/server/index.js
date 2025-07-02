const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const { generatePost } = require('./postGenerator');

// Configuration
const PORT = process.env.PORT || 3001;
const POSTS_FILE = path.join(__dirname, '../public/data/posts.json');

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Schedule post generation every 24 hours (at midnight)
cron.schedule('0 0 * * *', async () => {
  console.log(`Generating new blog post at: ${new Date().toISOString()}`);
  try {
    await generateNewPost();
    console.log('Successfully generated new blog post!');
  } catch (error) {
    console.error('Error generating blog post:', error);
  }
});

// Function to generate and save a new post
async function generateNewPost() {
  try {
    // Read existing posts
    let rawData;
    try {
      rawData = fs.readFileSync(POSTS_FILE);
    } catch (err) {
      // If file doesn't exist, create a new posts array
      rawData = JSON.stringify({ posts: [] });
    }
    
    const data = JSON.parse(rawData);
    
    // Generate new post
    const newPost = await generatePost();
    
    // Add ID and timestamp to the new post
    newPost.id = (data.posts.length + 1).toString();
    newPost.createdAt = new Date().toISOString();
    
    // Add the new post to the beginning of posts array
    data.posts.unshift(newPost);
    
    // Write updated posts back to the file
    fs.writeFileSync(POSTS_FILE, JSON.stringify(data, null, 2), 'utf8');
    
    return newPost;
  } catch (error) {
    console.error('Error in generateNewPost:', error);
    throw error;
  }
}

// API endpoint to manually trigger post generation
app.post('/api/generate-post', async (req, res) => {
  try {
    const newPost = await generateNewPost();
    res.status(201).json({
      message: 'Post generated successfully',
      post: newPost
    });
  } catch (error) {
    console.error('Error generating post:', error);
    res.status(500).json({ error: 'Failed to generate post' });
  }
});

// API endpoint to delete a post by id
app.delete('/api/delete-post/:id', (req, res) => {
  const id = req.params.id;
  try {
    let rawData = fs.readFileSync(POSTS_FILE);
    const data = JSON.parse(rawData);
    const idx = data.posts.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Post not found' });
    data.posts.splice(idx, 1);
    fs.writeFileSync(POSTS_FILE, JSON.stringify(data, null, 2), 'utf8');
    res.json({ message: 'Post deleted successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// API endpoint to edit a post by id
app.put('/api/edit-post/:id', (req, res) => {
  const id = req.params.id;
  const { title, content, tags } = req.body;
  try {
    let rawData = fs.readFileSync(POSTS_FILE);
    const data = JSON.parse(rawData);
    const post = data.posts.find(p => p.id === id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    post.title = title;
    post.content = content;
    post.tags = tags;
    post.lastUpdated = new Date().toISOString();
    fs.writeFileSync(POSTS_FILE, JSON.stringify(data, null, 2), 'utf8');
    res.json({ message: 'Post updated successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// API endpoint to get all posts
app.get('/api/posts', (req, res) => {
  try {
    const rawData = fs.readFileSync(POSTS_FILE);
    const data = JSON.parse(rawData);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load posts' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Post generation scheduled to run at midnight every day.`);
});

// Generate initial post if no posts exist
(async function checkInitialPosts() {
  try {
    if (!fs.existsSync(POSTS_FILE)) {
      console.log('No posts file found. Creating initial post...');
      await generateNewPost();
      console.log('Initial post created.');
    } else {
      const data = JSON.parse(fs.readFileSync(POSTS_FILE));
      if (!data.posts || data.posts.length === 0) {
        console.log('Posts file exists but no posts. Creating initial post...');
        await generateNewPost();
        console.log('Initial post created.');
      } else {
        console.log(`Found ${data.posts.length} existing posts.`);
      }
    }
  } catch (error) {
    console.error('Error checking initial posts:', error);
  }
})();

// ========== اختبار مؤقت لجلب منشور جديد من الذكاء الاصطناعي ========== //
(async function testGeneratePost() {
  try {
    console.log('بدء اختبار جلب منشور جديد من OpenRouter API...');
       const post = await generateNewPost();
    console.log('تم جلب منشور جديد بنجاح:');
    console.log('العنوان:', post.title);
    console.log('المحتوى:', post.content.slice(0, 120) + '...');
    console.log('الوسوم:', post.tags);
  } catch (err) {
    console.error('فشل اختبار جلب منشور جديد:', err);
  }
})();
// ========== نهاية كود الاختبار المؤقت ========== //