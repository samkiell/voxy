import { NextResponse } from 'next/server';
import { isAdmin, adminError } from '@/lib/adminAuth';
import db from '@/lib/db';

export async function GET() {
  try {
    const authStatus = await isAdmin();
    if (!authStatus.authorized) {
      return adminError(authStatus.error, authStatus.status);
    }

    // 1. Get total users & businesses
    const totalUsers = (await db.query('SELECT count(*) FROM users')).rows[0].count;
    const recentUsersResult = await db.query("SELECT count(*) FROM users WHERE created_at >= NOW() - INTERVAL '7 days'");
    const recentUsers7d = recentUsersResult.rows[0].count;

    const totalBusinesses = (await db.query('SELECT count(*) FROM businesses')).rows[0].count;
    const activeBusinesses = (await db.query(`SELECT count(DISTINCT business_id) FROM ai_usage_logs WHERE created_at >= NOW() - INTERVAL '7 days'`)).rows[0].count;
    
    // 2. Get total conversations
    const totalConversations = (await db.query('SELECT count(*) FROM conversations')).rows[0].count;

    // 3. Get total platform cost (SUM of all usage_logs + ai_usage_logs)
    const totalUsageCost = parseFloat((await db.query('SELECT SUM(cost_estimate) as total FROM ai_usage_logs')).rows[0]?.total || 0);
    const totalLegacyCost = parseFloat((await db.query('SELECT SUM(cost_estimate) as total FROM usage_logs')).rows[0]?.total || 0);
    const totalCost = totalUsageCost + totalLegacyCost;

    // 4. Get total revenue (SUM of credit purchases)
    const totalRevenueResult = await db.query("SELECT SUM(ABS(amount)) as total FROM transactions WHERE type = 'credit_purchase'");
    const totalRevenue = parseFloat(totalRevenueResult.rows[0]?.total || 0);

    // 5. Get Top Businesses with Financials (Merging both log tables)
    const topBusinessesResult = await db.query(`
      SELECT 
        b.id, b.name, 
        COALESCE((SELECT SUM(cost_estimate) FROM ai_usage_logs WHERE business_id = b.id), 0) +
        COALESCE((SELECT SUM(cost_estimate) FROM usage_logs WHERE business_id = b.id), 0) as infra_cost,
        COALESCE((SELECT SUM(ABS(amount)) FROM transactions t WHERE t.business_id = b.id AND t.type = 'credit_purchase'), 0) as revenue
      FROM businesses b
      GROUP BY b.id, b.name
      ORDER BY infra_cost DESC NULLS LAST
      LIMIT 10
    `);

    const topBusinesses = topBusinessesResult.rows.map(b => ({
      id: b.id,
      name: b.name,
      cost: parseFloat(b.infra_cost || 0),
      revenue: parseFloat(b.revenue || 0),
      profit: parseFloat(b.revenue || 0) - parseFloat(b.infra_cost || 0)
    }));

    // 6. Growth Chart Data (Last 7 days registrations)
    const chartDataResult = await db.query(`
      SELECT 
        to_char(created_at, 'Mon DD') as name,
        count(*) as registrations
      FROM users
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY to_char(created_at, 'Mon DD'), date_trunc('day', created_at)
      ORDER BY date_trunc('day', created_at) ASC
    `);

    return NextResponse.json({
      success: true,
      totalBusinesses: parseInt(totalBusinesses),
      activeBusinesses: parseInt(activeBusinesses),
      totalCost,
      totalRevenue,
      totalProfit: totalRevenue - totalCost,
      topBusinesses,
      chartData: chartDataResult.rows,
      metrics: {
        total_users: parseInt(totalUsers),
        total_conversations: parseInt(totalConversations),
        recent_users_7d: parseInt(recentUsers7d),
        total_businesses: parseInt(totalBusinesses),
        active_businesses: parseInt(activeBusinesses)
      }
    });

  } catch (error) {
    console.error('Admin Metrics Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
