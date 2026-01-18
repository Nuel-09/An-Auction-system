import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { Admin } from "../src/models/Admin";
import { SellerLead } from "../src/models/SellersLead";
import { Items } from "../src/models/Items";
import { Auction } from "../src/models/Auction";
import bcryptjs from "bcryptjs";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/fotherbys";

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("✓ Connected to MongoDB");

    // Clear existing data
    await Admin.deleteMany({});
    await SellerLead.deleteMany({});
    await Items.deleteMany({});
    await Auction.deleteMany({});
    console.log("✓ Cleared existing data");

    // ==================== ADMINS ====================
    const adminPassword = await bcryptjs.hash("Admin@123", 10);
    const admins = await Admin.insertMany([
      {
        email: "admin@fotherbys.com",
        password: adminPassword,
      },
    ]);
    console.log("✓ Created 1 admin");

    // ==================== SELLER LEADS ====================
    const sellerLeads = await SellerLead.insertMany([
      {
        name: "John Smithson",
        email: "john.smithson@antiques.com",
        phone: "+44 20 7946 0123",
        companyName: "Smithson Antiques Ltd",
        itemDetails:
          "Victorian furniture collection - chairs, tables, cabinets from 1880s-1920s",
        status: "draft",
      },
      {
        name: "Sarah Mitchell",
        email: "sarah.mitchell@estate.com",
        phone: "+44 121 554 2291",
        companyName: "Mitchell Estate Sales",
        itemDetails:
          "Fine art paintings, watercolours, oil paintings by British artists",
        status: "submitted",
      },
      {
        name: "Robert Chen",
        email: "robert.chen@collectibles.co.uk",
        phone: "+44 113 243 9868",
        companyName: "Chen Fine Collectibles",
        itemDetails:
          "Vintage watches, Rolex, Omega, Seiko - rare models from 1950s-1980s",
        status: "submitted",
      },
      {
        name: "Emma Richardson",
        email: "emma.richardson@jewelry.net",
        phone: "+44 20 7629 0874",
        companyName: "Richardson Jewelry House",
        itemDetails:
          "Gemstones and diamonds, vintage jewelry, engagement rings, tiaras",
        status: "locked",
      },
      {
        name: "David Thompson",
        email: "david.thompson@books.com",
        phone: "+44 207 439 3034",
        companyName: "Thompson Rare Books",
        itemDetails:
          "First editions, signed copies, ancient manuscripts, maps - literary collection",
        status: "draft",
      },
      {
        name: "Margaret Wong",
        email: "margaret.wong@asia.com",
        phone: "+44 203 488 7300",
        companyName: "Wong Asian Art",
        itemDetails:
          "Chinese porcelain, jade carvings, bronze sculptures, silk paintings from Ming dynasty",
        status: "submitted",
      },
      {
        name: "Christopher Lee",
        email: "christopher.lee@motors.uk",
        phone: "+44 116 255 2455",
        companyName: "Lee Classic Motors",
        itemDetails:
          "Vintage car parts, memorabilia, model cars, original factory documents",
        status: "locked",
      },
      {
        name: "Patricia Davies",
        email: "patricia.davies@textiles.co.uk",
        phone: "+44 161 832 4562",
        companyName: "Davies Textile Museum",
        itemDetails:
          "Antique tapestries, Persian rugs, quilts, embroidery, textile art pieces",
        status: "draft",
      },
    ]);
    console.log(`✓ Created ${sellerLeads.length} seller leads`);

    // ==================== ITEMS ====================
    const items = await Items.insertMany([
      // John Smithson - Victorian Furniture
      {
        title: "Victorian Mahogany Dining Table",
        description:
          "Ornate mahogany dining table with carved legs and leaf extensions. Period: 1890s. Excellent condition.",
        estimateMin: 1200,
        estimateMax: 1800,
        category: "Furniture",
        sellerLeadId: sellerLeads[0]._id,
        status: "draft",
        auctionType: "online",
        artist: "John Smithson",
        periodDate: "1890s",
        dimensions: "1.85m x 1.2m",
        condition: "Excellent, minor surface wear",
        auctionSession: "morning",
      },
      {
        title: "Set of 6 Victorian Chairs",
        description:
          "Matching set of walnut dining chairs with upholstered seats. Circa 1885. Some restoration.",
        estimateMin: 800,
        estimateMax: 1200,
        category: "Furniture",
        sellerLeadId: sellerLeads[0]._id,
        status: "draft",
        auctionType: "online",
        artist: "Unknown maker",
        periodDate: "1885",
        dimensions: "0.45m W x 0.50m D x 1.0m H (each)",
        condition: "Good, recently reupholstered",
        auctionSession: "morning",
      },
      {
        title: "Victorian Oak Cabinet",
        description:
          "Tall oak glass-fronted display cabinet with shelving. Original brass handles. Good condition.",
        estimateMin: 900,
        estimateMax: 1400,
        category: "Furniture",
        sellerLeadId: sellerLeads[0]._id,
        status: "draft",
        auctionType: "online",
        artist: "Victorian craftsman",
        periodDate: "1880s",
        dimensions: "0.9m W x 0.35m D x 1.8m H",
        condition: "Good, original finish",
        auctionSession: "morning",
      },
      // Sarah Mitchell - Fine Art
      {
        title: "Landscape Oil Painting - Lake District",
        description:
          "Large oil on canvas depicting mountains and lake. Signed by Victorian artist. Frame included.",
        estimateMin: 5000,
        estimateMax: 8000,
        category: "Art",
        sellerLeadId: sellerLeads[1]._id,
        status: "published",
        auctionType: "online",
        artist: "Charles Bellender",
        periodDate: "1905",
        dimensions: "1.2m x 0.85m (canvas), gilt frame included",
        condition: "Excellent, original gilt frame",
        auctionSession: "afternoon",
      },
      {
        title: "Collection of 12 Watercolours",
        description:
          "Portfolio of botanical watercolours by noted British artist. Unframed. Dated 1920s.",
        estimateMin: 2500,
        estimateMax: 4000,
        category: "Art",
        sellerLeadId: sellerLeads[1]._id,
        status: "published",
        auctionType: "online",
        artist: "Margaret Hartley",
        periodDate: "1920s",
        dimensions: "25cm x 35cm (each, approximately)",
        condition: "Very good, minor foxing",
        auctionSession: "afternoon",
      },
      {
        title: "Signed Portrait Oil Painting",
        description:
          "Professional portrait painting in oils, Victorian period. Fine detail. Gilt frame.",
        estimateMin: 3000,
        estimateMax: 5500,
        category: "Art",
        sellerLeadId: sellerLeads[1]._id,
        status: "published",
        auctionType: "online",
        artist: "Edmund Fisher",
        periodDate: "1895",
        dimensions: "0.75m x 0.60m, gilt frame",
        condition: "Excellent, professionally restored",
        auctionSession: "afternoon",
      },
      // Robert Chen - Watches
      {
        title: "Rolex Submariner 1960s",
        description:
          "Vintage Rolex Submariner watch, stainless steel, automatic movement. Original dial. Working order.",
        estimateMin: 8000,
        estimateMax: 12000,
        category: "Watches",
        sellerLeadId: sellerLeads[2]._id,
        status: "published",
        auctionType: "online",
        artist: "Rolex S.A.",
        periodDate: "1965",
        dimensions: "40mm case diameter",
        condition: "Fine, working order with minor patina",
        auctionSession: "evening",
      },
      {
        title: "Omega Speedmaster Professional",
        description:
          "Iconic Omega Speedmaster with chronograph. Moon watch model. Excellent condition with box.",
        estimateMin: 4000,
        estimateMax: 6500,
        category: "Watches",
        sellerLeadId: sellerLeads[2]._id,
        status: "published",
        auctionType: "online",
        artist: "Omega Watch Company",
        periodDate: "1978",
        dimensions: "42mm case diameter",
        condition: "Excellent, with original box and papers",
        auctionSession: "evening",
      },
      {
        title: "Seiko Diver Watch 1970s",
        description:
          "Vintage Seiko automatic diver watch. Gold-plated case. Original strap. Excellent working condition.",
        estimateMin: 800,
        estimateMax: 1500,
        category: "Watches",
        sellerLeadId: sellerLeads[2]._id,
        status: "published",
        auctionType: "online",
        artist: "Seiko",
        periodDate: "1975",
        dimensions: "42mm case diameter",
        condition: "Very good, working order",
        auctionSession: "evening",
      },
      // Emma Richardson - Jewelry
      {
        title: "Diamond Solitaire Ring 2 Carat",
        description:
          "18k white gold engagement ring with GIA certified 2 carat diamond. D colour, VS2 clarity.",
        estimateMin: 18000,
        estimateMax: 25000,
        category: "Jewelry",
        sellerLeadId: sellerLeads[3]._id,
        status: "published",
        auctionType: "physical",
        artist: "Bespoke jeweller",
        periodDate: "2015",
        dimensions: "Ring size M (adjustable)",
        condition: "Excellent, GIA certified",
        auctionSession: "afternoon",
      },
      {
        title: "Vintage Pearl Necklace",
        description:
          "Strand of natural pearls with 14k gold clasp. Circa 1950s. Includes valuation certificate.",
        estimateMin: 4000,
        estimateMax: 7000,
        category: "Jewelry",
        sellerLeadId: sellerLeads[3]._id,
        status: "published",
        auctionType: "online",
        artist: "Unknown maker",
        periodDate: "1950s",
        dimensions: "60cm strand length, 6-8mm pearls",
        condition: "Good, original gold clasp",
        auctionSession: "afternoon",
      },
      {
        title: "Emerald Tiara - Royal Style",
        description:
          "White gold tiara with emeralds and diamonds. Ornate Edwardian design. Museum quality.",
        estimateMin: 22000,
        estimateMax: 32000,
        category: "Jewelry",
        sellerLeadId: sellerLeads[3]._id,
        status: "published",
        auctionType: "physical",
        artist: "Edwardian jeweller",
        periodDate: "1910",
        dimensions: "24cm width, precious metal mount",
        condition: "Excellent, museum quality",
        auctionSession: "afternoon",
      },
      // David Thompson - Books
      {
        title: "First Edition Pride and Prejudice 1813",
        description:
          "Original first edition of Jane Austen classic. Full leather binding. Mint condition in display case.",
        estimateMin: 12000,
        estimateMax: 18000,
        category: "Books",
        sellerLeadId: sellerLeads[4]._id,
        status: "draft",
        auctionType: "online",
        artist: "Jane Austen",
        periodDate: "1813",
        dimensions: "19cm x 11cm, 432 pages",
        condition: "Mint condition, original binding",
        auctionSession: "morning",
      },
      {
        title: "Signed Harry Potter Book - Philosopher's Stone",
        description:
          "First edition, first printing, signed by J.K. Rowling. Original dust jacket. Excellent condition.",
        estimateMin: 3000,
        estimateMax: 5000,
        category: "Books",
        sellerLeadId: sellerLeads[4]._id,
        status: "draft",
        auctionType: "online",
        artist: "J.K. Rowling",
        periodDate: "1997",
        dimensions: "20cm x 13cm, 309 pages",
        condition: "Excellent with dust jacket",
        auctionSession: "morning",
      },
      {
        title: "Medieval Illuminated Manuscript",
        description:
          "Hand-painted medieval manuscript pages on vellum. Gold leaf decoration. 14th century. Framed.",
        estimateMin: 8000,
        estimateMax: 15000,
        category: "Books",
        sellerLeadId: sellerLeads[4]._id,
        status: "draft",
        auctionType: "online",
        artist: "Unknown medieval scribe",
        periodDate: "14th Century",
        dimensions: "22cm x 18cm (pages), framed 35cm x 30cm",
        condition: "Very good, gold leaf intact",
        auctionSession: "morning",
      },
      // Margaret Wong - Asian Art
      {
        title: "Ming Dynasty Porcelain Vase",
        description:
          "Blue and white porcelain vase, Ming period (1368-1644). Dragon motif. Museum quality. 30cm height.",
        estimateMin: 16000,
        estimateMax: 25000,
        category: "Asian Art",
        sellerLeadId: sellerLeads[5]._id,
        status: "published",
        auctionType: "physical",
        artist: "Ming Dynasty artisan",
        periodDate: "1450-1500",
        dimensions: "Height 30cm, diameter 18cm",
        condition: "Excellent, museum quality, no restoration",
        auctionSession: "evening",
      },
      {
        title: "Jade Carving - Buddha Figurine",
        description:
          "Intricately carved jade Buddha. Pale celadon jade. Qing dynasty. Exceptional craftsmanship.",
        estimateMin: 6000,
        estimateMax: 10000,
        category: "Asian Art",
        sellerLeadId: sellerLeads[5]._id,
        status: "published",
        auctionType: "online",
        artist: "Qing Dynasty carver",
        periodDate: "1700-1800",
        dimensions: "Height 12cm, width 8cm",
        condition: "Excellent, minor hairline to stone",
        auctionSession: "evening",
      },
      {
        title: "Silk Scroll Painting - Landscape",
        description:
          "Ink and watercolour on silk. Traditional Chinese landscape. Artist signature. 18th century.",
        estimateMin: 3500,
        estimateMax: 5500,
        category: "Asian Art",
        sellerLeadId: sellerLeads[5]._id,
        status: "published",
        auctionType: "online",
        artist: "Wang Wei (school)",
        periodDate: "1750",
        dimensions: "Scroll 2.1m x 0.6m",
        condition: "Very good, traditional mounting",
        auctionSession: "evening",
      },
      // Christopher Lee - Motors
      {
        title: "Jaguar E-Type Original Parts Collection",
        description:
          "Lot of vintage Jaguar E-Type spare parts. Engine components, trim, lights. Collector's lot.",
        estimateMin: 2000,
        estimateMax: 3500,
        category: "Motors",
        sellerLeadId: sellerLeads[6]._id,
        status: "published",
        auctionType: "online",
        artist: "Jaguar Cars Limited",
        periodDate: "1960s",
        dimensions: "Various components, approximately 15 items",
        condition: "Good, original specification",
        auctionSession: "afternoon",
      },
      {
        title: "Ferrari Testarossa Model - Scale 1:8",
        description:
          "Detailed die-cast model Ferrari Testarossa. Limited edition. Display box included. Mint condition.",
        estimateMin: 1200,
        estimateMax: 2000,
        category: "Motors",
        sellerLeadId: sellerLeads[6]._id,
        status: "published",
        auctionType: "online",
        artist: "Die-cast manufacturer",
        periodDate: "1990",
        dimensions: "38cm length, 16cm width, scale 1:8",
        condition: "Mint condition with original display box",
        auctionSession: "afternoon",
      },
      // Patricia Davies - Textiles
      {
        title: "Persian Tabriz Rug - 10x14ft",
        description:
          "Hand-knotted wool Persian rug. Burgundy field with geometric medallion. 20th century. Good condition.",
        estimateMin: 5000,
        estimateMax: 8000,
        category: "Textiles",
        sellerLeadId: sellerLeads[7]._id,
        status: "draft",
        auctionType: "online",
        artist: "Persian weavers",
        periodDate: "1950s",
        dimensions: "3.05m x 4.27m (10ft x 14ft)",
        condition: "Good, minor wear, no major repairs",
        auctionSession: "afternoon",
      },
      {
        title: "Antique Belgian Tapestry",
        description:
          "Large woven tapestry depicting historical scene. Wool and silk. 19th century. Original frame.",
        estimateMin: 4000,
        estimateMax: 6500,
        category: "Textiles",
        sellerLeadId: sellerLeads[7]._id,
        status: "draft",
        auctionType: "online",
        artist: "Belgian weaver",
        periodDate: "1875",
        dimensions: "2.2m x 1.8m, wood frame included",
        condition: "Very good, original mounting intact",
        auctionSession: "afternoon",
      },
      {
        title: "Handmade Quilt Collection",
        description:
          "Lot of 3 vintage quilts. Patchwork and applique designs. 1940s-1960s. Excellent condition.",
        estimateMin: 2000,
        estimateMax: 3500,
        category: "Textiles",
        sellerLeadId: sellerLeads[7]._id,
        status: "draft",
        auctionType: "online",
        artist: "Unknown quilters",
        periodDate: "1940s-1960s",
        dimensions: "Queen size, approximately 2.0m x 2.1m (each)",
        condition: "Excellent, machine and hand-stitched",
        auctionSession: "afternoon",
      },
    ]);
    console.log(`✓ Created ${items.length} items`);

    // ==================== AUCTIONS ====================
    const auctions = await Auction.insertMany([
      // Draft auction - not yet published
      {
        title: "Winter Antiques Auction 2026",
        description:
          "Collection of fine antique furniture, art, and collectibles. Includes Victorian pieces and rare items.",
        startDate: new Date("2026-02-15T10:00:00Z"),
        endDate: new Date("2026-02-20T18:00:00Z"),
        status: "draft",
        auctionType: "online",
        location: "London, UK",
      },
      // Published online auction
      {
        title: "Online Fine Art Collection",
        description:
          "Curated selection of paintings and watercolours by British artists. No reserves. Online bidding only.",
        startDate: new Date("2026-01-20T09:00:00Z"),
        endDate: new Date("2026-01-27T17:00:00Z"),
        status: "published",
        qrCode: "QR-ART-2026-001",
        auctionType: "online",
        location: "London, UK",
      },
      // Published physical auction
      {
        title: "Luxury Jewelry & Gems Auction",
        description:
          "Prestigious auction of fine diamonds, gemstones, and vintage jewelry. Physical viewing available. London venue.",
        startDate: new Date("2026-02-10T14:00:00Z"),
        endDate: new Date("2026-02-12T18:00:00Z"),
        status: "published",
        qrCode: "QR-JEWEL-2026-001",
        auctionType: "physical",
        location: "1 Savile Row, London, England",
      },
      // Closed auction
      {
        title: "Classic Watches & Timepieces",
        description:
          "Vintage and collectible watches auction. Completed sale. Results available upon request.",
        startDate: new Date("2025-12-01T10:00:00Z"),
        endDate: new Date("2025-12-08T17:00:00Z"),
        status: "closed",
        qrCode: "QR-WATCH-2025-001",
        auctionType: "online",
        location: "London, UK",
      },
      // Published physical auction for Asian art
      {
        title: "Asian Antiquities & Porcelain",
        description:
          "Important collection of Chinese porcelain, jade, and scrolls. Physical viewing by appointment. Premium items.",
        startDate: new Date("2026-03-01T11:00:00Z"),
        endDate: new Date("2026-03-05T19:00:00Z"),
        status: "published",
        qrCode: "QR-ASIA-2026-001",
        auctionType: "physical",
        location: "1 Savile Row, London, England",
      },
    ]);
    console.log(`✓ Created ${auctions.length} auctions`);

    // ==================== ASSIGN ITEMS TO AUCTIONS ====================
    // Assign art items to art auction
    await Items.updateMany(
      {
        title: {
          $in: [
            "Landscape Oil Painting - Lake District",
            "Collection of 12 Watercolours",
            "Signed Portrait Oil Painting",
          ],
        },
      },
      { auctionId: auctions[1]._id } // Online Fine Art Collection
    );

    // Assign jewelry items to jewelry auction
    await Items.updateMany(
      { category: "Jewelry", status: "published" },
      { auctionId: auctions[2]._id } // Luxury Jewelry & Gems Auction
    );

    // Assign watch items to closed auction
    await Items.updateMany(
      { category: "Watches", status: "published" },
      { auctionId: auctions[3]._id } // Classic Watches & Timepieces (closed)
    );

    // Assign Asian art items to Asian auction
    await Items.updateMany(
      { category: "Asian Art", status: "published" },
      { auctionId: auctions[4]._id } // Asian Antiquities & Porcelain
    );

    console.log("✓ Assigned items to auctions");

    // ==================== ASSIGN SEQUENTIAL LOT NUMBERS ====================
    // Assign lot numbers (1, 2, 3...) sequentially within each auction
    for (const auction of auctions) {
      const auctionItems = await Items.find({ auctionId: auction._id }).sort({
        createdAt: 1,
      });

      for (let i = 0; i < auctionItems.length; i++) {
        await Items.findByIdAndUpdate(auctionItems[i]._id, {
          lotNumber: i + 1,
        });
      }
    }

    console.log("✓ Assigned sequential lot numbers");

    // ==================== SUMMARY ====================
    console.log("\n" + "=".repeat(50));
    console.log("✓ DATABASE SEEDING COMPLETE");
    console.log("=".repeat(50));
    console.log(`\n📊 Seed Summary:\n`);
    console.log(`  Admin Accounts:     ${admins.length}`);
    console.log(`  Seller Leads:       ${sellerLeads.length}`);
    console.log(`  Items:              ${items.length}`);
    console.log(`  Auctions:           ${auctions.length}`);
    console.log(`\n💡 Test Credentials:\n`);
    console.log(`  Email:    admin@fotherbys.com`);
    console.log(`  Password: Admin@123`);
    console.log(`\n🧪 Seller Test Emails (for dashboard access):\n`);
    sellerLeads.forEach((lead) => {
      console.log(`  ${lead.email} (Status: ${lead.status})`);
    });
    console.log(`\n📍 QR Codes for Published Auctions:\n`);
    auctions
      .filter((a) => a.status === "published")
      .forEach((auction) => {
        console.log(`  ${auction.title}: ${auction.qrCode}`);
      });
    console.log(`\n🔍 Data Distribution:\n`);
    console.log(
      `  Items < £20k (Online):    ${
        items.filter((i) => (i.estimateMax || 0) < 20000).length
      }`
    );
    console.log(
      `  Items ≥ £20k (Physical):  ${
        items.filter((i) => (i.estimateMax || 0) >= 20000).length
      }`
    );
    console.log(
      `  Items in Draft Status:    ${
        items.filter((i) => i.status === "draft").length
      }`
    );
    console.log(
      `  Items in Published Status: ${
        items.filter((i) => i.status === "published").length
      }`
    );

    process.exit(0);
  } catch (error) {
    console.error("✗ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
