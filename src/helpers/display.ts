import ora from 'ora';
import { customTable } from './helper.js';
import { getAttractionsByCity, getAttractionsByContinent, getAttractionsByCountry } from '../attractionsApi.js';
import chalk from "chalk";
import { input, select, confirm, rawlist } from "@inquirer/prompts";
import { CellOptionsWithHref, IAttraction } from '../interface/global.interface.js';
import { callbackify } from 'util';

const spinner = ora('Loading unicorns')
const log = console.log;
const table = customTable(["No", "Title", "Location", "Total Reviews", "Price (USD)", "Cancellation", "Overall Rating", "Image", "Reviews", "Overview", "URL"])

//locations are country, continent
export const displayLocationAttractions = async (location: string, type: string, city?: string) => {
    let count = 0, page = 1, attractions;
    while (true) {
      spinner.start()
      switch(type){
        case "continent":
            attractions = await getAttractionsByContinent(location, page)
            break;
        case "country":
            attractions = await getAttractionsByCountry(location, page)
            break
        case "city":
            attractions = await getAttractionsByCity(location, city!, page)
            break;
        default:
            attractions = await getAttractionsByCountry(location, page)
      }

      spinner.stop()

      if (attractions.message) return log(chalk.red(attractions.message))
      if (!attractions?.total) return log(chalk.red(`Sorry, We do not have any attractions on ${location}`))
      log(`Attractions found: ${chalk.bold.green(attractions?.total)}`)

      attractions.attractions.forEach(({ attraction }: { attraction: IAttraction }) => {
        const overview = `${attraction.overview}`.substring(0, 60) + "...";
        let review = ""
        count += 1;
        if (Number(attraction.total_reviews) && attraction.reviews[0].body) {

          review = `${attraction.reviews[0].body}`.substring(0, 60) + "...";
        }
        const { title, city, total_reviews, price, cancellation, overall_rating, main_image, url, country } = attraction

        const row: CellOptionsWithHref[] = [count, title, `${city},\n${country}`, total_reviews, price, cancellation, overall_rating, {content: chalk.yellow("View image"), href: main_image} , review, overview, {content: chalk.yellow("Book attraction"), href: url}]

        table.push(row)

      })

      log(table.toString())
      if (!attractions.hasMore) return log(chalk.green("No more data!"))
      const fetchMore = await confirm({message: "Do you want to fetch more attractions: "} )
      if (!fetchMore) return
      page += 1
    }
}

