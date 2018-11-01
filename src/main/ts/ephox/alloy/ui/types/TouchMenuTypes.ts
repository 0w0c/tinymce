import { Future, Option, Result } from '@ephox/katamari';
import { ItemSpec, ItemDataTuple } from '../../ui/types/ItemTypes';
import { TabviewSpec } from '../../ui/types/TabviewTypes';
import { PartialMenuSpec } from '../../ui/types/TieredMenuTypes';

import { AlloyBehaviourRecord } from '../../api/behaviour/Behaviour';
import { AlloyComponent } from '../../api/component/ComponentApi';
import { SketchBehaviours } from '../../api/component/SketchBehaviours';
import { AlloySpec, RawDomSchema, SimpleOrSketchSpec } from '../../api/component/SpecTypes';
import { CompositeSketch, CompositeSketchDetail, CompositeSketchSpec } from '../../api/ui/Sketcher';
import { AnchorSpec } from '../../positioning/mode/Anchoring';
import { CommonDropdownDetail } from '../../ui/types/DropdownTypes';
import { TransitionProperties } from '../../behaviour/transitioning/TransitioningTypes';

export interface TouchMenuDetail extends CommonDropdownDetail<ItemSpec[]>, CompositeSketchDetail {
  uid: string;
  dom: RawDomSchema;
  components: AlloySpec[ ];
  touchmenuBehaviours: SketchBehaviours;

  onHoverOn: (comp: AlloyComponent) => void;
  onHoverOff: (comp: AlloyComponent) => void;
  toggleClass: string;

  onExecute: (sandbox: AlloyComponent, menu: AlloyComponent, item: AlloyComponent, value: ItemDataTuple) => void;
  onTap: (comp: AlloyComponent) => void;

  menuTransition: TransitionProperties['transition'];

  onOpen: (anchor: AnchorSpec, comp: AlloyComponent, menu: AlloyComponent) => void;
  onClosed: (sandbox: AlloyComponent, inline: AlloyComponent) => void;
  eventOrder: Record<string, string[]>;
  role: Option<string>;

  getAnchor: (comp: AlloyComponent) => AnchorSpec;
  lazySink: Option<(comp: AlloyComponent) => Result<AlloyComponent, Error>>;

  fetch: (comp: AlloyComponent) => Future<ItemSpec[]>;
}

export interface TouchMenuSpec extends CompositeSketchSpec {
  uid?: string;
  dom: RawDomSchema;
  components?: AlloySpec[];
  touchmenuBehaviours?: AlloyBehaviourRecord;
  sandboxClasses?: string[];
  sandboxBehaviours?: AlloyBehaviourRecord;

  onHoverOn?: (comp: AlloyComponent) => void;
  onHoverOff?: (comp: AlloyComponent) => void;
  toggleClass: string;

  onExecute?: (sandbox: AlloyComponent, menu: AlloyComponent, item: AlloyComponent, value: ItemDataTuple) => void;
  onTap?: (comp: AlloyComponent) => void;

  menuTransition?: { property: string, transitionClass: string };

  onOpen?: (anchor: AnchorSpec, comp: AlloyComponent, menu: AlloyComponent) => void;
  onClosed?: (sandbox: AlloyComponent, inline: AlloyComponent) => void;
  eventOrder?: Record<string, string[]>;
  role?: string;

  lazySink?: (comp: AlloyComponent) => Result<AlloyComponent, Error>;

  fetch: (comp: AlloyComponent) => Future<ItemSpec[]>;
  matchWidth?: boolean;
  useMinWidth?: boolean;

  parts: {
    menu: PartialMenuSpec,
    view: Partial<TabviewSpec>,
    sink?: SimpleOrSketchSpec
  };

  getAnchor?: (comp: AlloyComponent) => AnchorSpec;
}

export interface TouchMenuSketcher extends CompositeSketch<TouchMenuSpec, TouchMenuDetail> { }
