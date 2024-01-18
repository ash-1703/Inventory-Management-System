import { NextResponse } from "next/server";

const { MongoClient } = require("mongodb");
export async function GET(request) {

    
  const uri =
    "mongodb+srv://mongodb:4pr448nDsGuSvIZm@mongodbproj.fmpav6x.mongodb.net/";
  const client = new MongoClient(uri);

  try {
    const database = client.db("stock");
    const inventory = database.collection("inventory");
    const query = {};
    const products = await inventory.find(query).toArray();
    return NextResponse.json({success:true, products });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

export async function POST(request) {
  
  let body = await request.json();
  const uri =
    "mongodb+srv://mongodb:4pr448nDsGuSvIZm@mongodbproj.fmpav6x.mongodb.net/";
  const client = new MongoClient(uri);
  try {
    const database = client.db("stock");
    const inventory = database.collection("inventory");
    const product = await inventory.insertOne(body);
    return NextResponse.json({ product, ok: true });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
