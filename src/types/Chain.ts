// @ts-nocheck
import config from 'config';
import Svgs from 'resources/icons';
import types from '../config/types.json';
import AssetType from './AssetType';


export default class Chain {
  constructor(name, parachainId, icon, socket, xcmAssets, nativeAsset, apiTypes = null) {
    this.name = name;
    this.parachainId = parachainId;
    this.icon = icon;
    this.socket = socket;
    this.xcmAssets = xcmAssets;
    this.nativeAsset = nativeAsset;
    this.apiTypes = apiTypes || {};
  }

  canTransferXcm(otherChain) {
    if (this.name === otherChain.name) {
      return false;
    }
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
      2084,
      Svgs.Dolphin,
      config.DOLPHIN_SOCKET,
      [AssetType.Rococo(), AssetType.Karura(), AssetType.Moonriver()],
      AssetType.Dolphin(),
      types
    );
  }

  static Calamari() {
    return new Chain(
      'Calamari',
      2084,
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
      null,
      Svgs.RocIcon,
      config.ROCOCO_SOCKET,
      [AssetType.Rococo()],
      AssetType.Rococo()
    );
  }

  static Kusama() {
    return new Chain(
      'Kusama',
      null,
      Svgs.KusamaIcon,
      config.KUSAMA_SOCKET,
      [AssetType.Kusama()],
      AssetType.Kusama()
    );
  }

  static Karura() {
    return new Chain(
      'Karura',
      2000,
      Svgs.KarIcon,
      config.KARURA_SOCKET,
      [AssetType.Karura()],
      AssetType.Karura()
    );
  }

  static Moonriver() {
    return new Chain(
      'Moonriver',
      1000,
      Svgs.MovrIcon,
      config.MOONRIVER_SOCKET,
      [AssetType.Moonriver()],
      AssetType.Moonriver()
    );
  }

  static All() {
    return [
      Chain.Dolphin(),
      Chain.Rococo(),
      Chain.Karura(),
      Chain.Moonriver()
    ];
  }
}
