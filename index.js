const { createApi } = require('unsplash-js');
const fs = require('fs');
const core = require('@actions/core');
const { exit } = require('process');
const exec = require('@actions/exec');
const github = require('@actions/github');

// Get the owner and repo from the context
const { owner, repo } = github.context.repo;

// Get the inputs from the workflow file
const UNSPLASHTOKEN = core.getInput('unsplash_token');
const GITHUBTOKEN = core.getInput('github_token');
const TEMPLATE = core.getInput('template');
const ORIENTATION = core.getInput('orientation');
const QUERY = core.getInput('query');
const CONTENTFILTER = core.getInput('content_filter');
const COLLECTIONS = core.getInput('collections');
const TOPICS = core.getInput('topics');

// Initialize Unsplash API
const unsplash = createApi({
    accessKey: UNSPLASHTOKEN,
});

let templateFile;
try {
    templateFile = fs.readFileSync(TEMPLATE, 'utf8');
} catch (err) {
    console.error(err);
    exit(1);
}

// Get random image from Unsplash
unsplash.photos.getRandom({
    collections: COLLECTIONS,
    topics: TOPICS,
    content_filter: CONTENTFILTER,
    orientation: ORIENTATION,
    query: QUERY,
})
    .then(data => {
        core.debug(data)

        // Get data from response
        const URL = data.response.urls.regular;
        const DESC = data.response.description;
        const ALTDESC = data.response.alt_description;

        // Social data
        const NAME = data.response.user.name;
        const INSTAGRAM = data.response.user.social.instagram_username 
            ? `[instagram](https://instagram.com/${data.response.user.social.instagram_username})` 
            : '';

        const PORTFOLIOURL = data.response.user.social.portfolio_url 
            ? `[portfolio](${data.response.user.social.portfolio_url})` 
            : '';

        const TWITTER = data.response.user.social.twitter_username 
            ? `[twitter](https://twitter.com/${data.response.user.social.twitter_username})` 
            : '';

        const PAYPAL = data.response.user.social.paypal_email 
            ? `[paypal](mailto:${data.response.user.social.paypal_email})` 
            : '';
        const SOCIALS = [INSTAGRAM, PORTFOLIOURL, TWITTER, PAYPAL].filter(Boolean);

        // Construct a string that looks like this: "instagram / portfolio / twitter"
        let SOCIALSSTRING = SOCIALS.reduce((finalStr, ele, index, arr)=> {
            if (index < arr.length - 1) {
                return finalStr + ele + " / ";
            } else {
                return finalStr + ele;
            }
        }, "");

        // Camera/EXIF data
        const MODEL = data.response.exif.model;
        const EXPOSURETIME = data.response.exif.exposure_time;
        const APERTURE = data.response.exif.aperture;
        const FOCALLENGTH = data.response.exif.focal_length;
        const ISO = data.response.exif.iso;

        // Location data
        const LOCATION = data.response.location.name;
        const COUNTRY = data.response.location.country;
        const LATITUDE = data.response.location.position.latitude;
        const LONGITUDE = data.response.location.position.longitude;

        // Replace variables in template
        const result = templateFile.replace(/{{ unsplash-url }}/g, URL)
            .replace(/{{ unsplash-description }}/g, DESC)
            .replace(/{{ unsplash-alt-description }}/g, ALTDESC)
            .replace(/{{ unsplash-name }}/g, NAME)
            .replace(/{{ unsplash-portfolio-url }}/g, PORTFOLIOURL)
            .replace(/{{ model }}/g, MODEL)
            .replace(/{{ exposure-time }}/g, EXPOSURETIME)
            .replace(/{{ aperture }}/g, APERTURE)
            .replace(/{{ focal-length }}/g, FOCALLENGTH)
            .replace(/{{ iso }}/g, ISO)
            .replace(/{{ location }}/g, LOCATION)
            .replace(/{{ country }}/g, COUNTRY)
            .replace(/{{ latitude }}/g, LATITUDE)
            .replace(/{{ longitude }}/g, LONGITUDE)
            .replace(/{{ socials }}/g, SOCIALSSTRING);

        // Write processed template to README.md
        try {
            fs.writeFileSync('README.md', result);
        } catch (error) {
            console.error(error);
        }
    }).then(async () => {
        // Push to GitHub
        await exec.exec('git', ['config', '--global', 'user.email', 'actions@github.com']);
        await exec.exec('git', ['config', '--global', 'user.name', 'GitHub Action']);
        await exec.exec('git', ['add', 'README.md']);
        await exec.exec('git', ['commit', '-m', 'Update README.md with unsplash image data']);
        await exec.exec('git', ['push', `https://${GITHUBTOKEN}@github.com/${owner}/${repo}.git`]);
    })
    .catch(error => console.error(error));
