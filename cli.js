#!/usr/bin/env node
import minimist from 'minimist';
import fetch from 'node-fetch';
import moment from 'moment-timezone';

let timezone = moment.tz.guess();
let latitude = null;
let longitude = null;
let time = null;

const args = minimist(process.argv.slice(2)); // ref to array and starting from the second one 

if (args.h) {
	console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE");
	console.log("	-h		Show this help message and exit.");
	console.log("	-n, -s		Latitude: N positive; S negative.");
	console.log("	-e, -w		Longitude: E positive; W negative.");
	console.log("	-z		Time zone: uses tz.guess() from moment-timezone by default.");
	console.log("	-d 0-6		Day to retrieve weather: 0 is today; defaults to 1.");
	console.log("	-j		Echo pretty JSON from open-meteo API and exit.");
	process.exit(0);
}

if (args.z) {
	timezone = args.z
}

if (args.n) {
	latitude = args.n
} else if (args.s) {
	latitude = -args.s
}

if (args.e) {
	longitude = args.e
} else if (args.w) {
	longitude = -args.w
}

// for (let i = 2; i < process.argv.length; i++) {
//     if (process.argv[i] == '-h') { // accounting for the fact that the first one is the path to nodejs
//         console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
//         -h            Show this help message and exit.
//         -n, -s        Latitude: N positive; S negative.
//         -e, -w        Longitude: E positive; W negative.
//         -z            Time zone: uses tz.guess() from moment-timezone by default.
//         -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
//         -j            Echo pretty JSON from open-meteo API and exit.`); // print the help error stuff
//         process.exit(0);
//     }

//     if (process.argv[i] == '-n') {
//         if (latitude !== null) { // check if it has already been set (avoiding a situation with multiple latitudes)
//             process.exit(1);
//         }
//         if (process.argv[i+1] != null) { // the arg after the -n should be a number -> check if actually there
//             if (0 < parseInt(process.argv[i+1]) < 100) { // parses the string number into an int and checks if it is a number
//                 // 100 rep max (i think the lat should max out at 90)
//                 latitude = process.argv[i+1]; // store the number as the lat
//                 i++; // updating i so it skips over the number and to the next dash
//                 continue; // go to the next iteration in the for loop
//             }
//         }
//     }

//     if (process.argv[i] == '-s') {
//         if (longitude !== null) { // check if already an -s or if lat has been set by -n
//             process.exit(1);
//         }
//         if (process.argv[i+1] != null) { // the arg after the -n should be a number -> check if actually there
//             if (-100 < parseInt(process.argv[i+1]) < 0) { // parses the string number into an int and checks if it is a negative number
//                 // 100 rep max (i think the lat should max out at 90)
//                 latitude = process.argv[i+1]; // store the number as the lat
//                 i++; // updating i so it skips over the number and to the next dash
//                 continue; // go to the next iteration in the for loop
//             }

//         }
//     }

//     if (process.argv[i] == '-e') {
//         if (longitude !== null) { // check if it has already been set (avoiding a situation with multiple longitudes)
//             process.exit(1);
//         }
//         if (process.argv[i+1] != null) { // the arg after the -n should be a number -> check if actually there
//             if (0 < parseInt(process.argv[i+1]) < 100) { // parses the string number into an int and checks if it is a number
//                 // 100 rep max (i think the lat should max out at 90)
//                 longitude = process.argv[i+1]; // store the number as the lat
//                 i++; // updating i so it skips over the number and to the next dash
//                 continue; // go to the next iteration in the for loop
//             }

//         }
//     }

//     if (process.argv[i] == '-w') {
//         if (longitude !== null) { // check if it has already been set (avoiding a situation with multiple longitudes)
//             process.exit(1);
//         }
//         if (process.argv[i+1] != null) { // the arg after the -n should be a number -> check if actually there
//             if (-100 < parseInt(process.argv[i+1]) < 0) { // parses the string number into an int and checks if it is a number
//                 // 100 rep max (i think the lat should max out at 90)
//                 longitude = process.argv[i+1]; // store the number as the lat
//                 i++; // updating i so it skips over the number and to the next dash
//                 continue; // go to the next iteration in the for loop
//             }

//         }
//     }
//     // should have finished iterating through the lat and longitude
//     if (latitude == null || longitude == null) { // if either one of them is null, then just exit
//         exit(1);
//     }

//     if (process.argv[i] == '-z') {
//         timezone = process.argv[i];
//     }

//     // console.log(process.argv[i]);
// }

//data collection ends

const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=precipitation_hours&current_weather=true&temperature_unit=fahrenheit&timezone=' + timezone) // url from the website
const data = await response.json();

if (args.j) {
	console.log(data);
	if (!latitude) {
		console.log("Latitude must be in range");
	}
	process.exit(0);
}

const days = args.d;

if (days == 0) { // aka today
	console.log("today.");
	if (data.daily.precipitation_hours[0] > 0) {
		console.log("You might need your galoshes");
	} else {
		console.log("You will not need your galoshes");
	}
} else if (days > 1) { // day between 2-6
	console.log("in " + days + " days.");
	if (data.daily.precipitation_hours[days] > 0) {
		console.log("You might need your galoshes");
	} else {
		console.log("You will not need your galoshes");
	}
} else { // day is not defined, assume tomorrow
	console.log("tomorrow.");
	if (data.daily.precipitation_hours[1] > 0) {
		console.log("You might need your galoshes");
	} else {
		console.log("You will not need your galoshes");
	}
}


process.exit(1);