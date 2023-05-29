# Travel Explorer

> CLI utility to easily browse attractions in every country/city

## Features

- Get attractions by city
- Get attractions by country
- Get attractions by continent
- `Flights` and `hotels` will be available in future update

## Example
![example](./images/result.png)

## Install

```sh
# Install globally (recommended).
npm install -g @ahurein/travel-explorer

# Or run directly with npx
npx install @ahurein/travel-explorer
```

## Usage

### Attraction prompt
```sh
travel-explorer attractions
```
![attraction](./images/attractions.png)

### Attraction options
- By country
```sh
travel-explorer -c Ghana
# or
travel-explorer --country Ghana
```
- By city
```sh
travel-explorer -t Accra
# or
travel-explorer --city Accra
```
- By continent
```sh
travel-explorer -n Africa
# or
travel-explorer --continent Africa
```

### Statistics
```sh
travel-explorer stats
```
![statistics](./images/stats.png)

## Contribution
To contribute ideas to the project, contact me or send a PR. All Codes are available [here](https://github.com/Ahurein/travel-explorer-cli)
- [Github](https://github.com/ahurein)
- [LinkedIn](https://www.linkedin.com/in/ebenezer-ahurein/)
