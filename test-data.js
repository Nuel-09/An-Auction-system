const mongoose = require("mongoose");
require("dotenv").config();

async function testData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✓ Connected to MongoDB");

    const db = mongoose.connection.db;
    const itemsCollection = db.collection("items");

    // Get first item
    const item = await itemsCollection.findOne();

    console.log("\n📦 Sample Item Data:");
    console.log("─".repeat(50));
    console.log(`Title: ${item.title}`);
    console.log(`Category: ${item.category}`);
    console.log(`Artist: ${item.artist}`);
    console.log(`Period: ${item.periodDate}`);
    console.log(`Dimensions: ${item.dimensions}`);
    console.log(`Condition: ${item.condition}`);
    console.log(`Auction Session: ${item.auctionSession}`);
    console.log(`Lot Reference: ${item.lotRefNumber}`);
    console.log(`Estimate: £${item.estimateMin} - £${item.estimateMax}`);

    // Count items
    const itemCount = await itemsCollection.countDocuments();
    console.log(`\n📊 Total Items in DB: ${itemCount}`);

    // Check auction location
    const auctionsCollection = db.collection("auctions");
    const auction = await auctionsCollection.findOne();
    console.log("\n🏛️ Sample Auction Data:");
    console.log("─".repeat(50));
    console.log(`Title: ${auction.title}`);
    console.log(`Location: ${auction.location}`);
    console.log(`QR Code: ${auction.qrCode}`);

    await mongoose.disconnect();
    console.log("\n✓ Test complete");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

testData();
