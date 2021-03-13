import { countriesCollection } from "./Collections";

async function getAllCounties() {
  const countries = await countriesCollection;
  const arrOfCountries = await countries
    .find()
    .map((country) => country)
    .toArray();

  return arrOfCountries;
}

async function getCountryByName(name: string) {
  const contries = await countriesCollection;
  const country = await contries.findOne({
    localizations: { $elemMatch: { name } },
  });
  return country;
}

async function insertCountry(country: any) {
  const countris = await countriesCollection;
  const insrtedCountry = await countris.insertOne(country);
  return insrtedCountry.insertedCount;
}

async function deleteCountry(name: string) {
  const contries = await countriesCollection;
  const country = await contries.deleteOne({
    localizations: { $elemMatch: { name } },
  });
  return country.deletedCount;
}
export { getAllCounties, getCountryByName, insertCountry, deleteCountry };
