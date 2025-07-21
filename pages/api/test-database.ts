import { NextApiRequest, NextApiResponse } from 'next';
import { databaseApi } from '../../src/lib/database-api';
import { withRateLimit, rateLimitConfigs } from '../../src/lib/rateLimiter';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const testResults = [];

    // Test 1: Basic Casino Retrieval
    try {
      const startTime = Date.now();
      const casinos = await databaseApi.getCasinos({ limit: 5 });
      const endTime = Date.now();
      
      testResults.push({
        test: 'Basic Casino Retrieval',
        success: Array.isArray(casinos) && casinos.length > 0,
        details: {
          count: casinos.length,
          responseTime: `${endTime - startTime}ms`,
          firstCasino: casinos[0] ? {
            id: casinos[0].id,
            name: casinos[0].name,
            rating: casinos[0].rating,
            hasFeatures: Array.isArray(casinos[0].casino_features),
            hasBadges: Array.isArray(casinos[0].casino_badges)
          } : null
        }
      });
    } catch (error) {
      testResults.push({
        test: 'Basic Casino Retrieval',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 2: Casino Search Functionality
    try {
      const startTime = Date.now();
      const searchResults = await databaseApi.getCasinos({ 
        search: 'Ducky',
        limit: 3 
      });
      const endTime = Date.now();
      
      testResults.push({
        test: 'Casino Search Functionality',
        success: Array.isArray(searchResults) && searchResults.length > 0,
        details: {
          searchTerm: 'Ducky',
          count: searchResults.length,
          responseTime: `${endTime - startTime}ms`,
          results: searchResults.map(casino => ({
            id: casino.id,
            name: casino.name,
            slug: casino.slug
          }))
        }
      });
    } catch (error) {
      testResults.push({
        test: 'Casino Search Functionality',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 3: Casino Filtering
    try {
      const startTime = Date.now();
      const filteredResults = await databaseApi.getCasinos({ 
        safetyIndex: ['High', 'Very High'],
        rating: 4.0,
        limit: 5
      });
      const endTime = Date.now();
      
      testResults.push({
        test: 'Casino Filtering',
        success: Array.isArray(filteredResults),
        details: {
          filters: {
            safetyIndex: ['High', 'Very High'],
            minRating: 4.0
          },
          count: filteredResults.length,
          responseTime: `${endTime - startTime}ms`,
          results: filteredResults.map(casino => ({
            name: casino.name,
            rating: casino.rating,
            safetyIndex: casino.safety_index
          }))
        }
      });
    } catch (error) {
      testResults.push({
        test: 'Casino Filtering',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 4: Single Casino Retrieval
    try {
      const startTime = Date.now();
      const casino = await databaseApi.getCasino('ducky-luck');
      const endTime = Date.now();
      
      testResults.push({
        test: 'Single Casino Retrieval',
        success: casino !== null && typeof casino === 'object',
        details: {
          identifier: 'ducky-luck',
          found: casino !== null,
          responseTime: `${endTime - startTime}ms`,
          casino: casino ? {
            id: casino.id,
            name: casino.name,
            slug: casino.slug,
            rating: casino.rating,
            featuresCount: casino.casino_features?.length || 0,
            badgesCount: casino.casino_badges?.length || 0,
            linksCount: casino.casino_links?.length || 0
          } : null
        }
      });
    } catch (error) {
      testResults.push({
        test: 'Single Casino Retrieval',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 5: Casinos for Cards Format
    try {
      const startTime = Date.now();
      const casinosForCards = await databaseApi.getCasinosForCards({ limit: 3 });
      const endTime = Date.now();
      
      testResults.push({
        test: 'Casinos for Cards Format',
        success: Array.isArray(casinosForCards) && casinosForCards.length > 0,
        details: {
          count: casinosForCards.length,
          responseTime: `${endTime - startTime}ms`,
          firstCard: casinosForCards[0] ? {
            id: casinosForCards[0].id,
            name: casinosForCards[0].name,
            hasFeatures: Array.isArray(casinosForCards[0].features),
            hasBadges: Array.isArray(casinosForCards[0].badges),
            hasLinks: typeof casinosForCards[0].links === 'object'
          } : null
        }
      });
    } catch (error) {
      testResults.push({
        test: 'Casinos for Cards Format',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 6: News Articles Retrieval
    try {
      const startTime = Date.now();
      const newsArticles = await databaseApi.getNewsArticles({ limit: 3 });
      const endTime = Date.now();
      
      testResults.push({
        test: 'News Articles Retrieval',
        success: Array.isArray(newsArticles),
        details: {
          count: newsArticles.length,
          responseTime: `${endTime - startTime}ms`,
          articles: newsArticles.map(article => ({
            id: article.id,
            title: article.title,
            slug: article.slug,
            isPublished: article.is_published
          }))
        }
      });
    } catch (error) {
      testResults.push({
        test: 'News Articles Retrieval',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 7: Advanced Search
    try {
      const startTime = Date.now();
      const advancedResults = await databaseApi.advancedSearch({
        query: 'casino',
        rating: { min: 3.5 },
        isHot: true,
        limit: 3
      });
      const endTime = Date.now();
      
      testResults.push({
        test: 'Advanced Search',
        success: Array.isArray(advancedResults),
        details: {
          searchParams: {
            query: 'casino',
            minRating: 3.5,
            isHot: true
          },
          count: advancedResults.length,
          responseTime: `${endTime - startTime}ms`,
          results: advancedResults.map(casino => ({
            name: casino.name,
            rating: casino.rating,
            isHot: casino.is_hot
          }))
        }
      });
    } catch (error) {
      testResults.push({
        test: 'Advanced Search',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Calculate summary
    const totalTests = testResults.length;
    const passedTests = testResults.filter(result => result.success).length;
    const failedTests = totalTests - passedTests;
    const successRate = totalTests > 0 ? (passedTests / totalTests * 100).toFixed(2) : '0';

    return res.status(200).json({
      success: failedTests === 0,
      summary: {
        totalTests,
        passedTests,
        failedTests,
        successRate: `${successRate}%`
      },
      databaseStatus: 'Connected',
      testResults,
      timestamp: new Date().toISOString(),
      message: failedTests === 0 ? 
        '🎉 All database tests passed!' : 
        `⚠️ ${failedTests} out of ${totalTests} tests failed`
    });

  } catch (error) {
    console.error('Database test API error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}

// Export with rate limiting
export default withRateLimit(rateLimitConfigs.general, handler);
