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
    slug: "shopify-stocky-shutdown-migration",
    title: "Shopify Stocky Is Shutting Down: Complete Migration Guide for Merchants",
    excerpt: "Shopify Stocky — the free inventory management app built into Shopify — is being discontinued in August 2026. Here's everything you need to know, what you'll lose, and how to migrate to a replacement before your next peak season.",
    date: "8 April 2026",
    readTime: "7 min read",
    tag: "Guide",
    tagColor: "text-[#C4714A] bg-[rgba(196,113,74,0.12)] border-[rgba(196,113,74,0.2)]",
    featured: true,
    content: [
      {
        type: "paragraph",
        text: "If you've relied on Shopify Stocky to manage purchase orders and track inventory, you have a deadline: August 2026. Shopify is discontinuing the app, and merchants who haven't migrated will lose access to all Stocky features — purchase order history, supplier records, demand forecasts, and the reorder point alerts you may have been relying on for years.",
      },
      {
        type: "paragraph",
        text: "This guide covers what Stocky actually did, what you'll lose when it's gone, what to look for in a replacement, and how to migrate without losing data or creating gaps in your inventory management process.",
      },
      {
        type: "heading",
        text: "What Shopify Stocky Actually Did",
      },
      {
        type: "paragraph",
        text: "Stocky was a free inventory management app developed by Shopify and available exclusively to Shopify merchants. Unlike third-party apps, it had direct access to your Shopify product catalog, orders, and inventory levels — no OAuth, no webhooks, no API keys.",
      },
      {
        type: "list",
        items: [
          "Purchase order creation and management — create POs, send to suppliers, receive stock",
          "Demand forecasting — basic sales velocity calculations to suggest reorder quantities",
          "Reorder point suggestions — inventory level thresholds that triggered a reorder alert",
          "Supplier management — store supplier contact information alongside products",
          "ABC analysis — classify products by revenue contribution to prioritise ordering",
          "Inventory adjustment logs — track manual stock adjustments and their reasons",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Deadline: Shopify Stocky is shutting down in August 2026. After that date, you will lose access to all Stocky data including purchase order history and supplier records. Export your data before then.",
      },
      {
        type: "heading",
        text: "What You'll Lose When Stocky Disappears",
      },
      {
        type: "paragraph",
        text: "The shutdown affects more than just the interface. Any data that lives exclusively in Stocky — supplier contacts, historical POs, inventory adjustment notes — will be inaccessible unless you export it before the cutoff.",
      },
      {
        type: "list",
        items: [
          "All purchase order history — you won't be able to look up what you ordered, from whom, or when",
          "Supplier contact database — names, emails, lead times you've stored against each product",
          "Reorder point configuration — any custom thresholds you've set up per SKU",
          "Demand forecasts — Stocky's historical forecast data and accuracy records",
          "Inventory adjustment history — notes and reasons for manual stock changes",
        ],
      },
      {
        type: "heading",
        text: "Export Your Stocky Data Before the Deadline",
      },
      {
        type: "paragraph",
        text: "Before you migrate to a new tool, export everything Stocky has. This is time-sensitive — once the app shuts down, this data is gone.",
      },
      {
        type: "steps",
        items: [
          "Open Shopify Admin → Apps → Stocky",
          "Go to Settings → Export Data (or check each section for its own export button)",
          "Export your purchase order history as CSV",
          "Export your supplier list",
          "Screenshot or export any custom reorder point settings",
          "Save all files to a folder labelled with today's date — you may need to reference them during migration",
        ],
      },
      {
        type: "heading",
        text: "What to Look for in a Stocky Replacement",
      },
      {
        type: "paragraph",
        text: "Not all inventory tools are equivalent replacements for Stocky. When evaluating alternatives, the key question is whether the tool gives you actionable decisions — not just dashboards and charts.",
      },
      {
        type: "table",
        headers: ["Capability", "Why It Matters"],
        rows: [
          ["Exact stockout dates per SKU", "You need to know when each product runs out, not just that it's 'low'"],
          ["Lead time awareness", "Reorder points that ignore lead time are worse than useless — they give false safety"],
          ["Revenue at risk calculation", "Prioritises which stockouts to prevent based on actual impact"],
          ["No Shopify app install required", "App-based tools add friction, permissions overhead, and monthly cost per store"],
          ["CSV upload compatibility", "Works with your existing Shopify data export without custom integrations"],
          ["Purchase order generation", "Creates supplier-ready POs from forecast data in one click"],
        ],
      },
      {
        type: "heading",
        text: "How to Migrate to Forestock",
      },
      {
        type: "paragraph",
        text: "Forestock is designed as a direct Stocky replacement — and it goes further. It doesn't require a Shopify app install, calculates exact stockout dates (not just reorder suggestions), and shows the revenue at risk for each at-risk product. Here's how to migrate:",
      },
      {
        type: "steps",
        items: [
          "Export your Shopify orders as CSV: Shopify Admin → Orders → Export → Last 90 days",
          "Export your current inventory: Shopify Admin → Products → Inventory → Export",
          "Go to getforestock.com/forecast and upload your orders CSV",
          "Set your supplier lead time in days (use the realistic number, not the optimistic one)",
          "Run the forecast — you'll see every SKU ranked by stockout risk with exact dates",
          "Review the reorder quantities and export a purchase order for any critical SKUs",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        text: "For the lead time field, use your actual average lead time — not what your supplier promises. If they say 7 days but it usually takes 10, use 10. One missed stockout costs more than the error.",
      },
      {
        type: "heading",
        text: "What's Better About Forestock vs Stocky",
      },
      {
        type: "paragraph",
        text: "Stocky was a capable tool, but it was built when inventory management was simpler. Forestock is built for the current reality: faster-moving D2C brands, unpredictable demand from ad spend and social traffic, and the need for instant decisions rather than weekly check-ins.",
      },
      {
        type: "table",
        headers: ["Feature", "Shopify Stocky", "Forestock"],
        rows: [
          ["Exact stockout date", "Not shown — only reorder suggestion", "Shown per SKU with calendar date"],
          ["Revenue at risk", "Not calculated", "Calculated per product and total"],
          ["Ad-spend correlation", "Not available", "Available in Pro plan"],
          ["Shopify app required", "Yes — must install app", "No — CSV upload, no install"],
          ["Lead time integration", "Manual, basic", "Per-product, used in all calculations"],
          ["Purchase orders", "Yes", "Yes, one-click from forecast"],
          ["Price", "Free (until shutdown)", "$0 free tier, $9/mo Pro"],
        ],
      },
      {
        type: "heading",
        text: "Migrate Before Peak Season",
      },
      {
        type: "paragraph",
        text: "The worst time to switch inventory tools is during your highest-volume period. If you sell through festivals, seasonal peaks, or campaign-driven spikes, migrate and complete at least one full forecasting cycle before that window arrives.",
      },
      {
        type: "paragraph",
        text: "Forestock's free tier lets you run unlimited forecasts on up to 5 products at no cost — enough to validate the tool and get comfortable with the workflow before you rely on it for your full catalog.",
      },
    ],
  },
  {
    slug: "shopify-inventory-forecast-csv",
    title: "How to Forecast Your Shopify Inventory from a CSV File (Step-by-Step)",
    excerpt: "Your Shopify orders CSV contains everything you need to predict stockouts weeks in advance. This guide walks through the exact process — from export to forecast — including the formulas, the common mistakes, and how to read the results.",
    date: "1 April 2026",
    readTime: "8 min read",
    tag: "Tutorial",
    tagColor: "text-[#7C5C8C] bg-[rgba(124,92,140,0.12)] border-[rgba(124,92,140,0.2)]",
    featured: false,
    content: [
      {
        type: "paragraph",
        text: "You don't need a Shopify app, an API integration, or a data analyst to forecast your inventory. Your Shopify admin already exports everything you need as a CSV file — and with the right process, you can go from raw export to a ranked list of at-risk SKUs in under 30 minutes the first time, and under 5 minutes every week after that.",
      },
      {
        type: "paragraph",
        text: "This guide covers the complete process: what to export, which columns matter, the forecasting formulas, and how to interpret the results.",
      },
      {
        type: "heading",
        text: "Why CSV-Based Forecasting Works",
      },
      {
        type: "paragraph",
        text: "Shopify's order export is a complete record of your sales history — every SKU, every quantity, every date. That's the core input for any demand forecast. The CSV approach works because it uses your actual data, not samples or estimates, and it doesn't require any third-party access to your store.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The accuracy ceiling for any forecast is set by the quality and length of your sales history. 60–90 days of consistent data produces reliable stockout dates. Less than 30 days produces rough estimates only.",
      },
      {
        type: "heading",
        text: "Step 1 — Export Your Shopify Orders CSV",
      },
      {
        type: "steps",
        items: [
          "Log in to Shopify Admin (yourstore.myshopify.com/admin)",
          "Click Orders in the left sidebar",
          "Click the Export button in the top right",
          "Select date range: Last 90 days for best results (minimum: Last 30 days)",
          "Select All orders and export format CSV for Excel",
          "Click Export orders — the file downloads to your computer",
        ],
      },
      {
        type: "heading",
        text: "Step 2 — Which Columns Drive the Forecast",
      },
      {
        type: "paragraph",
        text: "Shopify's order export has dozens of columns. For inventory forecasting, only five of them matter. Everything else can be ignored.",
      },
      {
        type: "table",
        headers: ["Column Name", "What It Is", "Used For"],
        rows: [
          ["Created at", "Order timestamp", "Calculating daily sales velocity per product"],
          ["Lineitem name", "Product + variant name", "Identifying which product was sold"],
          ["Lineitem sku", "Your SKU code", "Matching products across systems"],
          ["Lineitem quantity", "Units sold in this line", "Total units sold per product per day"],
          ["Lineitem price", "Price per unit", "Revenue at risk if the product stocks out"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Before you run any calculations, filter out cancelled and refunded orders. Including them inflates your apparent sales velocity and produces optimistic (wrong) forecasts.",
      },
      {
        type: "heading",
        text: "Step 3 — Add Current Stock Levels",
      },
      {
        type: "paragraph",
        text: "The orders CSV doesn't include current stock — you need to add that. Go to Shopify Admin → Products → Inventory and export that file too. Or add a column manually with today's stock levels per SKU. This is the most important input in the whole forecast — an error here affects every calculation downstream.",
      },
      {
        type: "list",
        items: [
          "Use units physically available to sell — not including in-transit stock, reserved orders, or damaged units",
          "If you have multiple warehouse locations, use the combined available quantity",
          "Update this number on the day you run the forecast — yesterday's stock count produces yesterday's forecast",
        ],
      },
      {
        type: "heading",
        text: "Step 4 — The Core Forecasting Formula",
      },
      {
        type: "paragraph",
        text: "With sales history and current stock, the stockout forecast is a three-step calculation:",
      },
      {
        type: "formula",
        text: "Average Daily Sales (ADS) = Total Units Sold ÷ Number of Days in Period",
      },
      {
        type: "formula",
        text: "Days of Stock Remaining = Current Stock ÷ Average Daily Sales",
      },
      {
        type: "formula",
        text: "Stockout Date = Today + Days of Stock Remaining",
      },
      {
        type: "paragraph",
        text: "Example: you have 180 units of a product. It sold 450 units in the last 90 days. ADS = 450/90 = 5 units/day. Days of stock = 180/5 = 36 days. Stockout date = today + 36 days.",
      },
      {
        type: "heading",
        text: "Step 5 — Calculate Reorder Point",
      },
      {
        type: "paragraph",
        text: "Days of stock tells you when you'll run out. The reorder point tells you when to order. These are different numbers — and the gap between them is where merchants lose revenue.",
      },
      {
        type: "formula",
        text: "Reorder Point = (ADS × Supplier Lead Time) + Safety Stock",
      },
      {
        type: "formula",
        text: "Safety Stock = ADS × Buffer Days (use 7–14 depending on demand variance)",
      },
      {
        type: "paragraph",
        text: "Using the example above: ADS = 5, lead time = 10 days, safety stock = 5 × 7 = 35 units. Reorder point = (5 × 10) + 35 = 85 units. When your stock drops to 85 units, place the order immediately.",
      },
      {
        type: "callout",
        variant: "tip",
        text: "If your Days of Stock Remaining is already less than your lead time, you are late. Order today and expect a brief stockout window unless you have expediting options.",
      },
      {
        type: "heading",
        text: "Step 6 — Run the Forecast in Forestock",
      },
      {
        type: "paragraph",
        text: "Doing this manually for 3–5 products is feasible. For 20+ SKUs, it becomes a spreadsheet maintenance job that will be out of date before you finish. Forestock automates all the steps above from your CSV upload:",
      },
      {
        type: "steps",
        items: [
          "Go to getforestock.com/forecast",
          "Upload your Shopify orders CSV (the file you exported in Step 1)",
          "Enter your supplier lead time in days — this applies globally; you can adjust per-product after",
          "Click Run Forecast",
          "Review the ranked product list: Critical (stock out in <7 days), High (<21 days), Safe",
          "For any Critical or High product, click Generate PO to create a purchase order ready to send",
        ],
      },
      {
        type: "heading",
        text: "How to Read Your Forecast Results",
      },
      {
        type: "table",
        headers: ["Column", "What It Shows", "What to Do"],
        rows: [
          ["Stockout Date", "Calendar date the product runs out at current velocity", "If within 3× your lead time, order now"],
          ["Days Remaining", "Days until stockout at current ADS", "Anything below lead time is already critical"],
          ["Reorder Qty", "Units to order to cover demand + safety buffer", "Use this as your PO quantity starting point"],
          ["Revenue at Risk", "Sales you'll lose if the stockout happens", "Prioritise the highest-revenue at-risk SKUs first"],
          ["Urgency", "Critical / High / Safe classification", "Critical = order today, High = order this week"],
        ],
      },
      {
        type: "heading",
        text: "Common Mistakes That Skew CSV Forecasts",
      },
      {
        type: "list",
        items: [
          "Including cancelled/refunded orders — this inflates ADS and makes stockout dates look further away than they are",
          "Using too short a date range — 14-day data captures one bad week and treats it as normal velocity",
          "Stale stock counts — if your stock figure is from last week, your Days Remaining is wrong by exactly the units sold since then",
          "Using supplier's quoted lead time instead of actual lead time — a systematic optimism bias that causes consistent late reorders",
          "Treating variants as one product — a shoe that comes in 6 sizes has 6 different stock levels and 6 different forecast outputs",
          "Running the forecast once a month — velocity changes weekly; a monthly forecast misses trend shifts",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        text: "Set a weekly recurring reminder to export and upload a fresh CSV. Monday morning works well — it captures the previous week's sales and gives you time to place orders before the weekend.",
      },
      {
        type: "heading",
        text: "What Frequency Is Right",
      },
      {
        type: "paragraph",
        text: "For most Shopify merchants, a weekly forecast cadence is sufficient. Run it every Monday, review Critical and High items, place any necessary orders, and move on. The whole process takes under 10 minutes once you have a clean CSV template.",
      },
      {
        type: "paragraph",
        text: "Increase frequency during peak seasons, after a significant ad campaign launch, or any time you get unexpected press or social traffic that might spike demand on a specific product. Those are the moments when a stockout from undetected velocity change costs the most.",
      },
    ],
  },
  {
    slug: "how-to-prevent-stockouts-shopify",
    title: "How to Prevent Stockouts on Shopify Before They Cost You Revenue",
    excerpt: "Most Shopify merchants discover they're out of stock after a customer fails to check out. Here's a data-driven approach to catching stockouts 2–3 weeks early, using your own sales history.",
    date: "25 March 2026",
    readTime: "6 min read",
    tag: "Guide",
    tagColor: "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20",
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
        text: "This is exactly what Forestock automates. Export your Shopify orders as a CSV, upload it, set your lead time, and within 30 seconds you'll see which products are at risk, their exact stockout dates, how much revenue is at stake, and the specific date by which you need to place an order.",
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
        text: "Forestock calculates the reorder point for every product in your catalog automatically from your Shopify CSV — and tells you the specific calendar date by which you need to place the order, not just the stock level.",
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
        headers: ["Task", "Spreadsheet", "AI (Forestock)"],
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
          "Forestock Pro: ₹1,999/month = ₹23,988/year — but prevents the stockout entirely",
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
    tagColor: "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20",
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
        text: "Safety stock is not a set-and-forget number. Review it quarterly, and whenever something changes: a new supplier, a new sales channel, a marketing campaign, or a seasonal shift. Forestock recalculates safety stock and reorder points automatically every time you upload fresh data.",
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
        text: "The Ideal CSV Format for Forestock",
      },
      {
        type: "paragraph",
        text: "Forestock accepts Shopify's native order export format. For best results, your CSV should have these columns:",
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
        text: "Once your CSV is clean, upload it to Forestock, set your supplier lead time in days, and click Run Forecast. Within 30 seconds you'll see every product ranked by stockout risk, with exact dates and reorder quantities.",
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
    title: "Introducing Forestock: Know When to Reorder Before You Stock Out",
    excerpt: "We built Forestock because we kept seeing Shopify merchants lose revenue to stockouts that were completely predictable. This is why we built it and what it does.",
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
        text: "Forestock takes your Shopify order export (a CSV file) and returns, in under 30 seconds:",
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
        text: "Forestock is built specifically for Shopify merchants managing physical products — especially D2C brands in India who are growing fast and managing 20–200+ SKUs across categories like wellness, fashion, home, and electronics.",
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
        text: "Forestock has a free tier — upload your CSV and run a full forecast with no credit card required. If it saves you one stockout, it has already paid for itself.",
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
