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

## Plugin configuration

The ckeditor5 wiki has a useful page on [Plugins](https://github.com/ckeditor/ckeditor5-design/wiki/Plugins).

In my main project's [ckeditor.js](https://github.com/Tangerine-Community/Tangerine/blob/v3.x.x-tang-form-server/tangerine-forms/src/tangy-form/ckeditor.js), I've declared the plugins and configs

```
ClassicEditor.build = {
  plugins: [
  // omiting other plugins
      Acasi,
      Dumpdata,
      AcasiToolbar,
      FormToolbar
    ],
  config: {
    toolbar: {
      items: [
      // omiting other config
        'acasi',
        'dumpdata',
        'introSrcDialog'
      ]
    },
    acasi: {
      toolbar: [ 'introSrcDialog' ]
    },
    form: {
      toolbar: [ 'formDialog' ]
    },
```

Notice that there is are separate sections for the acasi and form toolbars.

There is also plugin config info in my main project's [build-config.js](https://github.com/Tangerine-Community/Tangerine/blob/v3.x.x-tang-form-server/tangerine-forms/build-config.js), which is consumed by webpack. The plugins section
lists the node_module package names of the two related plgins I'mve written for this project:

```
	// Plugins to include in the build.
	plugins: [
	// omiting other plugins
    'ckeditor5-acasi',
    'ckeditor5-dumpdata'
	],
```


## Details about the ckeditor5-acasi plugin

The main entrypoint to this plugin is acasi.js. First, we tell PluginCollection what dependencies this plugin has:

```
  static get requires() {
    return [ Widget, IntroSrcDialog, FormDialog ];
  }
```

Let ClassicEditor.build.plugins know the name of this plugin. Its name will be listed as well as the plugin path in this list.

```
  static get pluginName() {
    return 'Acasi';
  }
```

The rest of the code is in init(). First we declare some variables for editor, doc, schema, etc and then configure the schema.
First make a general declaration

```
    schema.allow( { name: '$inline', inside: '$root' } );
```

Then register each of your plugin elements and their schema. Start with the dependencies and move up the chain. In this
plugin, there are three elements:
- paper-radio-button
- tangy-acasi
- form

Here's an example of paper-radio-button:

```
    schema.registerItem( 'paper-radio-button' );
    schema.allow( { name: 'paper-radio-button', attributes: [ 'name', 'value' ], inside: 'acasi' } );
    // schema.allow( { name: 'paper-radio-button', inside: '$root' } );
    schema.allow( { name: '$inline', inside: 'paper-radio-button' } );
    schema.allow( { name: 'image', inside: 'paper-radio-button' } );
    schema.objects.add( 'paper-radio-button' );
```

After declaring the schemas, you must tell cheditor5 how to transform the model to the view element, and back again, for
each element that you declare. This is for data.modelToView:

```
    // Build converter from model element to view element is used to render the getData output for the widget when you create new Elements in the editor.
    buildModelConverter().for( data.modelToView )
      .fromElement( 'form' )
      .toElement( (element) => {
        const id = element.item.getAttribute('id')
        const onchange = element.item.getAttribute('onchange')
        let container = new ViewContainerElement( 'form', {'id': id, 'onchange': onchange} );
        return container
      })
```

Next, create a buildModelConverter for editing.modelToView in order to render this plugin to the editor:

```
    //  Build converter from model element to view element for editing view pipeline. This affects how this element is rendered in the editor.
    buildModelConverter().for( editing.modelToView )
      .fromElement( 'tangy-acasi' )
      .toElement( (element) => {
        // const imageContainer = createImageViewElement();
        console.log("tangy-acasi element")
        const figureContainer1 = new ViewContainerElement( 'figure', { class: 'paper-radio-button' });
        const figureContainer2 = new ViewContainerElement( 'figure', { class: 'paper-radio-button' });
        const figureContainer3 = new ViewContainerElement( 'figure', { class: 'paper-radio-button' });
        const figureContainer4 = new ViewContainerElement( 'figure', { class: 'paper-radio-button' });
        const widgetContainer = new ViewContainerElement( 'figure', { class: 'tangy-acasi' },
          [figureContainer1, figureContainer2, figureContainer3, figureContainer4] );
        const widget = toAcasiWidget( widgetContainer );
        widget.setAttribute( 'contenteditable', true );
        return widget;
      } );
```


Using the acasi toolbar as an example.

acasitoolbar.js -