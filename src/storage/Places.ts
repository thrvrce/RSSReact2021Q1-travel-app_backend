import { placesCollection } from "./Collections";
import { Place } from "../Types";

async function getAllPlacess(): Promise<Place[] | null> {
  const places = await placesCollection;
  const arrOfCountries = await places
    .find()
    .map((place) => place)
    .toArray();
  return arrOfCountries;
}

async function getPlaceByName(searchStr: string): Promise<Place> {
  const places = await placesCollection;
  const place = await places.findOne({
    localizations: { $elemMatch: { name: searchStr } },
  });
  return place;
}

async function insertPlace(place: Place): Promise<boolean> {
  const places = await placesCollection;
  const { insertedCount } = await places.insertOne(place);
  return Boolean(insertedCount);
}

export { getAllPlacess, getPlaceByName, insertPlace };
