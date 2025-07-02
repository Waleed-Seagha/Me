const { generateWithOpenRouter } = require('./openRouterClient');

/**
 * Generate a technical blog post using OpenRouter AI
 * @returns {Promise<Object>} The generated post with title, content, and tags
 */
async function generatePost() {
  try {
    // System prompt to define AI's role and capabilities
    const systemPrompt = 'أنت كاتب تقني محترف في مجال الويب، تجيد كتابة مقالات تقنية باللغة العربية بشكل احترافي وعميق.';
    
    // User prompt to generate the blog post
    const userPrompt = 'اكتب تدوينة يومية باللغة العربية عن آخر الأخبار والاتجاهات في تطوير الويب، مع ذكر أدوات جديدة، تقنيات، تحديثات في المتصفحات، أو أطر عمل حديثة. يجب أن تكون المقالة عميقة ومفصلة بين 400-600 كلمة، وتحتوي على عنوان جذاب.';
    
    // Generate content using OpenRouter API
    const generatedContent = await generateWithOpenRouter(userPrompt, systemPrompt);
    
    // Parse the generated content to extract title and body
    const parsedContent = parseGeneratedContent(generatedContent);
    
    // Extract potential tags from the content
    const tags = extractTags(parsedContent.content);
    
    return {
      title: parsedContent.title,
      content: parsedContent.content,
      tags
    };
  } catch (error) {
    console.error('Error generating post:', error);
    throw error;
  }
}

/**
 * Parse raw generated content into title and body sections
 * @param {string} rawContent - The raw content from AI
 * @returns {Object} Object containing title and content
 */
function parseGeneratedContent(rawContent) {
  try {
    // Attempt to extract title from the first line
    const lines = rawContent.split('\n').filter(line => line.trim() !== '');
    
    // Default values in case parsing fails
    let title = 'تدوينة تقنية جديدة';
    let content = rawContent;
    
    // Check if first line looks like a title (shorter than 100 chars and no periods)
    if (lines[0] && lines[0].length < 100 && !lines[0].includes('.')) {
      title = lines[0].replace(/^#+ /, '').trim(); // Remove markdown heading symbols if present
      content = lines.slice(1).join('\n\n').trim();
    }
    
    // If content is empty after parsing, use the original content
    if (!content) {
      content = rawContent;
    }
    
    return { title, content };
  } catch (error) {
    console.error('Error parsing content:', error);
    // Return original content as fallback
    return {
      title: 'تدوينة تقنية جديدة',
      content: rawContent
    };
  }
}

/**
 * Extract relevant tags from post content
 * @param {string} content - Post content
 * @returns {Array<string>} Array of extracted tags
 */
function extractTags(content) {
  // Common tech terms to look for in Arabic and English
  const techTerms = [
    'جافاسكربت', 'React', 'Angular', 'Vue', 'Next.js', 'Node.js', 
    'تطوير الويب', 'TypeScript', 'HTML', 'CSS', 'تصميم المواقع',
    'الذكاء الاصطناعي', 'AI', 'واجهة المستخدم', 'UI', 'UX',
    'تطوير التطبيقات', 'قواعد البيانات', 'API', 'DevOps',
    'أمان الويب', 'تحسين محركات البحث', 'SEO', 'PWA', 'GraphQL',
    'Webpack', 'Vite', 'Tailwind CSS', 'Bootstrap', 'Docker', 'Kubernetes'
  ];
  
  // Find matches in content
  const foundTags = techTerms.filter(term => 
    content.includes(term) || content.toLowerCase().includes(term.toLowerCase())
  );
  
  // Take up to 5 unique tags
  const uniqueTags = [...new Set(foundTags)].slice(0, 5);
  
  // Add default tags if we don't have enough
  if (uniqueTags.length < 2) {
    uniqueTags.push('تطوير الويب', 'تقنية');
  }
  
  return uniqueTags;
}

module.exports = { generatePost };