import { OptionalId} from "mongodb"

export type LocationModel = OptionalId<{
    zip_code: string;
    name: string;
    timezone: string;
    country: string;
    latitude: string;
    longitude: string;
}>

export type ZipCodeAPI = Array<{
    zip_code: string,
    valid: boolean;
    city: string;
    timezone: string;
    country: string;
    lat: string;
    lon: string;
}>

export type GeocodingAPI = Array<{
    name: string;
    country: string;
}>

export type WeatherAPI = {
    temp: number;
    feels_like: number;
}

export type AirQualityAPI = {
    overall_aqi: number;
}