import { NextResponse } from "next/server";

const { MongoClient } = require("mongodb");
export async function GET(request) {
  
  

// Replace the uri string with your connection string.
const uri = "mongodb+srv://mongodb:4pr448nDsGuSvIZm@mongodbproj.fmpav6x.mongodb.net/";

const client = new MongoClient(uri);

  try {
    const database = client.db('sample_mflix');
    const movies = database.collection('movies');

    // Query for a movie that has the title 'Back to the Future'
    const query = { title: 'Back to the Future' };
    const movie = await movies.find(query).toArray();

    console.log(movie);
    return NextResponse.json({"a":34,movie})
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }

}