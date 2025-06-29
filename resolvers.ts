import { Collection, ObjectId } from "mongodb";
import { LocationModel } from "./types.ts";
import { getAirQuality, getCityData, getWeatherData, getZipCodeData } from "./utils.ts";
import { GraphQLError } from "graphql";

type Context = {
    LocationCollection: Collection<LocationModel>
}

type AddLocationMutationArgs = {
    zip_code: string;
}

export const resolvers = {
    Location: {
        id: (parent: LocationModel) => parent._id!.toString(),
        name: async (parent: LocationModel) => {
            const {latitude, longitude} = parent
            const data = await getCityData(latitude, longitude)
            return data[0].name;
        },
        country: async (parent: LocationModel) => {
            const {latitude, longitude} = parent
            const data = await getCityData(latitude, longitude)
            return data[0].country;
        },
        timezone: async (parent: LocationModel) => {
            const {zip_code} = parent;
            const data = await getZipCodeData(zip_code
            )
            return data[0].timezone
        },
        overall_aqi: async (paretn: LocationModel) => {
            const {latitude, longitude} = paretn
            return await getAirQuality(latitude, longitude)
        },
        temp: async (parent: LocationModel) => {
            const {latitude, longitude} = parent
            const data = await getWeatherData(latitude, longitude)
            return data[0].temp
        },
        feels_like: async (parent: LocationModel) => {
            const {latitude, longitude} = parent
            const data = await getWeatherData(latitude, longitude)
            return data[0].feels_like
        }
    },
    Query: {
        getLocation: async(_: unknown, {name}: {name: string}, ctx: Context): Promise<LocationModel | null> => {
            return await ctx.LocationCollection.findOne({name})
        },
        getLocations: async(_: unknown, {country}: {country: string}, ctx: Context): Promise<LocationModel[]> => {
            return await ctx.LocationCollection.find({country}).toArray()
        }
    },
    Mutation: {
        addLocation: async(_: unknown, args: AddLocationMutationArgs, ctx: Context): Promise<LocationModel> => {
            const {zip_code} = args;

            const locationExists = await ctx.LocationCollection.findOne({zip_code})
            if (locationExists) throw new GraphQLError ("Location already exists");

            const zipData = await getZipCodeData(zip_code)
            if (!zipData[0].valid) throw new GraphQLError("Invalid zip code");

            const countryName = await getCityData(zipData[0].lat, zipData[0].lon)
            if (zipData[0].country !== countryName[0].country) throw new GraphQLError("Invalid country");
            
            const {name, country} = countryName[0]
            if (!name || !country) throw new GraphQLError("Invalid city or country data");

            const { insertedId } = await ctx.LocationCollection.insertOne({
                zip_code,
                name,
                country,
                timezone: zipData[0].timezone,
                latitude: zipData[0].lat,
                longitude: zipData[0].lon
            })

            return {
                _id: insertedId,
                zip_code,
                name,
                country,
                timezone: zipData[0].timezone,
                latitude: zipData[0].lat,
                longitude: zipData[0].lon
            }
        },
        deleteLocation: async(_: unknown, {id}: {id: string}, ctx: Context): Promise<boolean> => {
            const result = await ctx.LocationCollection.deleteOne({_id: new ObjectId(id)})
            return result.deletedCount === 1;
        }
    }
}