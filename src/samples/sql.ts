export const sqlSamples = [
  {
    id: 'sql-window-functions',
    title: 'Advanced Window Functions',
    description: 'Complex window function patterns for analytics',
    category: 'Analytics',
    language: 'sql',
    code: `-- Running totals with partitioning
WITH daily_sales AS (
  SELECT
    date_trunc('day', created_at) as sale_date,
    product_id,
    category_id,
    SUM(amount) as daily_amount
  FROM sales
  GROUP BY 1, 2, 3
)
SELECT
  sale_date,
  product_id,
  category_id,
  daily_amount,
  SUM(daily_amount) OVER (
    PARTITION BY category_id
    ORDER BY sale_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) as category_running_total,
  SUM(daily_amount) OVER (
    ORDER BY sale_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) as total_running_total,
  AVG(daily_amount) OVER (
    PARTITION BY category_id
    ORDER BY sale_date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) as category_7day_avg
FROM daily_sales
ORDER BY category_id, sale_date;

-- Percentile calculations
WITH product_stats AS (
  SELECT
    category_id,
    product_id,
    AVG(price) as avg_price,
    COUNT(*) as sale_count
  FROM sales
  GROUP BY 1, 2
)
SELECT
  category_id,
  product_id,
  avg_price,
  sale_count,
  PERCENT_RANK() OVER (
    PARTITION BY category_id
    ORDER BY avg_price
  ) as price_percentile,
  NTILE(4) OVER (
    PARTITION BY category_id
    ORDER BY sale_count DESC
  ) as sales_quartile,
  FIRST_VALUE(product_id) OVER (
    PARTITION BY category_id
    ORDER BY sale_count DESC
  ) as best_selling_product,
  LAG(avg_price) OVER (
    PARTITION BY category_id
    ORDER BY avg_price
  ) as prev_price,
  LEAD(avg_price) OVER (
    PARTITION BY category_id
    ORDER BY avg_price
  ) as next_price
FROM product_stats;

-- Time series analysis
WITH RECURSIVE dates AS (
  SELECT
    date_trunc('day', min(created_at)) as date
  FROM sales
  UNION ALL
  SELECT
    date + interval '1 day'
  FROM dates
  WHERE date < date_trunc('day', now())
),
daily_metrics AS (
  SELECT
    date_trunc('day', created_at) as date,
    COUNT(*) as orders,
    COUNT(DISTINCT customer_id) as customers,
    SUM(amount) as revenue
  FROM sales
  GROUP BY 1
)
SELECT
  d.date,
  COALESCE(m.orders, 0) as orders,
  COALESCE(m.customers, 0) as customers,
  COALESCE(m.revenue, 0) as revenue,
  AVG(COALESCE(m.revenue, 0)) OVER (
    ORDER BY d.date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) as revenue_7day_ma,
  COALESCE(
    (m.revenue - LAG(m.revenue) OVER (ORDER BY d.date)) /
    NULLIF(LAG(m.revenue) OVER (ORDER BY d.date), 0) * 100,
    0
  ) as revenue_growth_pct
FROM dates d
LEFT JOIN daily_metrics m ON d.date = m.date
ORDER BY d.date;`
  }
];