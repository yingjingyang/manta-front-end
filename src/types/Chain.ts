// @ts-nocheck
import config from 'config';
import Svgs from 'resources/icons';
import { KaruraAdapter } from '@polkawallet/bridge/build/adapters/acala';
import { CalamariAdapter } from '@polkawallet/bridge/build/adapters/manta';
import { KusamaAdapter} from '@polkawallet/bridge/build/adapters/polkadot';
import { MoonriverAdapter } from '@polkawallet/bridge/build/adapters/moonbeam';
import { typesBundlePre900 } from "moonbeam-types-bundle"
import types from '../config/types.json';
import AssetType from './AssetType';
import { options } from '@acala-network/api';
import { ApiPromise, WsProvider } from '@polkadot/api';

// export type ApiConfig = {
//   socket: string
//   apiTypes: bool,
//   apiOptions: bool,
//   apiTypesBundle: bool
// }

// export type XcmConfig = {
//   xcmAssets: string
//   nativeAsset: string
//   xcmAdapter: string
//   parachainId: number
// }


export default class Chain {
  constructor(
    name,
    displayName,
    parachainId,
    icon,
    socket,
    xcmAssets,
    nativeAsset,
    xcmAdapter,
    apiTypes = null,
    apiOptions = null,
    apiTypesBundle = null,
    ethMetadata = null
  ) {
    this.name = name;
    this.displayName = displayName;
    this.parachainId = parachainId;
    this.icon = icon;
    this.socket = socket;
    this.xcmAssets = xcmAssets;
    this.nativeAsset = nativeAsset;
    this.xcmAdapter = xcmAdapter;
    this.apiTypes = apiTypes || {};
    this.apiOptions = apiOptions;
    this.apiTypesBundle = apiTypesBundle;
    this.ethMetadata = ethMetadata;
  }

  static Dolphin() {
    return new Chain(
      'dolphin',
      'Dolphin',
      2084,
      Svgs.Dolphin,
      config.DOLPHIN_SOCKET,
      [AssetType.Rococo(), AssetType.Karura(), AssetType.Moonriver()],
      AssetType.Dolphin(),
      new CalamariAdapter(),
      types
    );
  }

  static Calamari() {
    return new Chain(
      'calamari',
      'Calamari',
      2084,
      Svgs.Calamari,
      config.CALAMARI_SOCKET,
      [AssetType.Kusama(), AssetType.Karura(), AssetType.Moonriver()],
      AssetType.Calamari(),
      new CalamariAdapter(),
      types
    );
  }

  static Rococo() {
    return new Chain(
      'rococo',
      'Rococo',
      null,
      Svgs.RocIcon,
      config.ROCOCO_SOCKET,
      [AssetType.Rococo()],
      AssetType.Rococo(),
      new KusamaAdapter()
    );
  }

  static Kusama() {
    return new Chain(
      'kusama',
      'Kusama',
      null,
      Svgs.KusamaIcon,
      config.KUSAMA_SOCKET,
      [AssetType.Kusama()],
      AssetType.Kusama(),
      new KusamaAdapter()
    );
  }

  static Karura() {
    return new Chain(
      'karura',
      'Karura',
      2000,
      Svgs.KarIcon,
      config.KARURA_SOCKET,
      [AssetType.Karura()],
      AssetType.Karura(),
      new KaruraAdapter(),
      null,
      options
    );
  }

  static Moonriver() {
    const moonriverEthMetadata = {
      chainId: '0x500',
      chainName: 'Moonriver Development Testnet',
      nativeCurrency: {
        name: 'MOVR',
        symbol: 'MOVR',
        decimals: 18
      },
      rpcUrls: [config.MOONRIVER_RPC]
    };

    return new Chain(
      'moonriver',
      'Moonriver',
      1000,
      Svgs.MovrIcon,
      config.MOONRIVER_SOCKET,
      [AssetType.Moonriver()],
      AssetType.Moonriver(),
      new MoonriverAdapter(),
      typesBundlePre900,
      null,
      null,
      moonriverEthMetadata
    );
  }

  static All() {
    if (config.NETWORK_NAME === 'Calamari') {
      return [
        Chain.Calamari(),
        Chain.Kusama(),
        Chain.Karura(),
        Chain.Moonriver()
      ];
    } else {
      return [];
    }
  }

  async _initApi() {
    const provider = new WsProvider(this.socket);
    if (this.apiOptions) {
      this.api = await ApiPromise.create(options({ provider, types: this.apiTypes}));
    } else {
      this.api = await ApiPromise.create({provider, types: this.apiTypes, typesBundle: this.apiTypesBundle});
    }
  }

  async initXcmAdapter() {
    await this._initApi();
    if (this.xcmAdapter) {
      await this.xcmAdapter.setApi(this.api);
    }
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
}
