import { rawlist } from "@inquirer/prompts";
import chalk from "chalk";

const paginateColor = chalk.hex("#FC4F00")

export const capitalizeWords = (str) => {
  let words = str?.split(" ");
  for (let i = 0; i < words.length; i++) {
    words[i] =
      words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
  }
  return words.join(" ");
};

export const paginateItems = async (items, resultsPerPage) => {
  let start = 0;
  let end = resultsPerPage;

  do {
    const choices = items.slice(start, end);
    console.log(choices.length)

    if (start > 0) {
      choices.push({name: "Previous page", value: chalk.red("Previous page")});
    }

    if (end < items.length) {
      choices.push({name: "Next page", value: paginateColor("Next page")});
    }

    choices.push({name: "Exit", value: paginateColor("Exit")});

    const choice = await rawlist({
      message: chalk.green(`Page ${
        Math.floor(start / resultsPerPage) + 1
      }\n Select a country:`),
      choices,
    });

    switch (choice) {
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