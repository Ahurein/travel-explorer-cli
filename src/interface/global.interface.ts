import { CellOptions, Cell } from "cli-table3";

export interface IAllCountries {
    [key: string]: Array<string>
}

export interface ISearchAttractionActions {
    [key: string]: Function,
    countryFilter:() => void,
    continentFilter:() => void,
    cityFilter:() => void,
    activityFilter:() => void,
    nearFilter:() => void,
    
}

export interface IAttractionObj {
    _id: string,
    continent: string,
    country: string,
    total?: number,
    attraction: any
}

interface IAttractionReview {
    title: string,
    sub_title: string,
    body: string
}

export interface IAttraction {
    title: string,
    url: string,
    city: string,
    country: string,
    author: string,
    data: string,
    total_reviews: string,
    price: string,
    cancellation: boolean,
    main_image: string,
    images: Array<string>,
    reviews: Array<IAttractionReview>,
    overall_rating: string,
    overview: string
}

export const enum LocationType {
    CONTINENT = "continent",
    COUNTRY = "country",
    CITY = "city"
}



export type CellOptionsWithHref = CellOptions & {href?: string} | Cell