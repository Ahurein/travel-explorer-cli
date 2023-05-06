import axios from 'axios'

const log = console.log

const axiosClient = axios.create({
    baseURL: "http://localhost:5000/api/v1",
    headers: {
        "Content-Type": "Application/json"
    }
})

// process.on("uncaughtException", () => log(chalk.red("Encountered an error, try again")))

export const getAttractionsNearYou = async (continent, page) => {
    try {
        const attractions  = await axiosClient.post("/attractions/continent", {continent, page: Number(page)}) 
        log(attractions?.data?.data)
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

