import { Command} from "commander";
import { input, select, confirm, rawlist } from "@inquirer/prompts";
import { capitalizeWords, customTable, getUserContinent, getUserCountry } from "../helpers/helper.js";
import chalk from "chalk";
import {getAttractionsNearYou, getContinentTodo, getCountryTodo } from "../attractionsApi.js";
import ora from 'ora';
import { ISearchAttractionActions, IAttraction, IAttractionObj, LocationType } from "../interface/global.interface.js";
import { displayLocationAttractions } from "../helpers/display.js";


const spinner = ora('Loading unicorns')
const log = console.log;
export const attractionsCommand = new Command("attractions");

attractionsCommand
  .description("Fetch attractions based on the user query")
  .option("-t, --city <city name>", "specify the city to search for")
  .option("-c, --country <country name>", "specify the country to search for")
  .option("-n, --continent <continent name>", "filter results by continent")
  .action(async (options) => {
    
    if (Object.keys(options).length) {
      const {country, city, continent} = options
      let userCountry: string, userContinent: string;

      if(continent){
        userContinent = await getUserContinent(continent)
        await displayLocationAttractions(userContinent, LocationType.CONTINENT)

      } else if(city && !country || city && country){
        userCountry = await getUserCountry(country)
        await displayLocationAttractions(userCountry, LocationType.CITY, city)

        
      } else if(country){
        userCountry = await getUserCountry(country)
        await displayLocationAttractions(userCountry, LocationType.COUNTRY)
      }

      

    } else {
      const searchBy = await select({
        message: "Select what you want to search by:",
        choices: [
          {
            name: "country",
            value: "countryFilter",
            // description: "Search attractions by country",
          },
          {
            name: "continent",
            value: "continentFilter",
            // description: "Search attractions by continent",
          },
          {
            name: "city",
            value: "cityFilter",
            // description: "Search attractions by city",
          },
          {
            name: "Things to do",
            value: "activityFilter",
            // description: "Filter by things to do",
          },
          {
            name: "Near you",
            value: "nearFilter",
            // description: "Search attractions near you",
          },
        ],
      });

      searchByFunctions[searchBy]();
    }

  });



const searchByFunctions: ISearchAttractionActions = {
  countryFilter: async () => {
    const userCountry = await getUserCountry()
    await displayLocationAttractions(userCountry, LocationType.COUNTRY)
  },
  continentFilter: async () => {
    const userContinent = await getUserContinent()
    await displayLocationAttractions(userContinent, LocationType.CONTINENT)
  },
  cityFilter: async () => {
    const userCountry = await getUserCountry()
    const city = await input({ message: "Enter the city name: " })
    await displayLocationAttractions(userCountry, LocationType.CITY, city)
  },
  activityFilter: async () => {
    // perform action for filtering by things to do
    const choices = [
      { name: 'country', value: "country" },
      { name: 'continent', value: "continent" }
    ]
    const filter = await rawlist({
      message: "Filter activities by: ",
      choices
    })

    let count = 0, page = 1, userCountry="", filterBy = "", userContinent="", attractions = [], askUserLocation = true;
    const thingsToDoTable = customTable(["No", "Title", "Location", "Things to do", "Price (USD)", "Cancellation", "Overall Rating", "Image", "Reviews", "Overview", "URL"], [4, 20, 10, 8, 8, 10, 9, 15, 20, 20, 20])

    while (true) {
      switch (filter) {
        case "country": {
          if (askUserLocation) userCountry = await getUserCountry()
          spinner.start()
          attractions = await getCountryTodo(userCountry!, page);
          spinner.stop()
          if (attractions.message) return log(chalk.red(attractions.message))
          break;
        }
        case "continent": {
          if (askUserLocation) userContinent = await getUserContinent()
          spinner.start()
          attractions = await getContinentTodo(userContinent!, page);
          spinner.stop()
          if (attractions.message) return log(chalk.red(attractions.message))
          break;
        }
      }

      if (!attractions?.total) return log(chalk.red(`Sorry, We do not have any attractions on ${filter}`))
      if(filter === "country"){
        log(`Things to do grouped by cities in ${capitalizeWords(userCountry)}: ${chalk.bold.green(attractions?.total)}`)
      }else{
        log(`Things to do grouped by countries in ${capitalizeWords(userCountry)}: ${chalk.bold.green(attractions?.total)}`)
      }

      attractions.attractions.forEach((attractionObj: IAttractionObj) => {
        const { total, attraction } = attractionObj
        const overview = `${attraction.overview}`.substring(0, 60) + "...";
        let review = ""
        count += 1;
        if (Number(attraction.total_reviews) && attraction.reviews[0].body) {
          review = `${attraction.reviews[0].body}`.substring(0, 60) + "...";
        }
        const { title, city, price, cancellation, country, overall_rating, main_image, url } = attraction


        thingsToDoTable.push([count, title, `${city},\n${country}`, total, price, cancellation, overall_rating, {content: chalk.yellow("View image"), href: main_image} , review, overview, {content: chalk.yellow("Book attraction"), href: url}])
      })
      log(thingsToDoTable.toString())

      if (!attractions.hasMore) return log(chalk.green("No more data!"))
      const fetchMore = await confirm({ message: "Do you want to fetch more attractions: " })
      if (!fetchMore) return
      page += 1
      askUserLocation = false
    }
  },
  nearFilter: async () => {
    // perform action for searching near you
    const userCountry = await getUserCountry()
    const thingsToDoTable = customTable(["No", "Title", "Location", "Things to do", "Price (USD)", "Cancellation", "Overall Rating", "Image", "Reviews", "Overview", "URL"])

    let count = 0, page = 1;
    while (true) {
      spinner.start()
      let attractions = await getAttractionsNearYou(userCountry, page)
      attractions = attractions.length > 0 ? attractions[0] : []
      spinner.stop()

      if (attractions.message) return log(chalk.red(attractions.message))
      if (!attractions?.total) return log(chalk.red(`Sorry, We do not have any attractions on ${userCountry}`))
      log(`Attractions found: ${chalk.bold.green(attractions?.total)}`)

      attractions.attractions.forEach((attractionObj: IAttractionObj) => {
        const { total, attraction } = attractionObj
        const overview = `${attraction.overview}`.substring(0, 60) + "...";
        let review = ""
        count += 1;
        if (Number(attraction.total_reviews) && attraction.reviews[0].body) {
          review = `${attraction.reviews[0].body}`.substring(0, 60) + "...";
        }
        const { title, city, price, cancellation, country, overall_rating, main_image, url } = attraction

        thingsToDoTable.push([count, title, `${city},\n${country}`, total, price, cancellation, overall_rating, {content: chalk.yellow("View image"), href: main_image} , review, overview, {content: chalk.yellow("Book attraction"), href: url}])
      })
      log(thingsToDoTable.toString())

      if (!attractions.hasMore) return log(chalk.green("No more data!"))
      const fetchMore = await confirm({ message: "Do you want to fetch more attractions: " })
      if (!fetchMore) return
      page += 1
    }
  },
};
