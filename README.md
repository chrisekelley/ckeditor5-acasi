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
plugin, there are three custom elements:
- paper-radio-button
- tangy-acasi
- form

But you must also declare some of the custom elements' dependencies. paper-radio-button has a figure child, which has an img child:

```
    schema.registerItem( 'figure' );
    schema.allow( { name: 'figure', attributes: [ 'class' ], inside: 'paper-radio-button' } );
    schema.allow( { name: 'image', attributes: [ 'src' ], inside: 'figure' } );
    schema.objects.add( 'figure' );
```

Here's an example of paper-radio-button:

```
    schema.registerItem( 'paper-radio-button' );
    // schema.allow( { name: 'paper-radio-button', attributes: [ 'name', 'value' ], inside: 'acasi' } );
    schema.allow( { name: 'paper-radio-button', attributes: [ 'name' ], inside: 'tangy-acasi' } );
    // schema.allow( { name: 'paper-radio-button', inside: '$root' } );
    schema.allow( { name: '$inline', inside: 'paper-radio-button' } );
    schema.allow( { name: 'image', inside: 'paper-radio-button' } );
    schema.objects.add( 'paper-radio-button' );
```

Continue moving up the chain. Notice how tangy-acasi allows paper-radio-button inside tangy-acasi

```
    schema.registerItem( 'tangy-acasi' );
    schema.allow( { name: 'tangy-acasi', attributes: [ 'intro-src' ], inside: 'form' } );
    // schema.allow( { name: 'tangy-acasi', inside: '$root' } );
    schema.allow( { name: '$inline', inside: 'tangy-acasi' } );
    schema.allow( { name: 'image', inside: 'tangy-acasi' } );
    schema.allow( { name: 'paper-radio-button', inside: 'tangy-acasi' } );
    schema.objects.add( 'tangy-acasi' )
```

And lastly, form:

```
    schema.registerItem( 'form' );
    schema.allow( { name: 'form', attributes: [ 'id', 'onchange' ], inside: '$root' } );
    // schema.allow( { name: 'form', inside: '$root' } );
    schema.allow( { name: '$inline', inside: 'form' } );
    schema.allow( { name: 'image', inside: 'form' } );
    schema.allow( { name: 'tangy-acasi', inside: 'form' } );
    schema.objects.add( 'form' );
```

After declaring the schemas, you must tell cheditor5 how to transform each custom element to a view element, and back again, for
each element that you declare. This is for data.modelToView and editing.modelToView:

```
    //  Build converter from model element to view element for editing view pipeline. This affects how this element is rendered in the editor.
    buildModelConverter().for( editing.modelToView, data.modelToView )
      .fromElement( 'form' )
      .toElement( (element) => {
        console.log("form element")
        const formContainer = new ViewContainerElement( 'figure', { class: 'tangy-form' } );
        const formWdiget = toFormWidget( 'form', formContainer );
        formWdiget.setAttribute( 'contenteditable', true );
        return formWdiget;
      } );

    //  Build converter from model element to view element for editing view pipeline. This affects how this element is rendered in the editor.
    buildModelConverter().for( editing.modelToView, data.modelToView )
      .fromElement( 'tangy-acasi' )
      .toElement( (element) => {
        console.log("tangy-acasi element")
        const widgetContainer = new ViewContainerElement( 'figure', { class: 'tangy-acasi' });
        const widget = toAcasiWidget( widgetContainer );
        widget.setAttribute( 'contenteditable', true );
        return widget;
      } );

    //  Build converter from model element to view element for editing view pipeline. This affects how this element is rendered in the editor.
    buildModelConverter().for( editing.modelToView, data.modelToView )
      .fromElement( 'paper-radio-button' )
      .toElement( (element) => {
        console.log("paper-radio-button element")
        const imageContainer = new ViewContainerElement( 'radio', { class: 'paper-radio-button' }, toImageWidget(new ViewEmptyElement( 'img' )) );
        const widget = toWidget( imageContainer );
        widget.setAttribute( 'contenteditable', true );
        return widget;
      } );

```

Next, create a build converter from view element to model element for data pipeline. When the editor is consuming html,
recognize your widget and put it in the model so that editing.modelToView can then render it in the editing view. You need a converter for each element:

```
    buildViewConverter().for(data.viewToModel).from({
      name: 'form',
      attribute: { id: /./ }
    }).toElement(viewImage => new ModelElement('form', { id: viewImage.getAttribute('id') }));

    buildViewConverter().for(data.viewToModel).from({
      name: 'tangy-acasi',
      attribute: { 'intro-src': /./ }
    }).toElement(viewImage => new ModelElement('tangy-acasi', { 'intro-src': viewImage.getAttribute('intro-src') }));

    buildViewConverter().for(data.viewToModel).from({
      name: 'paper-radio-button',
      attribute: { 'name': /./ }
    }).toElement(viewImage => new ModelElement('paper-radio-button', { 'name': viewImage.getAttribute('name') }));

    buildViewConverter().for(data.viewToModel).from({
      name: 'figure',
      attribute: { 'class': /./ }
    }).toElement(viewImage => new ModelElement('figure', { 'class': viewImage.getAttribute('class') }));

```

Note that figure has a converter, but img doesn't. Img is handled by the ckeditor5 plugin, which is already loaded.
