export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tag: string;
  tagColor: string;
  featured: boolean;
  content: Section[];
}

export interface Section {
  type: "paragraph" | "heading" | "subheading" | "list" | "callout" | "formula" | "table" | "steps";
  text?: string;
  items?: string[];
  rows?: string[][];
  headers?: string[];
  variant?: "tip" | "warning" | "info";
}

export const POSTS: BlogPost[] = [
  {
    slug: "how-to-prevent-stockouts-shopify",
    title: "How to Prevent Stockouts on Shopify Before They Cost You Revenue",
    excerpt: "Most Shopify merchants discover they're out of stock after a customer fails to check out. Here's a data-driven approach to catching stockouts 2–3 weeks early, using your own sales history.",
    date: "25 March 2026",
    readTime: "6 min read",
    tag: "Guide",
    tagColor: "text-[#2DD4BF] bg-[#2DD4BF]/10 border-[#2DD4BF]/20",
    featured: true,
    content: [
      {
        type: "paragraph",
        text: "A stockout is not just a missed sale — it is a compounding problem. When a product goes out of stock on Shopify, your listing gets buried in search results, customers move to a competitor, and some never come back. Studies on D2C brands in India show that a single stockout event on a top-10 SKU can cost 15–25% of that month's revenue on that product alone.",
      },
      {
        type: "paragraph",
        text: "The frustrating part: most stockouts are completely predictable. Your Shopify orders export contains everything you need to see them coming 2–3 weeks in advance. The problem is that very few merchants are actually doing the math.",
      },
      {
        type: "heading",
        text: "Why Merchants Stock Out Even When They're Watching",
      },
      {
        type: "paragraph",
        text: "The most common reason merchants stock out despite watching their inventory is that they're watching the wrong number. They look at \"units in stock\" but not \"days of stock remaining.\" Those are very different things.",
      },
      {
        type: "list",
        items: [
          "300 units sounds fine — until you're selling 40/day and your supplier needs 12 days to deliver",
          "Sales velocity changes silently — a product that sold 5/day last month might now sell 15/day after a social media mention",
          "Lead times are inconsistent — that 7-day estimate from your supplier becomes 14 days during festival season",
          "Multiple SKUs compete for attention — you catch the bestseller but miss the mid-tier product that quietly drains",
        ],
      },
      {
        type: "heading",
        text: "The Three Numbers That Actually Matter",
      },
      {
        type: "paragraph",
        text: "To predict a stockout before it happens, you only need three numbers for each product:",
      },
      {
        type: "steps",
        items: [
          "Average Daily Sales (ADS) — your units sold over the last 30 days divided by 30. Use 60 or 90 days if your sales are seasonal.",
          "Current Stock — exactly how many units are physically available to sell right now (exclude reserved/held units).",
          "Supplier Lead Time — realistic days from placing an order to units arriving in your warehouse, not the optimistic estimate.",
        ],
      },
      {
        type: "formula",
        text: "Days of Stock Remaining = Current Stock ÷ Average Daily Sales",
      },
      {
        type: "paragraph",
        text: "If Days of Stock Remaining is less than your supplier lead time, you are already in danger. You should have reordered yesterday.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Example: You have 180 units. You sell 15/day. That's 12 days of stock. Your supplier takes 14 days. You will stock out in 2 days even if you order right now.",
      },
      {
        type: "heading",
        text: "Building a Simple Early Warning System",
      },
      {
        type: "paragraph",
        text: "The right time to reorder is when your stock level hits the reorder point — not when you're already low. Your reorder point should account for both lead time and a buffer for demand spikes:",
      },
      {
        type: "formula",
        text: "Reorder Point = (Average Daily Sales × Lead Time) + Safety Stock",
      },
      {
        type: "paragraph",
        text: "For safety stock, a simple starting point: multiply your average daily sales by 7 (one week's buffer). Adjust up for products with unpredictable demand or long lead times.",
      },
      {
        type: "heading",
        text: "The Fastest Way to Do This for All Your SKUs",
      },
      {
        type: "paragraph",
        text: "Doing this calculation for 3 products takes 10 minutes with a spreadsheet. For 50+ SKUs, it becomes a full-time job — and the numbers are already outdated by the time you finish.",
      },
      {
        type: "paragraph",
        text: "This is exactly what StockSense AI automates. Export your Shopify orders as a CSV, upload it, set your lead time, and within 30 seconds you'll see which products are at risk, their exact stockout dates, how much revenue is at stake, and the specific date by which you need to place an order.",
      },
      {
        type: "callout",
        variant: "tip",
        text: "Pro tip: Run a forecast every Monday morning. 5 minutes of prevention is worth days of \"sorry, out of stock\" messages.",
      },
      {
        type: "heading",
        text: "What to Do Right Now",
      },
      {
        type: "list",
        items: [
          "Export your last 90 days of Shopify orders (Orders → Export → CSV)",
          "Calculate days of stock remaining for your top 10 SKUs",
          "Identify any product where that number is less than 2× your lead time",
          "Place reorders for those products today — not next week",
          "Set a weekly reminder to repeat this process",
        ],
      },
      {
        type: "paragraph",
        text: "The merchants who never stock out are not luckier than you — they simply check this number before it becomes a crisis.",
      },
    ],
  },

  {
    slug: "reorder-point-formula",
    title: "The Reorder Point Formula Every Shopify Merchant Should Know",
    excerpt: "Reorder Point = (Average Daily Sales × Lead Time) + Safety Stock. Sounds simple — but getting the inputs right is where most merchants go wrong. We break it down with real examples.",
    date: "18 March 2026",
    readTime: "5 min read",
    tag: "Education",
    tagColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    featured: false,
    content: [
      {
        type: "paragraph",
        text: "The reorder point is the stock level at which you need to place a new order so that fresh inventory arrives before you run out. It sounds simple. It is simple — but most merchants get at least one of the three inputs wrong, and that one mistake causes a stockout every time.",
      },
      {
        type: "formula",
        text: "Reorder Point = (Average Daily Sales × Supplier Lead Time) + Safety Stock",
      },
      {
        type: "heading",
        text: "Input 1: Average Daily Sales",
      },
      {
        type: "paragraph",
        text: "Average Daily Sales (ADS) is your total units sold in a period divided by the number of days in that period. The question is: which period should you use?",
      },
      {
        type: "list",
        items: [
          "Last 30 days — best for fast-moving products or recent trend changes",
          "Last 60 days — good balance between recency and smoothing out weekly noise",
          "Last 90 days — better for seasonal products where you want to capture the full cycle",
          "Do not use \"all time\" — your sales from 18 months ago are not a good predictor of next month",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        text: "If your sales are growing (e.g. from a new ad campaign or influencer post), use a shorter window like 14–21 days. The most recent data is the most predictive when velocity is changing.",
      },
      {
        type: "heading",
        text: "Input 2: Supplier Lead Time",
      },
      {
        type: "paragraph",
        text: "Lead time is the number of days between placing an order and receiving inventory in your warehouse. Most merchants use the optimistic number their supplier gives them. This is a mistake.",
      },
      {
        type: "paragraph",
        text: "Use the realistic lead time — meaning the number it actually takes, including processing delays, transit variance, customs clearance (for imports), and your own receiving process. If your supplier says 7 days but you've received shipments in 9–12 days before, use 12.",
      },
      {
        type: "table",
        headers: ["Scenario", "Quoted Lead Time", "Realistic Lead Time to Use"],
        rows: [
          ["Domestic supplier (India)", "5 days", "7–9 days"],
          ["Import (China / SE Asia)", "15 days", "20–25 days"],
          ["Festival season (Oct–Nov)", "7 days", "14–18 days"],
          ["New supplier (first order)", "10 days", "18–22 days"],
        ],
      },
      {
        type: "heading",
        text: "Input 3: Safety Stock",
      },
      {
        type: "paragraph",
        text: "Safety stock is the buffer inventory you keep to absorb demand spikes and supply delays. The simple formula for safety stock:",
      },
      {
        type: "formula",
        text: "Safety Stock = Average Daily Sales × Buffer Days (typically 7–14)",
      },
      {
        type: "paragraph",
        text: "Choose your buffer days based on demand unpredictability. Stable, predictable products can use 5–7 days. Products that spike with ad spend or social sharing need 10–14 days.",
      },
      {
        type: "heading",
        text: "A Real Example",
      },
      {
        type: "paragraph",
        text: "Let's say you sell protein powder. Over the last 60 days you sold 480 units — that's 8 units per day. Your supplier in Pune takes 10 days realistically. You want a 7-day buffer.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Reorder Point = (8 × 10) + (8 × 7) = 80 + 56 = 136 units. When your stock hits 136 units, place your order immediately.",
      },
      {
        type: "paragraph",
        text: "This means if you currently have 200 units, you have about 8 days before you need to reorder. Not a crisis — but you should have it in your calendar.",
      },
      {
        type: "heading",
        text: "Why This Is Hard to Do Manually at Scale",
      },
      {
        type: "paragraph",
        text: "For 5 products, you can maintain this in a spreadsheet. For 30, 50, or 200 SKUs, you need to update the numbers constantly as sales velocity changes. A product that was safe last week might be critical today if a video went viral.",
      },
      {
        type: "paragraph",
        text: "StockSense AI calculates the reorder point for every product in your catalog automatically from your Shopify CSV — and tells you the specific calendar date by which you need to place the order, not just the stock level.",
      },
    ],
  },

  {
    slug: "ai-vs-spreadsheets-inventory",
    title: "AI Forecasting vs. Spreadsheets: What's Actually Better for Shopify Inventory?",
    excerpt: "Spreadsheets work until they don't. We compare manual VLOOKUP-based tracking to AI-powered demand forecasting — including when each approach makes sense and what it actually costs you.",
    date: "10 March 2026",
    readTime: "7 min read",
    tag: "Analysis",
    tagColor: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    featured: false,
    content: [
      {
        type: "paragraph",
        text: "The honest answer is: spreadsheets work really well — until they don't. And the moment they stop working is usually a stockout that costs you more than a year of software subscriptions.",
      },
      {
        type: "paragraph",
        text: "Let's compare both approaches honestly, including their real costs and failure modes.",
      },
      {
        type: "heading",
        text: "What Spreadsheets Do Well",
      },
      {
        type: "list",
        items: [
          "Zero cost if you already know Excel or Google Sheets",
          "Full control over your formulas and logic",
          "Works for simple catalogs (under 20 SKUs with stable demand)",
          "Easy to share with your team without new software logins",
          "Good for one-off analysis when you need to dig into a specific problem",
        ],
      },
      {
        type: "heading",
        text: "Where Spreadsheets Break Down",
      },
      {
        type: "paragraph",
        text: "Spreadsheets have a fundamental problem: they show you a snapshot, not a forecast. You see what happened last month. You don't see what will happen next month.",
      },
      {
        type: "list",
        items: [
          "Manual data entry creates errors — a typo in one cell invalidates an entire column",
          "They don't detect trend changes — a product accelerating from 5/day to 15/day looks fine in a 30-day average",
          "They don't account for lead time automatically — you have to remember to subtract it",
          "They require constant maintenance — at 50+ SKUs, updating becomes a part-time job",
          "There's no alert system — you have to remember to check, and you will forget during busy periods",
          "They don't prioritise — everything looks equally urgent until something stocks out",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The most dangerous spreadsheet is the one that was accurate last month. Stale data gives you false confidence — you think you're covered when you're not.",
      },
      {
        type: "heading",
        text: "What AI Forecasting Actually Does Differently",
      },
      {
        type: "paragraph",
        text: "AI demand forecasting does not replace your spreadsheet instinct — it accelerates it. Here is what changes:",
      },
      {
        type: "table",
        headers: ["Task", "Spreadsheet", "AI (StockSense AI)"],
        rows: [
          ["Calculate days of stock remaining", "Manual, per SKU", "Automatic, all SKUs in seconds"],
          ["Detect sales trend changes", "Not detected", "Flags growing/declining SKUs with %"],
          ["Reorder date calculation", "Formula + manual lead time entry", "Auto-calculated per product"],
          ["Revenue at risk", "Not calculated", "Calculated per SKU and total"],
          ["Priority ranking", "You decide", "Critical → High → Medium → Safe"],
          ["Time to complete", "30–90 min for 50 SKUs", "Under 30 seconds"],
        ],
      },
      {
        type: "heading",
        text: "The Real Cost Comparison",
      },
      {
        type: "paragraph",
        text: "Let's run an honest cost calculation. Assume you have 50 SKUs and spend 45 minutes per week on manual inventory tracking.",
      },
      {
        type: "list",
        items: [
          "45 min/week × 52 weeks = 39 hours/year on spreadsheet maintenance",
          "If your time is worth ₹500/hour, that's ₹19,500/year in time cost",
          "Add one stockout event on a mid-tier product (say ₹30,000 revenue lost) = ₹49,500 effective cost",
          "StockSense AI Pro: ₹1,999/month = ₹23,988/year — but prevents the stockout entirely",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        text: "One prevented stockout pays for the tool for the year. The time savings are a bonus.",
      },
      {
        type: "heading",
        text: "When to Stick With Spreadsheets",
      },
      {
        type: "paragraph",
        text: "Spreadsheets are the right tool if: you have fewer than 10 SKUs with stable, predictable demand; you have seasonal products where you already know the pattern exactly; you're pre-revenue and watching costs very carefully.",
      },
      {
        type: "heading",
        text: "When to Switch to AI Forecasting",
      },
      {
        type: "list",
        items: [
          "You have 20+ SKUs and spend more than 30 minutes/week on inventory tracking",
          "You've stocked out in the last 6 months and it cost you real money",
          "Your sales velocity is changing (new ad campaigns, growing brand)",
          "You have seasonal spikes that are hard to predict manually",
          "You want to know the revenue impact of each at-risk product, not just the stock level",
        ],
      },
    ],
  },

  {
    slug: "safety-stock-calculation",
    title: "Safety Stock: How Much Inventory Buffer Is Actually Enough?",
    excerpt: "Too little safety stock and you stock out during a spike. Too much and you tie up cash. The answer depends on your lead time variance and demand volatility — here's how to calculate it.",
    date: "2 March 2026",
    readTime: "5 min read",
    tag: "Guide",
    tagColor: "text-[#2DD4BF] bg-[#2DD4BF]/10 border-[#2DD4BF]/20",
    featured: false,
    content: [
      {
        type: "paragraph",
        text: "Safety stock is the inventory buffer you keep above your expected demand to protect against two things: demand spikes (selling more than expected) and supply delays (receiving stock later than expected). Get it too low and you stock out. Get it too high and you tie up cash in slow-moving inventory.",
      },
      {
        type: "heading",
        text: "The Simple Formula (and When to Use It)",
      },
      {
        type: "formula",
        text: "Safety Stock = Average Daily Sales × Buffer Days",
      },
      {
        type: "paragraph",
        text: "This is the right formula for most Shopify merchants with stable demand and consistent suppliers. The question is: how many buffer days should you use?",
      },
      {
        type: "table",
        headers: ["Product Type", "Buffer Days", "Why"],
        rows: [
          ["Stable, predictable demand", "5–7 days", "Low variance means less buffer needed"],
          ["Moderate variance (some spikes)", "7–10 days", "Covers occasional demand jumps"],
          ["High variance (ad-driven, viral)", "10–14 days", "Demand can 3–5× overnight"],
          ["Long or unreliable lead time", "14–21 days", "Protects against supplier delays"],
          ["Festival/seasonal peak periods", "21–30 days", "Lead times stretch, demand spikes together"],
        ],
      },
      {
        type: "heading",
        text: "The Advanced Formula (For Volatile Products)",
      },
      {
        type: "paragraph",
        text: "If your demand is highly variable — for example, products that spike when you run ads or get mentioned by an influencer — use the statistical safety stock formula:",
      },
      {
        type: "formula",
        text: "Safety Stock = Z × σ(demand) × √(Lead Time)",
      },
      {
        type: "paragraph",
        text: "Where Z is your service level (1.65 for 95%, 2.05 for 98%), σ(demand) is the standard deviation of your daily sales, and Lead Time is in days. For most merchants, this is overkill — the simple formula with a generous buffer days number achieves the same result with less complexity.",
      },
      {
        type: "heading",
        text: "The Real-World Rule of Thumb",
      },
      {
        type: "callout",
        variant: "tip",
        text: "Start with safety stock = 1 week of average sales. If you've stocked out in the last 3 months, double it. Adjust down only after 3 consecutive months with no stockout risk.",
      },
      {
        type: "heading",
        text: "How Safety Stock and Cash Flow Interact",
      },
      {
        type: "paragraph",
        text: "High safety stock costs money. For a product with ₹500 unit cost and 10 units/day ADS, a 14-day safety stock means ₹70,000 tied up in buffer inventory. If you have 20 such products, that's ₹14 lakh sitting idle.",
      },
      {
        type: "paragraph",
        text: "The right balance is to have high safety stock only on high-revenue, high-margin products where a stockout costs you the most. For slow-moving or low-margin products, tighter buffers are acceptable.",
      },
      {
        type: "list",
        items: [
          "Top 20% of SKUs by revenue → 14-day safety stock",
          "Mid-tier SKUs → 7-day safety stock",
          "Slow movers / clearance products → 3–5 days or no buffer",
          "Products with long lead times → always add 5–7 extra buffer days on top of your normal buffer",
        ],
      },
      {
        type: "heading",
        text: "Reviewing Safety Stock Over Time",
      },
      {
        type: "paragraph",
        text: "Safety stock is not a set-and-forget number. Review it quarterly, and whenever something changes: a new supplier, a new sales channel, a marketing campaign, or a seasonal shift. StockSense AI recalculates safety stock and reorder points automatically every time you upload fresh data.",
      },
    ],
  },

  {
    slug: "shopify-csv-export-guide",
    title: "How to Export Your Shopify Sales Data as CSV (and What the Columns Mean)",
    excerpt: "A step-by-step walkthrough of exporting orders from Shopify admin, cleaning the data, and formatting it correctly for AI forecasting analysis.",
    date: "22 February 2026",
    readTime: "4 min read",
    tag: "Tutorial",
    tagColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    featured: false,
    content: [
      {
        type: "paragraph",
        text: "Your Shopify admin contains all the data you need for accurate inventory forecasting — daily sales velocity, product trends, and stock movement. The first step is getting that data into a CSV format that an AI forecasting tool can read.",
      },
      {
        type: "heading",
        text: "Step 1: Export Orders from Shopify Admin",
      },
      {
        type: "steps",
        items: [
          "Log in to your Shopify admin (yourstore.myshopify.com/admin)",
          "Go to Orders in the left sidebar",
          "Click the Export button (top right corner)",
          "Select the date range — we recommend the last 90 days for best forecast accuracy",
          "Choose \"All orders\" and export as CSV for Excel",
          "Download and open the CSV file",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        text: "Use the last 60–90 days for the best balance of recency and pattern detection. Less than 30 days doesn't give the AI enough data to detect trends reliably.",
      },
      {
        type: "heading",
        text: "Step 2: Understand the Key Columns",
      },
      {
        type: "paragraph",
        text: "Shopify's order export contains many columns. For inventory forecasting, these are the ones that matter:",
      },
      {
        type: "table",
        headers: ["Shopify Column", "What It Means", "Used For"],
        rows: [
          ["Created at", "Order date and time", "Calculating daily sales velocity"],
          ["Lineitem name", "Product name as listed in your store", "Identifying the product"],
          ["Lineitem sku", "Your product SKU code", "Matching products to inventory"],
          ["Lineitem quantity", "Units sold in this order", "Sales volume calculation"],
          ["Lineitem price", "Selling price per unit", "Revenue at risk calculation"],
        ],
      },
      {
        type: "heading",
        text: "Step 3: Add Current Stock Column",
      },
      {
        type: "paragraph",
        text: "Shopify's orders export does not include current stock levels — you need to add those manually. Go to Products → Inventory in your Shopify admin. For each product/variant, note the current stock level. Add a column called current_stock to your CSV.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Current stock must reflect what's physically available to sell right now — not including reserved units, damaged stock, or inventory in transit.",
      },
      {
        type: "heading",
        text: "The Ideal CSV Format for StockSense AI",
      },
      {
        type: "paragraph",
        text: "StockSense AI accepts Shopify's native order export format. For best results, your CSV should have these columns:",
      },
      {
        type: "table",
        headers: ["Column Name", "Example Value", "Required?"],
        rows: [
          ["product", "Yoga Mat — Black", "Yes"],
          ["sku", "YM-BLK-001", "Recommended"],
          ["date", "2026-02-15", "Yes"],
          ["units_sold", "12", "Yes"],
          ["current_stock", "145", "Yes"],
          ["price", "1299", "Optional (for revenue at risk)"],
        ],
      },
      {
        type: "heading",
        text: "Step 4: Clean the Data",
      },
      {
        type: "list",
        items: [
          "Remove cancelled and refunded orders — they artificially inflate your sales numbers",
          "Remove test orders (you'll recognize them by names like 'Test Customer')",
          "If you have product variants (size, color), keep them as separate rows with unique SKUs",
          "Delete rows with blank product names or zero quantity",
          "Make sure dates are in YYYY-MM-DD format or DD/MM/YYYY — both work",
        ],
      },
      {
        type: "heading",
        text: "Step 5: Upload and Forecast",
      },
      {
        type: "paragraph",
        text: "Once your CSV is clean, upload it to StockSense AI, set your supplier lead time in days, and click Run Forecast. Within 30 seconds you'll see every product ranked by stockout risk, with exact dates and reorder quantities.",
      },
      {
        type: "callout",
        variant: "tip",
        text: "Save a clean copy of your export template. Once you've set it up correctly once, future exports just need a date range change — it takes under 5 minutes.",
      },
    ],
  },

  {
    slug: "introducing-stocksense-ai",
    title: "Introducing StockSense AI: Know When to Reorder Before You Stock Out",
    excerpt: "We built StockSense AI because we kept seeing Shopify merchants lose revenue to stockouts that were completely predictable. This is why we built it and what it does.",
    date: "10 February 2026",
    readTime: "3 min read",
    tag: "Company",
    tagColor: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    featured: false,
    content: [
      {
        type: "paragraph",
        text: "Every Shopify merchant we spoke to had the same problem: they found out they were out of stock when a customer complained, or when they noticed the product had dropped off their bestseller list. By then, the damage was already done.",
      },
      {
        type: "paragraph",
        text: "The data to predict this — sales velocity, current stock, supplier lead time — was sitting right there in their Shopify admin. Nobody was doing the math on it consistently. Most merchants were running on instinct and memory, checking their stock levels whenever they remembered to.",
      },
      {
        type: "heading",
        text: "What We Built",
      },
      {
        type: "paragraph",
        text: "StockSense AI takes your Shopify order export (a CSV file) and returns, in under 30 seconds:",
      },
      {
        type: "list",
        items: [
          "Every product ranked by stockout risk (Critical / High / Medium / Safe)",
          "Exact days of stock remaining for each SKU based on actual sales velocity",
          "The specific calendar date by which you need to place a reorder",
          "Recommended reorder quantity with safety stock buffer",
          "Revenue at risk if critical products stock out",
          "An overall inventory health score (0–100) so you can track improvement over time",
        ],
      },
      {
        type: "heading",
        text: "Who It's For",
      },
      {
        type: "paragraph",
        text: "StockSense AI is built specifically for Shopify merchants managing physical products — especially D2C brands in India who are growing fast and managing 20–200+ SKUs across categories like wellness, fashion, home, and electronics.",
      },
      {
        type: "paragraph",
        text: "It works whether you manufacture your own products, source from domestic suppliers, or import from overseas. The lead time input lets you calibrate forecasts to your exact supply chain.",
      },
      {
        type: "heading",
        text: "Why AI?",
      },
      {
        type: "paragraph",
        text: "The AI layer does two things a simple spreadsheet formula cannot: it detects sales trend changes (a product accelerating or decelerating), and it provides contextual recommendations that explain why a product is at risk — not just that it is.",
      },
      {
        type: "callout",
        variant: "info",
        text: "\"Sales velocity jumped 38% in the last 7 days but stock will run out in 9 days — order 240 units by March 28 to avoid stockout\" is more useful than just seeing a red cell.",
      },
      {
        type: "heading",
        text: "Get Started Free",
      },
      {
        type: "paragraph",
        text: "StockSense AI has a free tier — upload your CSV and run a full forecast with no credit card required. If it saves you one stockout, it has already paid for itself.",
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
