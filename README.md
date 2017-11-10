# ckeditor5-acasi

This is a plugin for ckeditor5. It creates a web component that renders 4 images to the screen and provides a toolbar component named 'acasi'.

The plugin name is 'Acasi'.

If you wish to use the toolbar, add 'AcasiToolbar' to your config and the following:

```
acasi: {
      toolbar: [ 'introSrcDialog' ]
    }
```


## Development

Do not use `npm link` when developing a plugin for ckeditor5. The command `npm link` and webpack do not work well together.
Instead, use [wml](https://github.com/wix/wml) to copy changed files.

```
brew update
brew install watchman
```

wml add  ~/source/Tangerine-Community/ckeditor5-acasi ~/source/Tangerine-Community/Tangerine-3.x.x/Tangerine/tangerine-forms/node_modules/ckeditor5-acasi
wml start