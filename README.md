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
        uses: bagtoad/random-unsplash-action@v1
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

----
<div align="center">

## Photo of the day
  
  <a href="{{ unsplash-page-url }}"><img width="720" src="{{ unsplash-raw-url }}" alt="{{ unsplash-alt-description }}"></a>
  
  <em>{{ unsplash-alt-description }}</em>
  
  <em>{{ unsplash-description }}</em>

  Photo by [{{ unsplash-name }}]({{ unsplash-portfolio-url }}) on [unsplash.com](https://unsplash.com/) • {{ socials }}
  
  Taken at {{ location }} • {{ google-maps }}
  
  ---
  
<details>
<summary>Photography Details</summary>
  
| Parameter     | Value |
| ------------- | ----- |
| Camera Model  | {{ model }} |
| Exposure Time | {{ exposure-time }} |
| Aperture      | {{ aperture }} |
| Focal Length  | {{ focal-length }} |
| ISO           | {{ iso }} |
| Location      | {{ location }} ({{ country }}) |
| Coordinates   | Latitude {{ latitude }}, Longitude {{ longitude }} |

</details>

</div>

----

☝️ A random image is retrieved and posted to my profile daily via the [BagToad/random-unsplash-action](https://github.com/BagToad/random-unsplash-action) action!

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
| collections     | collections to search within                        | false    | -             |
| topics          | topics to search for                                | false    | -             |

More information can be found in [the Unsplash API docs](https://unsplash.com/documentation#get-a-random-photo)

# Template Placeholders

| Placeholder             | Description                                       |
| ----------------------- | ------------------------------------------------- |
| `{{ unsplash-raw-url }}`      | The raw file URL of the image from Unsplash                |
| `{{ unsplash-page-url }}`     | A link to the photo on unsplash.com |
| `{{ unsplash-alt-description }}` | The alt description of the image from Unsplash |
| `{{ unsplash-description }}` | The description of the image from Unsplash      |
| `{{ unsplash-name }}`     | The name of the image author from Unsplash        |
| `{{ unsplash-portfolio-url }}` | The portfolio URL of the image author from Unsplash |
| `{{ model }}` | The camera model used to take the photo |
| `{{ exposure-time }}` | The exposure time of the photo |
| `{{ aperture }}` | The aperture of the photo |
| `{{ focal-length }}` | The focal length of the photo |
| `{{ iso }}` | The ISO of the photo |
| `{{ location }}` | The location where the photo was taken |
| `{{ country }}` | The country where the photo was taken |
| `{{ latitude }}` | The latitude of the location where the photo was taken |
| `{{ longitude }}` | The longitude of the location where the photo was taken |
| `{{ socials }}` | A markdown linked string of the creator's socials: "instagram / portfolio / twitter"


# Legal

This action and the code contained is for educational purposes only.
