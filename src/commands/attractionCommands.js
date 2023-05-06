import { Command } from "commander";
import { input, select, confirm } from "@inquirer/prompts";
import countriesByContinent from "../data/countries.js";
import { capitalizeWords, paginateItems } from "../helpers/helper.js";
import chalk from "chalk";
import { getAttractionsByCountry } from "../attractions.js";
import ora from 'ora';
import Table from "cli-table3";


const spinner = ora('Loading unicorns')
const log = console.log;
const table = new Table({
  head: ["No", "Title", "City", "Total Reviews", "Price (USD)", "Cancellation", "Overall Rating", "Image", "Reviews", "Overview", "URL"],
  colWidths: [4, 20, 10, 10, 10, 10, 10, 15, 30, 30, 15],
  wordWrap: true,
  style: {
    head: ['green',],
  },
  chars: {
    top: '═',
    'top-mid': '╤',
    'top-left': '╔',
    'top-right': '╗',
    bottom: '═',
    'bottom-mid': '╧',
    'bottom-left': '╚',
    'bottom-right': '╝',
    left: '║',
    'left-mid': '╟',
    right: '║',
    'right-mid': '╢',
  },
})

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
        value: "activitiesFilter",
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
    const countries = [];
    Object.keys(countriesByContinent).forEach((continent) => {
      countries.push(...countriesByContinent[continent]);
    });
    let userCountry = await input({ message: "Enter your country" });
    if (!countries.includes(capitalizeWords(userCountry))) {
      log(chalk.yellow("Country does not exist"));
      countries.sort();
      const formattedCountry = countries.reduce((acc, cur) => acc.concat({ name: cur, value: cur }), []);
      userCountry = await paginateItems(formattedCountry, 10);
    }

    let count = 0;
    let page = 1;
    while (true) {
      spinner.start()
      const attractions = await getAttractionsByCountry(userCountry, page)
      spinner.stop()

      if (!attractions.total) return log(chalk.red(`Sorry, We do not have any attractions on ${userCountry}`))
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
  continentFilter: () => {
    // perform action for searching by continent
  },
  cityFilter: () => {
    // perform action for searching by city
  },
  activityFilter: () => {
    // perform action for filtering by things to do
  },
  nearFilter: () => {
    // perform action for searching near you
  },
};
