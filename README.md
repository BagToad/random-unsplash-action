# Random Unsplash Photo Action

Get a random photo from Unsplash and display it in your README!

# Example Usage

This action requires an Unsplash API access key. [Create a developer account](https://unsplash.com/documentation#creating-a-developer-account) to get an access key. 

Register the access key as an [Actions secret ](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository), and pass it to the action with the `unsplash_token` input.

## Workflow
```yaml
name: Update README.md with random unsplash image

# Controls when the workflow will run
on:
  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:
  # Run the workflow once a day at 6. PLEASE USE THIS ACTION RESPONSIBLY AND DO NOT ABUSE THE UNSPLASH API
  schedule:
    - cron: '0 6 * * *'

# Required to write the README.md
permissions:
  contents: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # Checks-out your repository
      - uses: actions/checkout@v3
      
      # Use the unsplash 
      - name:  Update README.md with random Unsplash image
        uses: bagtoad/random-unsplash-action
        with:
            unsplash_token: ${{ secrets.UNSPLASH_TOKEN }} # Required
            github_token: ${{ secrets.GITHUB_TOKEN }} # Required
            template: ./template.md # Required
            query: "cats, magic, space" # Optional
```

## Template File

**Don't forget to provide attribution to the creator!!**

```markdown
### 👋 Welcome to my GitHub Profile!

<img width="720" src="{{ unsplash-url }}" alt="{{ unsplash-alt-description }}">

<em>{{ unsplash-alt-description }}</em>

<em>{{ unsplash-description }}</em>

Photo by [{{ unsplash-name }}]({{ unsplash-portfolio-url }})

```

# Action Inputs

| Input Name      | Description                                         | Required | Default Value |
| --------------- | --------------------------------------------------- | -------- | ------------- |
| unsplash_token  | token to auth to unsplash                           | true     | -             |
| github_token    | token to auth to github                             | true     | -             |
| template        | template file to use                                | true     | -             |
| orientation     | orientation of image (Valid values: landscape, portrait, squarish) | false    | 'landscape'   |
| query           | query to search for                                 | false    | -             |
| content_filter  | content filter (Valid values are low and high)      | false    | 'high'        |

More information can be found in [the Unsplash API docs](https://unsplash.com/documentation#get-a-random-photo)

# Template Placeholders

| Placeholder             | Description                                       |
| ----------------------- | ------------------------------------------------- |
| `{{ unsplash-url }}`      | The URL of the image from Unsplash                |
| `{{ unsplash-alt-description }}` | The alt description of the image from Unsplash |
| `{{ unsplash-description }}` | The description of the image from Unsplash      |
| `{{ unsplash-name }}`     | The name of the image author from Unsplash        |
| `{{ unsplash-portfolio-url }}` | The portfolio URL of the image author from Unsplash |


# Legal

This action and the code contained is for educational purposes only.
