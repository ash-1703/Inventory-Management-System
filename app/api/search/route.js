import { NextResponse } from "next/server";

const { MongoClient } = require("mongodb");
export async function GET(request) {
const query = request.nextUrl.searchParams.get("query")   
  const uri =
    "mongodb+srv://mongodb:4pr448nDsGuSvIZm@mongodbproj.fmpav6x.mongodb.net/";
  const client = new MongoClient(uri);

  try {
    const database = client.db("stock");
    const inventory = database.collection("inventory");

    const products = await inventory.aggregate([
        {
          $match: {
            $or: [
              { slug: { $regex: query, $options: 'i' } }, // 'i' for case-insensitive
            ]
          } 
        }
      ]).toArray()
    return NextResponse.json({success:true, products});
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

