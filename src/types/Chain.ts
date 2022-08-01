// @ts-nocheck
import config from 'config';
import Svgs from 'resources/icons';
import types from '../config/types.json';
import AssetType from './AssetType';


export default class Chain {
  constructor(name, icon, socket, xcmAssets, nativeAsset, apiTypes = null) {
    this.name = name;
    this.icon = icon;
    this.socket = socket;
    this.xcmAssets = xcmAssets;
    this.nativeAsset = nativeAsset;
    this.apiTypes = apiTypes || {};
  }

  canTransferXcm(otherChain) {
    for (let i = 0; i < this.xcmAssets.length; i++) {
      const asset = this.xcmAssets[i];
      if (otherChain.xcmAssets.find(otherAsset => asset.assetId === otherAsset.assetId)) {
        return true;
      }
    }
    return false;
  }

  static Dolphin() {
    return new Chain(
      'Dolphin',
      Svgs.Dolphin,
      config.DOLPHIN_SOCKET,
      [AssetType.Rococo(), AssetType.Karura()],
      AssetType.Dolphin(),
      types
    );
  }

  static Calamari() {
    return new Chain(
      'Calamari',
      Svgs.Calamari,
      config.CALAMARI_SOCKET,
      [AssetType.Kusama(), AssetType.Karura()],
      AssetType.Calamari(),
      types
    );
  }

  static Rococo() {
    return new Chain(
      'Rococo',
      Svgs.RocIcon,
      config.ROCOCO_SOCKET,
      [AssetType.Rococo()],
      AssetType.Rococo()
    );
  }

  static Kusama() {
    return new Chain(
      'Kusama',
      Svgs.KusamaIcon,
      config.KUSAMA_SOCKET,
      [AssetType.Kusama()],
      AssetType.Kusama()
    );
  }

  static Karura() {
    return new Chain(
      'Karura',
      Svgs.KarIcon,
      config.KARURA_SOCKET,
      [AssetType.Karura()],
      AssetType.Karura()
    );
  }

  static All() {
    return [Chain.Dolphin(), Chain.Rococo(), Chain.Karura()];
  }
}
