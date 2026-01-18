import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

async function checkLotNumbers() {
  try {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri!);
    console.log("✓ Connected to MongoDB\n");

    const db = mongoose.connection.db;
    const itemsCollection = db!.collection("items");

    // Find items with auctionId
    const itemsWithAuction = await itemsCollection
      .find({ auctionId: { $exists: true } })
      .toArray();

    console.log("📋 Items with auctionId - Lot Number Status:");
    console.log("─".repeat(70));

    itemsWithAuction.forEach((item: any) => {
      const hasLotNum = item.lotNumber ? "✅" : "❌";
      console.log(`${hasLotNum} ${item.title}`);
      console.log(`   Lot Number: ${item.lotNumber || "NOT SET"}`);
      console.log(`   Lot Ref: ${item.lotRefNumber}`);
      console.log();
    });

    // Count lot numbers
    const withLotNum = await itemsCollection.countDocuments({
      auctionId: { $exists: true },
      lotNumber: { $exists: true, $ne: null },
    });
    const withoutLotNum = await itemsCollection.countDocuments({
      auctionId: { $exists: true },
      $or: [{ lotNumber: { $exists: false } }, { lotNumber: null }],
    });

    console.log("📊 Summary:");
    console.log("─".repeat(70));
    console.log(`Items WITH lot numbers:    ${withLotNum}`);
    console.log(`Items WITHOUT lot numbers: ${withoutLotNum}`);
    console.log(`Total assigned items:      ${itemsWithAuction.length}`);

    if (withoutLotNum > 0) {
      console.log("\n⚠️  LOT NUMBERS ARE NOT BEING ASSIGNED!");
      console.log(
        "This needs to be fixed - lot numbers are critical for auctions."
      );
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkLotNumbers();
