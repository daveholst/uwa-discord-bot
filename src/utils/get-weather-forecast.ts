import axios from 'axios';

type DayForecast = {
    // date: string;
    Day: string;
    Description: string;
    Min: string;
    Max: string;
    Rain: string;
    Probability: string;
};

function getDayOfWeek(date: string): string | null {
    const dayOfWeek = new Date(date).getDay();
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
        dayOfWeek
    ];
}

export async function weatherForecast(
    location: string,
    wwToken: string,
): Promise<{ station: string; forecast: DayForecast[] }> {
    try {
        const res = await axios.get(
            `https://api.willyweather.com.au/v2/${wwToken}/search.json?query=${location}`,
        );
        const stationID = res.data[0].id;

        const [res1, res2] = await Promise.all([
            axios.get(
                `https://api.willyweather.com.au/v2/${wwToken}/locations/${stationID}/weather.json?forecasts=weather&days=7`,
            ),
            axios.get(
                `https://api.willyweather.com.au/v2/${wwToken}/locations/${stationID}/weather.json?forecasts=rainfall&days=7`,
            ),
        ]);

        const forecast: DayForecast[] = [];
        for (let i = 0; i < 7; i++) {
            const dayForecast = {
                // date: res1.data.forecasts.weather.days[i].entries[0].dateTime,
                Day: getDayOfWeek(res1.data.forecasts.weather.days[i].entries[0].dateTime),
                Description: res1.data.forecasts.weather.days[i].entries[0].precis,
                Max: res1.data.forecasts.weather.days[i].entries[0].max + '°C',
                Min: res1.data.forecasts.weather.days[i].entries[0].min + '°C',
                Rain: res2.data.forecasts.rainfall.days[i].entries[0].rangeCode + 'mm',
                Probability: res2.data.forecasts.rainfall.days[i].entries[0].probability + '%',
            };
            forecast.push(dayForecast);
        }

        return {
            station: res1.data.location.name,
            forecast,
        };
    } catch (err) {
        console.error('Error Getting Forecast - Most Likely Location / Postcode not Found', err);
    }
}
