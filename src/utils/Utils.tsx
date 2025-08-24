import { Country, ICountry, IState, State } from "country-state-city";

export const getCountries = ():ICountry[] => {
    return Country.getAllCountries();
}

export const getStates = (countryCode: string):IState[] => {
    return State.getStatesOfCountry(countryCode);
}