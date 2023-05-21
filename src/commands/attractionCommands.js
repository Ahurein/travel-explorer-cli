import { Command } from "commander";
import { input, select, confirm, rawlist } from "@inquirer/prompts";
import {customTable, getUserContinent, getUserCountry } from "../helpers/helper.js";
import chalk from "chalk";
import { getAttractionsByCity, getAttractionsByContinent, getAttractionsByCountry, getAttractionsNearYou, getContinentTodo, getCountryTodo } from "../attractions.js";
import ora from 'ora';
import Table from "cli-table3";


const spinner = ora('Loading unicorns')
const log = console.log;
let table = customTable(["No", "Title", "City", "Total Reviews", "Price (USD)", "Cancellation", "Overall Rating", "Image", "Reviews", "Overview", "URL"])
export const attractionsCommand = new Command("attractions");

attractionsCommand.action(async () => {
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
});

const searchByFunctions = {
  countryFilter: async () => {
    const userCountry = await getUserCountry()
    let count = 0, page = 1;

    while (true) {
      spinner.start()
      const attractions = await getAttractionsByCountry(userCountry, page)
      spinner.stop()

      if (!attractions?.total) return log(chalk.red(`Sorry, We do not have any attractions on ${userCountry}`))
      log(`Attractions found: ${chalk.bold.green(attractions?.total)}`)
      attractions.attractions.forEach(({ attraction }) => {
        const overview = `${attraction.overview}`.substring(0, 60) + "...";
        let review = ""
        count += 1;
        if (Number(attraction.total_reviews) && attraction.reviews[0].body) {

          review = `${attraction.reviews[0].body}`.substring(0, 60) + "...";
        }
        const { title, city, total_reviews, price, cancellation, overall_rating, main_image, url } = attraction
        table.push([count, title, city, total_reviews, price, cancellation, overall_rating, chalk.yellow(main_image), review, overview, chalk.yellow(url)])
      })

      log(table.toString())
      if (!attractions.hasMore) return log(chalk.green("No more data!"))
      const fetchMore = await confirm({ message: "Do you want to fetch more attractions: " })
      if (!fetchMore) return
      page += 1
    }

  },
  continentFilter: async () => {
    const userContinent = await getUserContinent()
    let count = 0, page = 1;
    while (true) {
      spinner.start()
      const attractions = await getAttractionsByContinent(userContinent, page)
      spinner.stop()

      if (!attractions?.total) return log(chalk.red(`Sorry, We do not have any attractions on ${userContinent}`))
      log(`Attractions found: ${chalk.bold.green(attractions?.total)}`)
      attractions.attractions.forEach(({ attraction }) => {
        const overview = `${attraction.overview}`.substring(0, 60) + "...";
        let review = ""
        count += 1;
        if (Number(attraction.total_reviews) && attraction.reviews[0].body) {

          review = `${attraction.reviews[0].body}`.substring(0, 60) + "...";
        }
        const { title, city, total_reviews, price, cancellation, overall_rating, main_image, url } = attraction
        table.push([count, title, city, total_reviews, price, cancellation, overall_rating, chalk.yellow(main_image), review, overview, chalk.yellow(url)])
      })

      log(table.toString())
      if (!attractions.hasMore) return log(chalk.green("No more data!"))
      const fetchMore = await confirm({ message: "Do you want to fetch more attractions: " })
      if (!fetchMore) return
      page += 1
    }

  },
  cityFilter: async () => {
    const userCountry = await getUserCountry()
    const city = await input({ message: "Enter the city name: " })

    let count = 0, page = 1;
    while (true) {
      spinner.start()
      const attractions = await getAttractionsByCity(userCountry, city, page)
      spinner.stop()

      if (!attractions?.total) return log(chalk.red(`Sorry, We do not have any attractions on ${city}`))
      log(`Attractions found: ${chalk.bold.green(attractions?.total)}`)
      attractions.attractions.forEach(({ attraction }) => {
        const overview = `${attraction.overview}`.substring(0, 60) + "...";
        let review = ""
        count += 1;
        if (Number(attraction.total_reviews) && attraction.reviews[0].body) {

          review = `${attraction.reviews[0].body}`.substring(0, 60) + "...";
        }
        const { title, city, total_reviews, price, cancellation, overall_rating, main_image, url } = attraction
        table.push([count, title, city, total_reviews, price, cancellation, overall_rating, chalk.yellow(main_image), review, overview, chalk.yellow(url)])
      })

      log(table.toString())
      if (!attractions.hasMore) return log(chalk.green("No more data!"))
      const fetchMore = await confirm({ message: "Do you want to fetch more attractions: " })
      if (!fetchMore) return
      page += 1
    }
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

    let count = 0, page = 1, userCountry, userContinent, attractions = [], askUserLocation = true;
    const thingsToDoTable = filter === "country" ? customTable(["No", "Title", "City", "Things to do", "Price (USD)", "Cancellation", "Overall Rating", "Image", "Reviews", "Overview", "URL"]) : customTable(["No", "Title", "City", "Country", "Things to do", "Price (USD)", "Cancellation", "Overall Rating", "Image", "Reviews", "Overview", "URL"], [4, 20, 10, 10, 10, 10, 10, 10, 15, 20, 20, 15])

    while (true) {
      switch (filter) {
        case "country": {
          if (askUserLocation) userCountry = await getUserCountry()
          spinner.start()
          attractions = await getCountryTodo(userCountry, page);
          spinner.stop()
          break;
        }
        case "continent": {
          if(askUserLocation) userContinent = await getUserContinent()
          spinner.start()
          attractions = await getContinentTodo(userContinent, page);
          spinner.stop()
          break;
        }
      }

      if (!attractions?.total) return log(chalk.red(`Sorry, We do not have any attractions on ${filter}`))
      log(`Attractions found: ${chalk.bold.green(attractions?.total)}`)

      attractions.attractions.forEach((attractionObj) => {
        const {total, attraction} = attractionObj
        const overview = `${attraction.overview}`.substring(0, 60) + "...";
        let review = ""
        count += 1;
        if (Number(attraction.total_reviews) && attraction.reviews[0].body) {
          review = `${attraction.reviews[0].body}`.substring(0, 60) + "...";
        }
        const { title, city, price, cancellation, country, overall_rating, main_image, url } = attraction
        

        thingsToDoTable.push([count, title, city, country, total, price, cancellation, overall_rating, chalk.yellow(main_image), review, overview, chalk.yellow(url)])
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
    const thingsToDoTable = customTable(["No", "Title", "City", "Things to do", "Price (USD)", "Cancellation", "Overall Rating", "Image", "Reviews", "Overview", "URL"])

    let count = 0, page = 1;
    while (true) {
      spinner.start()
      let attractions = await getAttractionsNearYou(userCountry, page)
      attractions = attractions.length > 0 ? attractions[0] : []
      spinner.stop()

      if (!attractions?.total) return log(chalk.red(`Sorry, We do not have any attractions on ${userCountry}`))
      log(`Attractions found: ${chalk.bold.green(attractions?.total)}`)

      attractions.attractions.forEach((attractionObj) => {
        const { total, attraction } = attractionObj
        const overview = `${attraction.overview}`.substring(0, 60) + "...";
        let review = ""
        count += 1;
        if (Number(attraction.total_reviews) && attraction.reviews[0].body) {
          review = `${attraction.reviews[0].body}`.substring(0, 60) + "...";
        }
        const { title, city, price, cancellation, overall_rating, main_image, url } = attraction
        thingsToDoTable.push([count, title, city, total, price, cancellation, overall_rating, chalk.yellow(main_image), review, overview, chalk.yellow(url)])
      })
      log(thingsToDoTable.toString())

      if (!attractions.hasMore) return log(chalk.green("No more data!"))
      const fetchMore = await confirm({ message: "Do you want to fetch more attractions: " })
      if (!fetchMore) return
      page += 1
    }
  },
};
