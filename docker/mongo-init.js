// Initial hydration of the database
db = db.getSiblingDB("crypto-portfolio")

db.createCollection("user")
db.user.insertMany([{ user: "Alice" }, { user: "Bob" }])

db.createCollection("portfolio")
db.portfolio.insertMany([
  { user: "Alice", assets: [], lastUpdated: new Date().toISOString() },
  {
    user: "Bob",
    assets: [
      { coin: "BTC", amount: 1.23 },
      { coin: "ETH", amount: 3.45 },
      { coin: "SOL", amount: 6.78 },
    ],
    lastUpdated: new Date().toISOString(),
  },
])
