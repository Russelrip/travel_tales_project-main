import { CountryAPIResponse, CountryDTO } from "../models/country";
import axios from 'axios';

export class CountryService {
    private apiBaseUrl: string;
    private apiKey: string;

    constructor() {
        var url = process.env.COUNTRY_API_URL;
        var key = process.env.COUNTRIES_API_KEY;

        if (!url) {
            url = "http://localhost:5000/api/v1/countries";
            // throw new Error('COUNTRY_API_URL environment variable is not set');
        }
        if (!key) {
            key = "664c039d-4294-438c-94a0-3ffeb4c8e39f";
            // throw new Error('COUNTRIES_API_KEY environment variable is not set');
        }

        this.apiBaseUrl = url;
        this.apiKey = key;
    }

    // Get All Country with (Country name, flag, capital and Currency)
    async searchCountry(name: string): Promise<CountryDTO[]> {
        try {
            const response = await axios.get<CountryAPIResponse[]>(`${this.apiBaseUrl}/${encodeURIComponent(name)}`, {
                headers: {
                    'X-API-Key': this.apiKey
                }
            });

            const data = response.data;

            return data.map((country) => {
                const firstCurrency = Object.values(country.currencies)[0];
                return {
                    name: country.name,
                    currencyName: firstCurrency?.name ?? '',
                    currencySymbol: firstCurrency?.symbol ?? '',
                    capital: country.capital,
                    flag: country.flag
                };
            });

        } catch (error) {
            console.error(`Error fetching countries for name: ${name}`, error);
            throw new Error('Failed to fetch country data');
        }
    }
}
