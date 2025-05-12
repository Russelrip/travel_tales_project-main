import { NextFunction, Request, Response } from "express";
import { CountryService } from "../services/country-service";
import { CountryDTO } from "../models/country";

const countryService: CountryService = new CountryService();

export const getCountriesByName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name } = req.params;

        if (!name) {
            res.status(400).json({ message: 'Country name is required' });
            return;
        }

        const countries: CountryDTO[] = await countryService.searchCountry(name);

        res.status(200).json({
            success: true,
            data: countries
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to fetch countries' });
    }
};