import { rawlist, input } from "@inquirer/prompts";
import chalk from "chalk";
import countriesObject from '../data/countries.js'
import CliTable3 from "cli-table3";
import { CellOptionsWithHref, IAllCountries } from "../interface/global.interface.js";

const paginateColor = chalk.hex("#FC4F00")
const log = console.log
const countriesByContinent: IAllCountries = countriesObject

export const capitalizeWords = (str: string) => {
  let words = str?.split(" ");
  for (let i = 0; i < words.length; i++) {
    words[i] =
      words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
  }
  return words.join(" ");
};

export const paginateItems = async (items: Array<any>, resultsPerPage: number, type = "country"): Promise<string> => {
  let start = 0;
  let end = resultsPerPage;

  do {
    const choices = items.slice(start, end);
    if (start > 0) {
      choices.push({ name: "Previous page", value: "Previous page" });
    }

    if (end < items.length) {
      choices.push({ name: "Next page", value: "Next page" });
    }

    choices.push({ name: "Exit", value: "Exit" });

    const choice = await rawlist({
      message: chalk.green(`Page ${Math.floor(start / resultsPerPage) + 1
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

  return "Ghana"
}



export const getUserCountry = async (country?: string): Promise<string> => {
  const countries: Array<string> = [];
  Object.keys(countriesByContinent).forEach((continent) => {
    countries.push(...countriesByContinent[continent]);
  });

  if (country && countries.includes(capitalizeWords(country))) return country
  let userCountry = await input({ message: "Enter your country" });

  if (!countries.includes(capitalizeWords(userCountry))) {
    log(chalk.yellow("Country does not exist"));
    countries.sort();
    const formattedCountry = countries.reduce((acc: any, cur) => acc.concat({ name: cur, value: cur }), []);
    userCountry = await paginateItems(formattedCountry, 10);
  }
  return userCountry
}

export const getUserContinent = async (continent?: string): Promise<string> => {
  const continents = Object.keys(countriesByContinent)
  if (continent && continents.includes(capitalizeWords(continent))) return continent
  let userContinent = await input({ message: "Enter the continent: " });

  if (!continents.includes(capitalizeWords(userContinent))) {
    log(chalk.yellow("Invalid continent name"));
    continents.sort();
    const formattedContinent = continents.reduce((acc: any, cur) => acc.concat({ name: cur, value: cur }), []);
    userContinent = await paginateItems(formattedContinent, 10, "continent")!;
  }
  return userContinent
}

export const customTable = (fields: any, colWidthsPercentage = [4, 13, 7, 8, 7, 6, 6, 10, 11, 11, 10]) => {
  const terminalWidth = process.stdout.columns;
  const colWidths = colWidthsPercentage.map(percentage => Math.floor(terminalWidth * (percentage / 100)));

  return new CliTable3({
    head: fields,
    wordWrap: true,
    colWidths: colWidths,
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