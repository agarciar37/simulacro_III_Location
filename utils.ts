import { AirQualityAPI, GeocodingAPI, WeatherAPI, ZipCodeAPI } from "./types.ts";

export const getAirQuality = async(
    lat: string,
    lon: string
): Promise<number> => {
    const API_KEY = Deno.env.get("API_KEy")
    if (!API_KEY) throw new Error("API_EY not found");

    const url = `https://api.api-ninjas.com/v1/airquality?lat=${lat}&lon=${lon}`
    const response = await fetch(url, {
        headers: {
            "X-Api-Key": API_KEY
        }
    })
    if (!response.ok) throw new Error("Error fetching data");

    const data: AirQualityAPI = await response.json()
    return data.overall_aqi;
}

export const getWeatherData = async(
    lat: string,
    lon: string
): Promise<Array<{temp: number, feels_like: number}>> => {
    const API_KEY = Deno.env.get("API_KEy")
    if (!API_KEY) throw new Error("API_EY not found");

    const url = `https://api.api-ninjas.com/v1/weather?lat=${lat}&lon=${lon}`
    const response = await fetch(url, {
        headers: {
            "X-Api-Key": API_KEY
        }
    })
    if (!response.ok) throw new Error("Error fetching data");
    const data: WeatherAPI = await response.json()
    return [{
        temp: data.temp,
        feels_like: data.feels_like
    }];
}

export const getCityData = async(
    lat: string,
    lon: string
): Promise<GeocodingAPI> => {
    const API_KEY = Deno.env.get("API_KEy")
    if (!API_KEY) throw new Error("API_EY not found");

    const url = `https://api.api-ninjas.com/v1/reversegeocoding?lat=${lat}&lon=${lon}`
    const response = await fetch(url, {
        headers: {
            "X-Api-Key": API_KEY
        }
    })
    if (!response.ok) throw new Error("Error fetching data");

    return await response.json()
}

export const getZipCodeData = async(
    zip: string
): Promise<ZipCodeAPI> => {
    const API_KEY = Deno.env.get("API_KEy")
    if (!API_KEY) throw new Error("API_EY not found");

    const url = `https://api.api-ninjas.com/v1/zipcode?zip=${zip}`
    const response = await fetch(url, {
        headers: {
            "X-Api-Key": API_KEY
        }
    })
    if (!response.ok) throw new Error("Error fetching data");

    return await response.json()
}