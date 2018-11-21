# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

# [4.3.4] - 2018-11-21
### Changed
 - alloy UIDs are random (again) to prevent issues with nested motherships loaded with different scripts

### Fixed
 - Sliding shrinking and growing classes were not being removed when toggling mid-animation

# [4.3.0] - 2018-11-05
###
 - Exposed a new LazySink type

### Changed
 - The lazySink function now takes a component as an argument
 - A new getApis() method for running individual APIs on components

# [4.2.0] - 2018-11-02
### Added
 - Exposed NodeAnchorSpec type

# [4.1.0] - 2018-11-01
### Added
 - Typeahead specification now may have an onSetValue handler

# [4.0.0] - 2018-10-30
### Changed
 - All sketcher configs are no longer wrapped in functions
 - Only non-button HTML tags get a role of button
 - TieredMenu submenus are built on-demand and then cached

# [3.52.0] - 2018-10-25
### Added
 - Label part for sliders

# [3.51.0] - 2018-10-25
### Changed
 - Window scroll events are not automatically detected by the mothership

## [3.50.0] - 2018-10-22
### Added
 - NodeAnchor positioning mode

## [3.49.0] - 2018-10-18
### Fixed
 - Backspace keys are no longer swallowed in content-editable sections

## [3.48.0] - 2018-10-17
### Added
 - positionWithin API to Positioning behaviour and showWithin API to InlineView sketcher, allowing positioning within bounds without prior configuration

## [3.47.0] - 2018-10-10
### Added
 - layouts property to dropdown, split dropdown and type ahead specs, to modify the position of the resulting menu of these components.

## [3.46.0] - 2018-09-28
### Added
 - useMinWidth property to dropdown and split dropdown specs, to modify matchWidth's behaviour. When true, matchWidth sets min-width, when false it sets width.

## [3.45.6] - 2018-09-28
### Remove
 - Hard-coded background color of blocker

## [3.45.4] - 2018-09-25
### Fixed
 - Origins are calculated after preprocessing both the positioning container and the component to be placed

## [3.45.2] - 2018-09-25
### Fixed
 - East and West layouts now have a top value

## [3.45.0] - 2018-09-24
### Changed
 - When previewing in a typeahead, pressing *enter* fires an execute

## [3.44.0] - 2018-09-21
### Fixed
 - Keyboard navigating through the toolbar now skips disabled buttons.

## [3.43.0] - 2018-09-21
### Added
 - ModalDialog blocker part now can take components to put *before* dialog

### Changed
 - Group Part types now use a factory if present

## [3.42.0] - 2018-09-20
### Added
 - Alloy listens to the keyup event

### Changed
 - Keying behaviours that handle space cancel space on keyup. Helps to prevent a firefox issue with buttons

## [3.41.0] - 2018-09-20
### Added
 - Exposed Layout and Bubble through Main
 - Additional Layout options: east and west
 - Configuration classes for different bubbles positions

### Changed
 - Layout names in the private API have changed
 - Bubble data structure format

## [3.40.0] - 2018-09-20
### Changed
 - Positioning logic refactor.

## [3.39.3] - 2018-09-19
### Fixed
 - Correct argument is passed through for `item` in itemExecute in Typeahead
 - Internal event Typeahead itemExecute is handled when dismissOnBlur is false

## [3.39.0] - 2018-09-17
### Removed
 - Shorthands `type` and `placeholder` from Input

## [3.38.0] - 2018-09-17
### Added
 - Function `onItemExecute` to Typeahead

## [3.37.0] - 2018-09-17
### Added
 - Event `focusout` to NativeEvents

## [3.36.0] - 2018-09-14
### Added
 - InlineView has new API method: setContent

## [3.35.0] - 2018-09-14
### Changed
 - Typeahead now lets `onEscape` and `onEnter` events bubble when sandbox is closed

## [3.34.0] - 2018-09-13
### Added
 - Function `attachSystemAfter` to Attachment so a `GuiSystem` can be attached as a sibling

## [3.33.0] - 2018-09-12
### Added
 - Group parts have a `preprocess` configuration

