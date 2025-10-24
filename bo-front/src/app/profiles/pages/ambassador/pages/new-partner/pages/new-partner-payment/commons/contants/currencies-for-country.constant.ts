import { CountryType } from '../enums/countries-id.enum';

export const GetCurrenciesByCountry = (idCountry) => {
	const currencies = {
		[CountryType.PERU]: [1, 2],
		[CountryType.COLOMBIA]: [1, 3]
	};

	return currencies[idCountry] || [1];
};
