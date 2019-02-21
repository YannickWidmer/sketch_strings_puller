
# puller

This Plugin pulls string values from a github repository in json form. To use it one needs a sketch file with textfields and text overrides to be overwritten named with a starting $ and a JSON file in a github repository with read access to it. When starting the plugin for the first time, the user is asked to give the github credentials, which are then stored in the plugin settings, and the coordinates to one or multiple json files in github. From then on it will simply pull the strings from the designed files without asking again, the files and github credentials can be changed using the settings command of the plugin.

The JSON files format should be like in the following example:

```
{
  'en':{
    "first_name": "content to be pulled for first_name"
    "second_name": "content to be pulled for second_name"
  }
  'fr':{
    "first_name": "contenu qui va remplacer le contenue de tout layer dans sketch aiant le nom $first_name"
    "second_name": "contenu qui va remplacer le contenue de tout layer dans sketch aiant le nom $second_name"
  }
}
```

Then any Text Layer in the sketch file with name $first_name will be replaced with the content of the chosen language (the language is chosen at each run).

To override symbol instances, the override in the Symbol needs to have a name starting with $ and the symbol instance needs a name starting with $. The string key that the plugin will look for will be the symbol instance name underscore the override name, where for both names the $ is removed. In the case we were to use the file above a symbol instance $first of a symbol with override $name would get its $name override populated with "content to be pulled for first_name".

_This plugin was created using `skpm`. For a detailed explanation on how things work, checkout the [skpm Readme](https://github.com/skpm/skpm/blob/master/README.md)._

# Secure Token Storage

To store the user token securely I use git-secret. More information can be found here https://git-secret.io/.

# TODO

- Make sure all Layers are taken into account.
- Improve the missing strings window
- Add programatic generation of API token