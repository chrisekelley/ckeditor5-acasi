/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global console, window, document */


import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/picker.svg';
import buildModelConverter from '@ckeditor/ckeditor5-engine/src/conversion/buildmodelconverter';
import buildViewConverter from '@ckeditor/ckeditor5-engine/src/conversion/buildviewconverter';
import ModelElement from '@ckeditor/ckeditor5-engine/src/model/element';
import ViewContainerElement from '@ckeditor/ckeditor5-engine/src/view/containerelement';
import ViewEmptyElement from '@ckeditor/ckeditor5-engine/src/view/emptyelement';
import {toImageWidget} from '@ckeditor/ckeditor5-image/src/image/utils';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import {toWidget} from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

export default class Acasi extends Plugin {
  static get requires() {
    return [ Widget ];
  }

  init() {
    const editor = this.editor;
    const doc = editor.document;
    const schema = doc.schema;
    const data = editor.data;
    const editing = editor.editing;
    const t = editor.t;

    // Configure schema.
    schema.allow( { name: '$inline', inside: '$root' } );

    schema.registerItem( 'paper-radio-button' );
    schema.allow( { name: 'paper-radio-button', attributes: [ 'name', 'value' ], inside: 'acasi' } );
    // schema.allow( { name: 'paper-radio-button', inside: '$root' } );
    schema.allow( { name: '$inline', inside: 'paper-radio-button' } );
    schema.allow( { name: 'image', inside: 'paper-radio-button' } );
    schema.objects.add( 'paper-radio-button' );

    schema.registerItem( 'acasi' );
    schema.allow( { name: 'acasi', attributes: [ 'intro-src' ], inside: '$root' } );
    // schema.allow( { name: 'acasi', inside: '$root' } );
    schema.allow( { name: '$inline', inside: 'acasi' } );
    schema.allow( { name: 'image', inside: 'acasi' } );
    schema.allow( { name: 'paper-radio-button', inside: 'acasi' } );
    schema.objects.add( 'acasi' );

    // Build converter from model element to view element is used to render the getData output for the widget when you create new Elements in the editor.
    buildModelConverter().for( data.modelToView )
      .fromElement( 'acasi' )
      // .toElement( 'acasi');
      .toElement( (element) => {
        const introSrc = element.item.getAttribute('intro-src')
        // return new ViewContainerElement( 'acasi', { class: 'acasi' }, [new ViewEmptyElement( 'img' ), new ViewEmptyElement( 'img' ), new ViewEmptyElement( 'img' ), new ViewEmptyElement( 'img' )] );
        let container = new ViewContainerElement( 'acasi', {'intro-src': introSrc} );
        return container
      })
    buildModelConverter().for( data.modelToView )
      .fromElement( 'paper-radio-button' )
      .toElement( (element) => {
        const name = element.item.getAttribute('name')
        const value = element.item.getAttribute('value')
        // return new ViewContainerElement( 'acasi', { class: 'acasi' }, [new ViewEmptyElement( 'img' ), new ViewEmptyElement( 'img' ), new ViewEmptyElement( 'img' ), new ViewEmptyElement( 'img' )] );
        let container = new ViewContainerElement( 'paper-radio-button', {'name': name, 'value': value} );
        return container
      })

    //  Build converter from model element to view element for editing view pipeline. This affects how this element is rendered in the editor.
    buildModelConverter().for( editing.modelToView )
      .fromElement( 'acasi' )
      .toElement( (element) => {
        // const imageContainer = createImageViewElement();
        console.log("acasi element")
        const figureContainer1 = new ViewContainerElement( 'figure', { class: 'acasi' });
        const figureContainer2 = new ViewContainerElement( 'figure', { class: 'acasi' });
        const figureContainer3 = new ViewContainerElement( 'figure', { class: 'acasi' });
        const figureContainer4 = new ViewContainerElement( 'figure', { class: 'acasi' });
        const widgetContainer = new ViewContainerElement( 'figure', { contenteditable: 'true' },
          [figureContainer1, figureContainer2, figureContainer3, figureContainer4] );
        const widget = toWidget( widgetContainer );
        widget.setAttribute( 'contenteditable', true );
        return widget;
      } );


    //  Build converter from model element to view element for editing view pipeline. This affects how this element is rendered in the editor.
    // It is not necessary to render this element.
    // todo: nest this inside acasi.
    buildModelConverter().for( editing.modelToView )
      .fromElement( 'paper-radio-button' )
      .toElement( (element) => {
        console.log("paper-radio-button element")
        const imageContainer = new ViewContainerElement( 'radio', { class: 'paper-radio-button' }, toImageWidget(new ViewEmptyElement( 'img' )) );
        const widget = toWidget( imageContainer );
        widget.setAttribute( 'contenteditable', true );
        return widget;
      } );

    // Build converter from view element to model element for data pipeline. When the editor is consuming html,
    // recognize your widget and put it in the model so that editing.modelToView can then render it in the editing view
    buildViewConverter().for( data.viewToModel )
      .fromElement( 'acasi' )
      .toElement( () => {
        const imageUrl = 'assets/babycat.jpg';
        const imageElement = new ModelElement( 'image', {
          src: imageUrl
        });
        new ModelElement( 'acasi' ), {'intro-src':'assets/sounds/1.mp3'}, [imageElement]
      });

    // // Build converter for view img element to model image element.
    // buildViewConverter().for( data.viewToModel )
    //   .from( { name: 'acasi', attribute: { 'intro-src': /./ } } )
    //   .toElement( (viewImage) =>  {
    //     console.log("getting intro-src")
    //     new ModelElement( 'image', { 'intro-src': viewImage.getAttribute( 'intro-src' ) } )
    //   } );

    // createImageAttributeConverter( [ editing.modelToView, data.modelToView ], 'src' );


    // Add acasi button to feature components.
    editor.ui.componentFactory.add( 'acasi', locale => {
      const view = new ButtonView(locale);
      view.set({
        label: 'Acasi',
        icon: imageIcon,
        tooltip: true
      });
      // view.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

      // Execute command.
      view.on( 'execute', () => {
      // this.listenTo( view, 'execute', () => {
        let url = prompt( 'Sound URL' );
        if (url == "") {
          url = '../src/assets/1.mp3'
        }

        let urlArray = url.split('/')
        let filename = urlArray.slice(-1)[0]
        let name = 't_' + filename;

        editor.document.enqueueChanges( () => {
          const imageElement1 = new ModelElement( 'image', { src: 'assets/images/never.png'});
          const imageElement2 = new ModelElement( 'image', { src: 'assets/images/once.png'});
          const imageElement3 = new ModelElement( 'image', { src: 'assets/images/few.png'});
          const imageElement4 = new ModelElement( 'image', { src: 'assets/images/many.png'});

          const prb1 = new ModelElement( 'paper-radio-button', {'name':name, 'value': 'never'}, [imageElement1])
          const prb2 = new ModelElement( 'paper-radio-button', {'name':name, 'value': 'once'}, [imageElement2])
          const prb3 = new ModelElement( 'paper-radio-button', {'name':name, 'value': 'few'}, [imageElement3])
          const prb4 = new ModelElement( 'paper-radio-button', {'name':name, 'value': 'many'}, [imageElement4])

          // // const widgetElement = new ModelElement('figure', { class: 'fancy-widget' },imageElement)
          // editor.data.insertContent( imageElement, editor.document.selection );
          const acasi = new ModelElement( 'acasi', {'intro-src':url}, [prb1, prb2, prb3, prb4])
          // const acasi = new ModelElement( 'acasi', { src: imageUrl });
          editor.data.insertContent( acasi, editor.document.selection );
        } );
      });
      return view;
    });
  }

}
