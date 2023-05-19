import axios from 'axios'

const log = console.log

const axiosClient = axios.create({
    baseURL: "http://localhost:5000/api/v1",
    headers: {
        "Content-Type": "Application/json"
    }
})

// process.on("uncaughtException", () => log(chalk.red("Encountered an error, try again")))

export const getAttractionsNearYou = async (country, page) => {
    try {
        const attractions = await axiosClient.post("/attractions/near-you", { country, page: Number(page)}) 
        return attractions.data?.data
    } catch (error) {
        log(error.response)
    }
}


export const getAttractionsByCountry = async (country, page) => {
    try {
        const attractions  = await axiosClient.post("/attractions/country", {country, page: Number(page)}) 
        return attractions?.data?.data
    } catch (error) {
        log(error.response)
    }
}

export const getAttractionsByCity = async (country, city, page) => {
    try {
        const attractions  = await axiosClient.post("/attractions/city", {country, city, page: Number(page)}) 
        return attractions?.data?.data
    } catch (error) {
        log(error.response)
    }
}

export const getAttractionsByContinent = async (continent, page) => {
    try {
        const attractions = await axiosClient.post("/attractions/continent", {continent, page: Number(page)}) 
        return attractions?.data?.data
    } catch (error) {
        log(error.response)
    }
}

export const getContinentTodo = async (continent, page) => {
    try {
        const attractions = await axiosClient.post("/attractions/continent-things-to-do", {continent, page: Number(page)}) 
        return attractions?.data
    } catch (error) {
        log(error.response)
    }
}
export const getCountryTodo = async (country, page) => {
    try {
        const attractions = await axiosClient.post("/attractions/country-things-to-do", {country, page: Number(page)}) 
        return attractions?.data
    } catch (error) {
        log(error.response)
    }
}

