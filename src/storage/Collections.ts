import { MongoClient } from "mongodb";

const URL: string = `mongodb+srv://thrvrce:${process.env.mongoDBPassword}@cluster0.yudfe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const DBNAME: string = "travel-app";
const USERS = "Users";
const SESSIONS = "Sessions";
const COUNTRIES = "Countries";
const PLACES = "Places";
const REVIEWS = "Reviews";

async function getMongoInstance() {
  const client = await MongoClient.connect(URL, { useUnifiedTopology: true });
  return client.db(DBNAME);
}

async function getCollection(collectionName: string) {
  const db = await getMongoInstance();
  return db.collection(collectionName);
}

const usersCollection = getCollection(USERS);
const sessionsCollection = getCollection(SESSIONS);
const countriesCollection = getCollection(COUNTRIES);
const placesCollection = getCollection(PLACES);
const reviewsCollection = getCollection(REVIEWS);

export {
  usersCollection,
  sessionsCollection,
  countriesCollection,
  placesCollection,
  reviewsCollection,
};
