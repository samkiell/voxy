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
    const totalBusinesses = (await db.query('SELECT count(*) FROM businesses')).rows[0].count;
    const activeBusinesses = (await db.query('SELECT count(DISTINCT business_id) FROM usage_logs WHERE created_at >= NOW() - INTERVAL \'7 days\'')).rows[0].count;
    
    // 2. Get total platform cost (SUM of all usage_logs)
    const totalCostResult = await db.query('SELECT SUM(cost_estimate) as total FROM usage_logs');
    const totalCost = parseFloat(totalCostResult.rows[0]?.total || 0);

    // 3. Get total revenue (SUM of credit purchases)
    const totalRevenueResult = await db.query("SELECT SUM(ABS(amount)) as total FROM transactions WHERE type = 'credit_purchase'");
    const totalRevenue = parseFloat(totalRevenueResult.rows[0]?.total || 0);

    // 4. Get Top Businesses with Financials
    const topBusinessesResult = await db.query(`
      SELECT 
        b.id, b.name, 
        COALESCE(SUM(u.cost_estimate), 0) as infra_cost,
        COALESCE((SELECT SUM(ABS(amount)) FROM transactions t WHERE t.business_id = b.id AND t.type = 'credit_purchase'), 0) as revenue
      FROM businesses b
      LEFT JOIN usage_logs u ON b.id = u.business_id
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

    return NextResponse.json({
      success: true,
      totalBusinesses: parseInt(totalBusinesses),
      activeBusinesses: parseInt(activeBusinesses),
      totalCost,
      totalRevenue,
      totalProfit: totalRevenue - totalCost,
      topBusinesses,
      metrics: {
        totalBusinesses: parseInt(totalBusinesses),
        activeBusinesses: parseInt(activeBusinesses),
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
