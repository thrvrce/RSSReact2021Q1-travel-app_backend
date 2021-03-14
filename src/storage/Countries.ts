import { countriesCollection } from "./Collections";
import { Country } from "../Types";

async function getAllCounties(): Promise<Country[]> {
  const countries = await countriesCollection;
  const arrOfCountries: Country[] = await countries
    .find()
    .map((country) => country)
    .toArray();

  return arrOfCountries;
}

async function getCountryByNameOrCapital(searchStr: string): Promise<Country> {
  const contries = await countriesCollection;
  const country: Country = await contries.findOne({
    $or: [
      { localizations: { $elemMatch: { name: searchStr } } },
      { localizations: { $elemMatch: { capital: searchStr } } },
    ],
  });
  return country;
}

async function insertCountry(country: Country): Promise<boolean> {
  const countries = await countriesCollection;
  const insrtedCountry = await countries.insertOne(country);
  return Boolean(insrtedCountry.insertedCount);
}

async function deleteCountry(name: string): Promise<boolean> {
  const contries = await countriesCollection;
  const country = await contries.deleteOne({
    localizations: { $elemMatch: { name } },
  });
  return Boolean(country.deletedCount);
}
export {
  getAllCounties,
  getCountryByNameOrCapital,
  insertCountry,
  deleteCountry,
};
