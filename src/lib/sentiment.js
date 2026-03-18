/**
 * Lightweight sentiment analysis without an LLM.
 * Returns 'Positive', 'Negative', or 'Neutral'.
 */
export function detectSentiment(text) {
  if (!text || typeof text !== 'string') return 'Neutral';
  
  const lower = text.toLowerCase();
  
  // Weights can be added, but a simple count works for this scenario
  const positiveWords = [
    'thank', 'great', 'good', 'awesome', 'love', 'amazing', 
    'excellent', 'perfect', 'appreciate', 'happy', 'cool', 
    'nice', 'sweet', 'best', 'fantastic'
  ];
  
  const negativeWords = [
    'bad', 'terrible', 'hate', 'worst', 'angry', 'upset', 
    'complain', 'issue', 'problem', 'broken', 'wrong', 
    'delay', 'suck', 'awful', 'horrible', 'poor', 'slow'
  ];
  
  let pScore = 0;
  let nScore = 0;
  
  positiveWords.forEach(w => { if (lower.includes(w)) pScore++; });
  negativeWords.forEach(w => { if (lower.includes(w)) nScore++; });
  
  if (pScore > nScore) return 'Positive';
  if (nScore > pScore) return 'Negative';
  
  return 'Neutral';
}
