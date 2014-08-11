# Configuration
Everything, that can be configured, must be here. You can use js-modules, but JSON files are preferrable.

## Categories
Each category of settings is stored in its own file. Settings should not cross.
* `browser` - front-end specific
* `server` - back-end specific
* `services` - different third-party APIs

## Overrides
Sometimes you need to override some settings for either development nuances or some production purposes. You can do that by adding overriden setting(s) to `server.overrides.json` and/or `browser.overrides.json` file.

**You _must not_ commit any changes to these files.** To do that:
```
git update-index --assume-unchanged server/config/server.overrides.json
git update-index --assume-unchanged server/config/browser.overrides.json
```

## Argument overrides
Server configuration can be also overriden by passed arguments. Common pattern is:
```
node server --some.nested.settings.foo=bar
```
_Note, for `boolean` false use `0`. Otherwise all passed text is treated like `string`._
