/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module ckeditor5-acasi/formdialog/formdialogcommand
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import { isCustomWidget } from '../utils';

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
    const element = this.editor.document.selection.getSelectedElement();

    this.isEnabled = isCustomWidget( 'form', element );

    if ( isCustomWidget( 'form', element ) && element.hasAttribute( 'id' ) ) {
      this.value = element.getAttribute( 'id' );
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