### Fixed
 - Sliding listens to transition events from itself, not the animation root

### Changed
 - Modal Dialog busy container is now inside the Modal Dialog container
 - ModalDialog callback in `setBusy` API is no longer passed the existing dialog styles

### Removed
 - Menu movement configuration options for laying out item components. Use group `preprocess` instead


## [3.32.0] - 2018-09-11
### Fixed
 - Sliding behaviour now handles rapidly switching between expanding and shrinking

## [3.31.0] - 2018-09-11
### Changed
 - `text` property is now in `meta` for Items

## [3.30.0] - 2018-09-10
### Added
 - Created a Dropdown API with isOpen, close, expand, open
 - New event `focusShifted` that is fired by the FocusManager in Keying
 - Representing config to the Dropdown sandbox to store the triggering Dropdown

### Changed
 - Hover behaviour on menus now shows the expanded menu, but doesn't focus it
 - Renamed unused config `openImmediately` to `highlightImmediately` and made TieredMenus always open

## [3.29.0] - 2018-09-07
### Added
 - Docking.refresh() to recalculate the component's position and visibility

## [3.28.0] - 2018-09-06
### Added
- Expanded the SlotContainer API to add:
  - getSlotNames
  - isShowing
  - hideAllSlots
### Fixed
 - Sandbox cloaking no longer enforces position when no position attributes are applied.

## [3.27.0] - 2018-09-06
### Fixed
 - Fixed Sliding behaviour responding to transitionend on nested elements
 - Fixed types on Sliding behavior API

## [3.26.0] - 2018-09-05
### Added
 - data alloy identifiers to the DOM nodes themselves. They are no longer in the
 visible HTML

## [3.25.0] - 2018-09-05
### Added
 - dynamic configuration of debugging modes

## [3.24.0] - 2018-09-04
### Added
 - InlineView.showMenuAt() to special-case positioning for inline menus
 - Sandboxing.openWhileCloaked() convenience method

## [3.23.0] - 2018-08-31
### Added
 - eventOrder for Dropdowns
 - extra debugging information

## [3.22.0] - 2018-08-29
### Added
 - dragging behaviour flag for repositionTarget (defaults to true)
 - dragging behaviour handler (onDrag)

## [3.21.0] - 2018-08-29
### Added
 - onChoose event to Sliders

## [3.20.0] - 2018-08-28
### Added
 - Replacing.replaceAt and Replacing.replaceBy

## [3.19.0] - 2018-08-23
### Added
 - Tooltipping API access to hideAllExclusive, and tooltipComponents in config
 - DomFactory.simple and DomFactory.dom for quick generation of basic AlloySpec objects
 - InlineView API: getContent
 - Readable state for Flatgrid Keying types
 - Support for matrix-style menus
 - Consistent definitions for itemBehaviours and widgetBehaviours
 - IgnoreFocus capability for item widgets
 - Exposing onChangeTab and onDismissTab through TabSectionTypes
 - Chain methods for TestStore

## [3.18.0] - 2018-08-20
### Added
 - selectClasses and selectAttributes to HtmlSelect sketcher

## [3.17.0] - 2018-08-10
### Added
 - Configuration for InlineView: fireDismissalEventInstead
 - SystemEvents.dismissRequested()

## [3.16.0] - 2018-08-08
### Added
- Reflecting behaviour
- ModalDialog getFooter API
- Exported AlloyComponent and renamed MomentoRecord to MementoRecord

## [3.15.0] - 2018-08-03
### Added
- Typeahead, SplitDropdown: getHotspot option

## [3.14.0] - 2018-08-01
### Added
- SlotContainer: new sketcher

## [3.13.0] - 2018-08-01
### Added
- ModalDialog setIdle and setBusy API

## [3.12.0] - 2018-08-01
### Added
- Alloy listens to paste event

## [3.11.0] - 2018-07-31
### Added
- Highlighting.getCandidates API
- TabSection showTab API

## [3.10.0] - 2018-07-31
### Added
- Changelog.
- The capability to set dropdown anchor points to something other than the drop button.
