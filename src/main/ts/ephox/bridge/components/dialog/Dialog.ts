import { FieldPresence, FieldSchema, ValueSchema } from '@ephox/boulder';
import { Fun, Id, Option, Result } from '@ephox/katamari';

import { InternalPanel, PanelApi, panelFields } from './Panel';
import { InternalTabPanel, TabPanelApi, tabPanelFields } from './TabPanel';

export interface DialogButtonApi {
  type: 'submit' | 'cancel' | 'custom';
  name?: string;
  text: string;
  align?: 'start' | 'end';
  primary?: boolean;
  disabled?: boolean;
}

export type DialogDataItem = any;
export type DialogData = Record<string, DialogDataItem>;

export interface DialogInstanceApi<T extends DialogData> {
  getData: () => T;
  setData: (data: Partial<T>) => void;
  disable: (name: string) => void;
  focus: (name: string) => void;
  showTab: (title: string) => void;
  redial: (nu: DialogApi<T>) => void;
  enable: (name: string) => void;
  block: (msg: string) => void;
  unblock: () => void;
  close: () => void;
}

export interface DialogActionDetails {
  name: string;
  value?: any;
}

export interface DialogChangeDetails<T> {
  name: keyof T;
}

export type DialogActionHandler<T> = (api: DialogInstanceApi<T>, details: DialogActionDetails) => void;
export type DialogChangeHandler<T> = (api: DialogInstanceApi<T>, details: DialogChangeDetails<T>) => void;
export type DialogSubmitHandler<T> = (api: DialogInstanceApi<T>) => void;
export type DialogCloseHandler = () => void;
export type DialogCancelHandler<T> = (api: DialogInstanceApi<T>) => void;
export type DialogTabChangeHandler<T> = (api: DialogInstanceApi<T>, title: string) => void;

export type DialogSize = 'normal' | 'medium' | 'large';
export interface DialogApi<T extends DialogData> {
  title: string;
  size?: DialogSize;
  body: TabPanelApi | PanelApi;
  buttons: DialogButtonApi[];
  initialData?: T;

  // Gets fired when a component within the dialog has an action used by some components
  onAction?: DialogActionHandler<T>;

  // Gets fired when a value is changed while the dialog is open
  onChange?: DialogChangeHandler<T>;

  // Gets fired when the dialog form has valid data and submit/enter is pressed
  onSubmit?: DialogSubmitHandler<T>;

  // Gets fired when the dialog is closed for any reason
  onClose?: DialogCloseHandler;

  // Gets fired when the dialog is manually closed using Esc key or cancel/X button
  onCancel?: DialogCancelHandler<T>;

  // Gets fired the dialog changes tab
  onTabChange?: DialogTabChangeHandler<T>;

  // Allows a dialog to lazily load resources and resolve when ready. The intention is to show a spinner
  // or loading indicator while resources are loading.
  // TODO: Investigate body (optionally) being a Promise, as the client code is quite ulgy with this method.
  readyWhen?: Promise<void>;
}

export interface DialogButton {
  type: 'submit' | 'cancel' | 'custom';
  name: string;
  text: string;
  align: 'start' | 'end';
  primary: boolean;
  disabled: boolean;
}

export interface Dialog<T> {
  title: string;
  size: DialogSize;
  body: InternalTabPanel | InternalPanel;
  buttons: DialogButton[];
  initialData: T;
  onAction: DialogActionHandler<T>;
  onChange: DialogChangeHandler<T>;
  onSubmit: DialogSubmitHandler<T>;
  onClose: DialogCloseHandler;
  onCancel: DialogCancelHandler<T>;
  onTabChange: DialogTabChangeHandler<T>;
  readyWhen: Option<Promise<void>>;
}

export const dialogButtonSchema = ValueSchema.objOf([
  FieldSchema.strictString('type'),
  FieldSchema.field(
    'name',
    'name',
    FieldPresence.defaultedThunk(() => {
      return Id.generate('button-name');
    }),
    ValueSchema.string
  ),
  FieldSchema.strictString('text'),
  FieldSchema.defaultedString('align', 'end'),
  FieldSchema.defaultedBoolean('primary', false),
  FieldSchema.defaultedBoolean('disabled', false)
]);

export const dialogSchema = ValueSchema.objOf([
  FieldSchema.strictString('title'),
  FieldSchema.strictOf('body', ValueSchema.choose('type', {
    panel: panelFields,
    tabpanel: tabPanelFields
  })),
  FieldSchema.defaultedString('size', 'normal'),
  FieldSchema.strictArrayOf('buttons', dialogButtonSchema),
  FieldSchema.defaulted('initialData', {}),
  FieldSchema.defaultedFunction('onAction', Fun.noop),
  FieldSchema.defaultedFunction('onChange', Fun.noop),
  FieldSchema.defaultedFunction('onSubmit', Fun.noop),
  FieldSchema.defaultedFunction('onClose', Fun.noop),
  FieldSchema.defaultedFunction('onCancel', Fun.noop),
  FieldSchema.defaulted('onTabChange', Fun.noop),
  FieldSchema.option('readyWhen')
]);

export const createDialog = <T>(spec: DialogApi<T>): Result<Dialog<T>, ValueSchema.SchemaError<any>> => {
  return ValueSchema.asRaw('dialog', dialogSchema, spec);
};
