import { Command } from "commander";
import { getAttractionsStats } from "../attractionsApi.js";
import ora from 'ora';
import { customTable } from "../helpers/helper.js";

const spinner = ora('Loading unicorns')
const log = console.log

export const statisticsCommand = new Command("stats")

statisticsCommand
.description("List statistics of all attractions")
.action(async ()=>{
    spinner.start()
    const stats = await getAttractionsStats();
    spinner.stop()

    const statsTable = customTable(["No", "Continent", "Number of attractions"], [4, 20, 30])
    let count = 1
    stats.forEach((stat: {continent: string, total: number}) => {
        const {continent, total} = stat
        statsTable.push([count, continent, total])
        count += 1
    })

    log(statsTable.toString())
})