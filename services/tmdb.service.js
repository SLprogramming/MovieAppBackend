import axios from "axios";


export const fetchFromTMDB = async (url) => {
	const options = {
		headers: {
			accept: "application/json",
			Authorization: "Bearer " + "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmN2UwNzI3MzQwZjgxMjdlMTVmOWQ1ZDNmZWIzMmRjYyIsIm5iZiI6MTczNjMyNjUzMy44NjgsInN1YiI6IjY3N2UzZDg1MzRhNGU3NWU0OTdiMDQ3MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6XeF78bIQkPp9wLFn6UbjbKsEz0Di4OUljZm_1hoOIY",
		},
	};

	const response = await axios.get(url, options);

	if (response.status !== 200) {
		throw new Error("Failed to fetch data from TMDB" + response.statusText);
	}

	return response.data;
};