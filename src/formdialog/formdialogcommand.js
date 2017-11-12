/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module ckeditor5-acasi/formdialog/formdialogcommand
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import { isCustomWidget } from '../utils';
import { isCustomWidgetSelected } from './../utils';


/**
 * The intro src dialog command. It is used to change the `id` attribute on `<form>` elements.
 *
 * @extends module:core/command~Command
 */
export default class FormDialogCommand extends Command {
  /**
   * The command value: `false` if there is no `id` attribute, otherwise the value of the `id` attribute.
   *
   * @readonly
   * @observable
   * @member {String|Boolean} #value
   */

  /**
   * @inheritDoc
   */
  refresh() {
    const selection = this.editor.document.selection.getSelectedElement();
    const element = this.editor.editing.view.selection;
    console.log("is it the correct form element?")

      // this.isEnabled = isCustomWidget( 'form', element );
      this.isEnabled = isCustomWidgetSelected( 'form', element );

    // if ( isCustomWidget( 'form', element ) && element.hasAttribute( 'id' ) ) {
    if ( isCustomWidgetSelected( 'form', element ) && selection.hasAttribute( 'id' ) ) {
      this.value = selection.getAttribute( 'id' );
      console.log("getting value of id.")
    } else {
      this.value = false;
    }
  }

  /**
   * Executes the command.
   *
   * @fires execute
   * @param {Object} options
   * @param {String} options.newValue The new value of the `id` attribute to set.
   * @param {module:engine/model/batch~Batch} [options.batch] A batch to collect all the change steps. A new batch will be
   * created if this option is not set.
   */
  execute( options ) {
    const doc = this.editor.document;
    const element = doc.selection.getSelectedElement();

    doc.enqueueChanges( () => {
      const batch = options.batch || doc.batch();

      batch.setAttribute( element, 'id', options.newValue );
    } );
  }
}
