export interface Country {
    id: number;
    countryName: string;
    flagUrl: string;
    currency: string;
    capital: string;
}

export interface CountryDTO {
    name: string;
    currencyName: string;
    currencySymbol: string;
    capital: string;
    flag: string;
}

export interface CountryAPIResponse {
    capital: string;
    currencies: {
        [code: string]: {
            name: string;
            symbol: string;
        };
    };
    flag: string;
    languages: {
        [code: string]: string;
    };
    name: string;
    official_name: string;
}