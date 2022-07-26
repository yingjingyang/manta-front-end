// @ts-nocheck
import Svgs from "resources/icons";

export default class Chain {
    constructor(name, icon) {
      this.name = name;
      this.icon = icon;
    }

    static Kusama() {
        return new Chain("Kusama", Svgs.KusamaIcon)
    }

    static Calamari() {
        return new Chain("Calamari", Svgs.Calamari)
    }

    static Karura() {
        return new Chain("Calamari", Svgs.Calamari)
    }

    static All() {
        return [Chain.Calamari(), Chain.Kusama(), Chain.Karura]
    }   
}