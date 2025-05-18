// Initial hydration of the database
db = db.getSiblingDB("crypto-portfolio")

db.createCollection("user")
db.user.insertMany([{ user: "Alice" }, { user: "Bob" }])

db.createCollection("portfolio")
db.portfolio.insertMany([
  { user: "Alice", assets: [], lastUpdated: new Date().toISOString() },
  { user: "Bob", assets: [], lastUpdated: new Date().toISOString() },
])
