import { rawlist, input } from "@inquirer/prompts";
import chalk from "chalk";
import countriesByContinent from '../data/countries.js'
import CliTable3 from "cli-table3";

const paginateColor = chalk.hex("#FC4F00")
const log = console.log

export const capitalizeWords = (str) => {
  let words = str?.split(" ");
  for (let i = 0; i < words.length; i++) {
    words[i] =
      words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
  }
  return words.join(" ");
};

export const paginateItems = async (items, resultsPerPage, type="country") => {
  let start = 0;
  let end = resultsPerPage;

  do {
    const choices = items.slice(start, end);
    if (start > 0) {
      choices.push({name: "Previous page", value: "Previous page"});
    }

    if (end < items.length) {
      choices.push({name: "Next page", value: "Next page"});
    }

    choices.push({name: "Exit", value: "Exit"});

    const choice = await rawlist({
      message: chalk.green(`Page ${
        Math.floor(start / resultsPerPage) + 1
      }\n Select a ${type}:`),
      choices,
    });


    switch (`${choice}`) {
      case "Previous page":
        start -= resultsPerPage;
        end -= resultsPerPage;
        break;
      case "Next page":
        start += resultsPerPage;
        end += resultsPerPage;
        break;
      default:
        if (choice !== "Exit") {
          return choice;
        }
        end = items.length + 5 
    }
  } while (start >= 0 && end <= items.length);
}



export const getUserCountry = async () => {
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
  return userCountry
}

export const getUserContinent = async () => {
  const continents = Object.keys(countriesByContinent)
  let userContinent = await input({ message: "Enter the continent: " });
  if (!continents.includes(capitalizeWords(userContinent))) {
    log(chalk.yellow("Invalid continent name"));
    continents.sort();
    const formattedContinent = continents.reduce((acc, cur) => acc.concat({ name: cur, value: cur }), []);
    userContinent = await paginateItems(formattedContinent, 10, "continent");
  }
  return userContinent
}

export const customTable = (fields, colWidths = [4, 20, 10, 10, 10, 10, 10, 15, 30, 30, 15]) => {
  return new CliTable3({
    head: fields,
    colWidths: colWidths,
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

}