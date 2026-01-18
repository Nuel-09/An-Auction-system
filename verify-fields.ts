import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

async function verifyData() {
  try {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri!);
    console.log("✓ Connected to MongoDB\n");

    const db = mongoose.connection.db;
    const itemsCollection = db!.collection("items");
    const auctionsCollection = db!.collection("auctions");

    // Find one published item with auctionId
    const itemWithAuction = await itemsCollection.findOne({
      auctionId: { $exists: true },
    });

    if (!itemWithAuction) {
      console.log("❌ NO ITEMS ASSIGNED TO AUCTIONS!");
    } else {
      console.log("📦 Item WITH auctionId assigned:");
      console.log("─".repeat(60));
      console.log(`Title:      ${(itemWithAuction as any).title}`);
      console.log(`AuctionId:  ${(itemWithAuction as any).auctionId}`);
      console.log(`Artist:     ${(itemWithAuction as any).artist}`);
      console.log(`Period:     ${(itemWithAuction as any).periodDate}`);
      console.log(`Dimensions: ${(itemWithAuction as any).dimensions}`);
      console.log(`Condition:  ${(itemWithAuction as any).condition}`);
      console.log(`Session:    ${(itemWithAuction as any).auctionSession}`);
      console.log(`Status:     ${(itemWithAuction as any).status}`);
      console.log(`Category:   ${(itemWithAuction as any).category}`);

      // Find the associated auction
      const auction = await auctionsCollection.findOne({
        _id: new mongoose.Types.ObjectId((itemWithAuction as any).auctionId),
      });

      if (auction) {
        console.log("\n🏛️ Associated Auction:");
        console.log("─".repeat(60));
        console.log(`Title:     ${(auction as any).title}`);
        console.log(`QRCode:    ${(auction as any).qrCode}`);
        console.log(`Location:  ${(auction as any).location}`);
        console.log(`Status:    ${(auction as any).status}`);
      }
    }

    // Count items with/without auctionId
    const itemsWithAuction = await itemsCollection.countDocuments({
      auctionId: { $exists: true },
    });
    const itemsWithoutAuction = await itemsCollection.countDocuments({
      auctionId: { $exists: false },
    });
    const totalItems = await itemsCollection.countDocuments();

    console.log("\n📊 Item Assignment Status:");
    console.log("─".repeat(60));
    console.log(`Items assigned to auction: ${itemsWithAuction}`);
    console.log(`Items NOT assigned:        ${itemsWithoutAuction}`);
    console.log(`Total items:               ${totalItems}`);

    // Show all art auction items
    const artAuction = await auctionsCollection.findOne({
      qrCode: "QR-ART-2026-001",
    });
    if (artAuction) {
      const artItems = await itemsCollection
        .find({ auctionId: artAuction._id.toString() })
        .toArray();

      console.log(`\n🎨 Items in Art Auction (QR-ART-2026-001):`);
      console.log("─".repeat(60));
      console.log(`Count: ${artItems.length}`);
      artItems.forEach((item: any, i: number) => {
        console.log(`\n${i + 1}. ${item.title}`);
        console.log(`   Artist: ${item.artist}`);
        console.log(`   Period: ${item.periodDate}`);
        console.log(
          `   Has all new fields: ${
            item.artist &&
            item.periodDate &&
            item.dimensions &&
            item.condition &&
            item.auctionSession
              ? "✅ YES"
              : "❌ NO"
          }`
        );
      });
    }

    await mongoose.disconnect();
    console.log("\n✓ Verification complete");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

verifyData();
