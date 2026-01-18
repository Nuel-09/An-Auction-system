import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

async function testData() {
  try {
    const uri = process.env.MONGO_URI;
    console.log(`Connecting to: ${uri}`);
    await mongoose.connect(uri!);
    console.log("✓ Connected to MongoDB");

    const db = mongoose.connection.db;
    const itemsCollection = db!.collection("items");

    // Get first item
    const item = await itemsCollection.findOne();

    console.log("\n📦 Sample Item Data:");
    console.log("─".repeat(50));
    console.log(`Title: ${(item as any).title}`);
    console.log(`Category: ${(item as any).category}`);
    console.log(`Artist: ${(item as any).artist}`);
    console.log(`Period: ${(item as any).periodDate}`);
    console.log(`Dimensions: ${(item as any).dimensions}`);
    console.log(`Condition: ${(item as any).condition}`);
    console.log(`Auction Session: ${(item as any).auctionSession}`);
    console.log(`Lot Reference: ${(item as any).lotRefNumber}`);
    console.log(
      `Estimate: £${(item as any).estimateMin} - £${(item as any).estimateMax}`
    );

    // Count items
    const itemCount = await itemsCollection.countDocuments();
    console.log(`\n📊 Total Items in DB: ${itemCount}`);

    // Check auction location
    const auctionsCollection = db!.collection("auctions");
    const auction = await auctionsCollection.findOne();
    console.log("\n🏛️ Sample Auction Data:");
    console.log("─".repeat(50));
    console.log(`Title: ${(auction as any).title}`);
    console.log(`Location: ${(auction as any).location}`);
    console.log(`QR Code: ${(auction as any).qrCode}`);

    await mongoose.disconnect();
    console.log("\n✓ Test complete");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

testData();
