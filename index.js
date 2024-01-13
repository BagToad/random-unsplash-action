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
    content_filter: CONTENTFILTER,
    orientation: ORIENTATION,
    query: QUERY,
})
    .then(data => {
        const URL = data.response.urls.regular;
        const DESC = data.response.description;
        const ALTDESC = data.response.alt_description;
        const NAME = data.response.user.name;
        const PORTFOLIOURL = data.response.user.portfolio_url;

        // Replace variables in template
        const result = templateFile.replace(/{{ unsplash-url }}/g, URL)
            .replace(/{{ unsplash-description }}/g, DESC)
            .replace(/{{ unsplash-alt-description }}/g, ALTDESC)
            .replace(/{{ unsplash-name }}/g, NAME)
            .replace(/{{ unsplash-portfolio-url }}/g, PORTFOLIOURL);
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