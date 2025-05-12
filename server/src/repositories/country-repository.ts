import { Country } from "../models/country";
import { prisma } from "../prisma";
import { BaseRepository } from "./base-repository";

export class CountryRepository extends BaseRepository<Country, "id"> {
    constructor() {
        super(prisma)
    }
}