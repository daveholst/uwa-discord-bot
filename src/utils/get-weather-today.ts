import axios from 'axios';

type Weather = {
    stationName: string;
    currentTemp: number;
    forecastWords: string;
    forecastMax: number;
    forecastMin: number;
    currentHumidity: number;
    windSpeed: number;
    windDir: string;
    rainTotal: number;
    rainForecast: string;
    rainChance: number;
    rainRangeStart: string;
    rainRangeDivide: string;
    rainRangeEnd: string;
};

export async function weatherToday(
    location: string,
    wwToken: string,
): Promise<Weather | undefined> {
    try {
        /** Get the station ID - this could probably be 'cached' in the DB or memory */
        const res = await axios.get(
            `https://api.willyweather.com.au/v2/${wwToken}/search.json?query=${location}`,
        );
        const stationID = res.data[0].id;

        const [res1, res2, res3] = await Promise.all([
            axios.get(
                `https://api.willyweather.com.au/v2/${wwToken}/locations/${stationID}/weather.json?observational=true`,
            ),
            axios.get(
                `https://api.willyweather.com.au/v2/${wwToken}/weather/summaries.json?ids=${stationID}`,
            ),
            axios.get(
                `https://api.willyweather.com.au/v2/${wwToken}/locations/${stationID}/weather.json?forecasts=rainfall&days=1`,
            ),
        ]);

        const weather = {
            stationName: res1.data.location.name,
            currentTemp: res1.data.observational.observations.temperature.temperature,
            forecastWords: res2.data[0].forecasts.weather.days[0].entries[0].precis,
            forecastMax: res2.data[0].forecasts.weather.days[0].entries[0].max,
            forecastMin: res2.data[0].forecasts.weather.days[0].entries[0].min,
            currentHumidity: res1.data.observational.observations.humidity.percentage,
            windSpeed: res1.data.observational.observations.wind.speed,
            windDir: res1.data.observational.observations.wind.directionText,
            rainTotal: res1.data.observational.observations.rainfall.todayAmount,
            rainForecast: res2.data[0].forecasts.weather.days[0].entries[0].precis,
            rainChance: res3.data.forecasts.rainfall.days[0].entries[0].probability,
            rainRangeStart: res3.data.forecasts.rainfall.days[0].entries[0].startRange
                ? res3.data.forecasts.rainfall.days[0].entries[0].startRange
                : '0',
            rainRangeDivide: res3.data.forecasts.rainfall.days[0].entries[0].rangeDivide,
            rainRangeEnd: res3.data.forecasts.rainfall.days[0].entries[0].endRange,
        };

        /** Format it into a nice ASCI table*/
        return weather;
    } catch (err) {
        console.error('Error Getting Forecast - Most Likely Location / Postcode not Found', err);
    }
}
