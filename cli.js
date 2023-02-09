#!/usr/bin/env node
import minimist from 'minimist';
import fetch from 'node-fetch';
import moment from 'moment-timezone';

let timezone = moment.tz.guess();
let latitude = null;
let longitude = null;
let time = null;
let day = null;

// const args = minimist(process.argv.slice(2)); // ref to array and starting from the second one 

for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] == '-h') { // accounting for the fact that the first one is the path to nodejs
        console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
        -h            Show this help message and exit.
        -n, -s        Latitude: N positive; S negative.
        -e, -w        Longitude: E positive; W negative.
        -z            Time zone: uses tz.guess() from moment-timezone by default.
        -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
        -j            Echo pretty JSON from open-meteo API and exit.`); // print the help error stuff
        process.exit(0);
    }

    if (process.argv[i] == '-n') {
        if (latitude !== null) { // check if it has already been set (avoiding a situation with multiple latitudes)
            process.exit(1);
        }
        if (process.argv[i+1] != null) { // the arg after the -n should be a number -> check if actually there
            if (0 < parseInt(process.argv[i+1]) < 100) { // parses the string number into an int and checks if it is a number
                // 100 rep max (i think the lat should max out at 90)
                latitude = process.argv[i+1]; // store the number as the lat
                i++; // updating i so it skips over the number and to the next dash
                continue; // go to the next iteration in the for loop
            }
        }
    }

    if (process.argv[i] == '-s') {
        if (longitude !== null) { // check if already an -s or if lat has been set by -n
            process.exit(1);
        }
        if (process.argv[i+1] != null) { // the arg after the -n should be a number -> check if actually there
            if (-100 < parseInt(process.argv[i+1]) < 0) { // parses the string number into an int and checks if it is a negative number
                // 100 rep max (i think the lat should max out at 90)
                latitude = process.argv[i+1]; // store the number as the lat
                i++; // updating i so it skips over the number and to the next dash
                continue; // go to the next iteration in the for loop
            }

        }
    }

    if (process.argv[i] == '-e') {
        if (longitude !== null) { // check if it has already been set (avoiding a situation with multiple longitudes)
            process.exit(1);
        }
        if (process.argv[i+1] != null) { // the arg after the -n should be a number -> check if actually there
            if (0 < parseInt(process.argv[i+1]) < 100) { // parses the string number into an int and checks if it is a number
                // 100 rep max (i think the lat should max out at 90)
                longitude = process.argv[i+1]; // store the number as the lat
                i++; // updating i so it skips over the number and to the next dash
                continue; // go to the next iteration in the for loop
            }

        }
    }

    if (process.argv[i] == '-w') {
        if (longitude !== null) { // check if it has already been set (avoiding a situation with multiple longitudes)
            process.exit(1);
        }
        if (process.argv[i+1] != null) { // the arg after the -n should be a number -> check if actually there
            if (-100 < parseInt(process.argv[i+1]) < 0) { // parses the string number into an int and checks if it is a number
                // 100 rep max (i think the lat should max out at 90)
                longitude = process.argv[i+1]; // store the number as the lat
                i++; // updating i so it skips over the number and to the next dash
                continue; // go to the next iteration in the for loop
            }

        }
    }
    // should have finished iterating through the lat and longitude
    if (latitude == null || longitude == null) { // if either one of them is null, then just exit
        exit(1);
    }

    if (process.argv[i] == '-z') {
        timezone = process.argv[i];
    }

    // console.log(process.argv[i]);
}

//data collection ends


process.exit(1);