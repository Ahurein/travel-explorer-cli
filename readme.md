# Deprecated Notice
<div style="background-color: #ff8fab; color: black; padding: 10px; border-radius: 5px;">
⚠️ **Deprecation Notice**: This npm package has been deprecated and is no longer actively maintained or recommended for use. 
</div>
-

# Travel Explorer

> CLI utility to easily browse attractions in every country/city

<span style="color:red;">Recommended terminal: CMD</span>

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

yarn global add @ahurein/travel-explorer
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
travel-explorer attractions -c Ghana
# or
travel-explorer attractions --country Ghana
```
- By city
```sh
travel-explorer attractions -t Accra
# or
travel-explorer attractions --city Accra
```
- By continent
```sh
travel-explorer attractions -n Africa
# or
travel-explorer attractions --continent Africa
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
