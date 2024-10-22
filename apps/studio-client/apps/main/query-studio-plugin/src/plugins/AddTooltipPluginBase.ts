import Component from "@jangaroo/ext-ts/Component";
import Element from "@jangaroo/ext-ts/dom/Element";
import AbstractPlugin from "@jangaroo/ext-ts/plugin/Abstract";
import QuickTipManager from "@jangaroo/ext-ts/tip/QuickTipManager";
import { as, bind, is } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import AddTooltipPlugin from "./AddTooltipPlugin";

interface AddTooltipPluginBaseConfig extends Config<AbstractPlugin> {
}

/**
 * Adds a tooltip to a component.
 *
 * @author dasc
 * @version $Id$
 */
class AddTooltipPluginBase extends AbstractPlugin {
  declare Config: AddTooltipPluginBaseConfig;

  #component: Component = null;

  #tooltip: string = null;

  #registered: boolean = false;

  constructor(config: Config<AddTooltipPlugin> = null) {
    super(((): any => {
      this.#tooltip = config.tooltip;
      return config;
    })());
  }

  override init(component: Component): void {
    if (component && is(component, Component)) {
      this.#component = component;
      if (component.rendered) {
        this.#addTooltip();
      } else {
        component.on("afterrender", bind(this, this.#addTooltip));
      }
    }
  }

  #addTooltip(): void {
    this.#register();
    // ensure unregistering
    this.#component.on("destroy", (): void =>
      this.#unregister(),
    );
  }

  #register(): void {
    if (!this.#registered && is(this.#tooltip, String) && this.#tooltip.length > 0) {
      const target = this.#getTargetElement();
      if (target) {
        QuickTipManager.register({
          target: target,
          text: this.#tooltip,
          // @ts-ignore
          maxWidth: 350,
        });
        this.#registered = true;
      }
    }
  }

  #unregister(): void {
    if (this.#registered) {
      const target = this.#getTargetElement();
      if (target) {
        QuickTipManager.unregister(target);
        this.#registered = false;
      }
    }
  }

  #getTargetElement(): Element {
    const field = as(this.#component, Component);
    if (field) {
      return field.el;
    }
    return undefined;
  }

}

export default AddTooltipPluginBase;
