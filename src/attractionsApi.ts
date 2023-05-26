import axios from 'axios'

const log = console.log

const axiosClient = axios.create({
    baseURL: "http://localhost:5000/api/v1",
    headers: {
        "Content-Type": "Application/json"
    }
})

// process.on("uncaughtException", () => log(chalk.red("Encountered an error, try again")))

export const getAttractionsNearYou = async (country: string, page: number) => {
    try {
        const attractions = await axiosClient.post("/attractions/near-you", { country, page: Number(page)}) 
        return attractions.data?.data
    } catch (e: any) {
    }
}


export const getAttractionsByCountry = async (country: string, page: number) => {
    try {
        const attractions  = await axiosClient.post("/attractions/country", {country, page: Number(page)}) 
        return attractions?.data?.data
    } catch (e: any) {
        return {message: e.response.data}
    }
}

export const getAttractionsByCity = async (country: string, city: string, page: number) => {
    try {
        const attractions  = await axiosClient.post("/attractions/city", {country, city, page: Number(page)}) 
        return attractions?.data?.data
    } catch (e: any) {
        return {message: e.response.data}
    }
}

export const getAttractionsByContinent = async (continent: string, page: number) => {
    try {
        const attractions = await axiosClient.post("/attractions/continent", {continent, page: Number(page)}) 
        return attractions?.data?.data
    } catch (e: any) {
        return {message: e.response.data}
    }
}

export const getContinentTodo = async (continent: string, page: number) => {
    try {
        const attractions = await axiosClient.post("/attractions/continent-things-to-do", {continent, page: Number(page)}) 
        return attractions?.data
    } catch (e: any) {
        return {message: e.response.data}
    }
}
export const getCountryTodo = async (country: string, page: number) => {
    try {
        const attractions = await axiosClient.post("/attractions/country-things-to-do", {country, page: Number(page)}) 
        return attractions?.data
    } catch (e: any) {
        return {message: e.response.data}
    }
}

export const getAttractionsStats = async () => {
    try {
        const stats = await axiosClient.get("/attractions/stats") 
        return stats?.data
    } catch (e: any) {
        return {message: e.response.data}
    }
}

