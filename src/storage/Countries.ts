import { countriesCollection } from "./Collections";

async function getAllCounties() {
  const countries = await countriesCollection;
  const arrOfCountries = await countries
    .find()
    .map((country) => country)
    .toArray();

  return arrOfCountries;
}

async function getCountryByNameOrCapital(searchStr: string) {
  const contries = await countriesCollection;
  const country = await contries.findOne({
    $or: [
      { localizations: { $elemMatch: { name: searchStr } } },
      { localizations: { $elemMatch: { capital: searchStr } } },
    ],
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
export {
  getAllCounties,
  getCountryByNameOrCapital,
  insertCountry,
  deleteCountry,
};
