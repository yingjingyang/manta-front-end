# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2022-06-16
### Added
- [\#145](https://github.com/Manta-Network/manta-front-end/pull/145) Distinguish longer-lasting initial sync from subsequent syncs in UI text
- [\#145](https://github.com/Manta-Network/manta-front-end/pull/145) Add loading animation to '...' text while private balances are syncing to chain
- [\#138](https://github.com/Manta-Network/manta-front-end/pull/138) / [\#160](https://github.com/Manta-Network/manta-front-end/pull/160) Support end-to-end testing by adding metadata to front end components
- [\#126](https://github.com/Manta-Network/manta-front-end/pull/126) Add bug report link to sidebar
- [\#154](https://github.com/Manta-Network/manta-front-end/pull/154) Add versioning rules to readme
- [\#164](https://github.com/Manta-Network/manta-front-end/pull/164) Add downtime modal
- [\#134](https://github.com/Manta-Network/manta-front-end/pull/134) Persist and load privacy toggle / asset selection

### Changed
- [\#141](https://github.com/Manta-Network/manta-front-end/pull/141) Sync to chain more quickly and efficiently using new RPC

### Fixed
- [\#142](https://github.com/Manta-Network/manta-front-end/pull/142) Prevent stale balances from displaying after a transaction while waiting for wallet synchronization
- [\#152](https://github.com/Manta-Network/manta-front-end/pull/152) Add staging branch to CI/CD pipeline

## [2.2.0] - 2022-07-6
### Fixed
- [\#187](https://github.com/Manta-Network/manta-front-end/pull/187) Updates the front end to use the new pull RPC interface, which makes the front end compatible with the current runtime, and reduces wallet sync times
- [\#187](https://github.com/Manta-Network/manta-front-end/pull/187) Fixes a bug such that dolphin public balances won't load

## [2.3.0] - 2022-07-8
### Changed
- [\#184](https://github.com/Manta-Network/manta-front-end/pull/184) Moved inline SVGs to their own files
- [\#176](https://github.com/Manta-Network/manta-front-end/pull/176) Vertically and horizontally centered page content

### Fixed
- [\#183](https://github.com/Manta-Network/manta-front-end/pull/183) Fixed Send Max Amount warning for DOL, which was stretching out the UI for 2 or 3 pixels only on firefox
- [\#183](https://github.com/Manta-Network/manta-front-end/pull/183) Fixed Dolphin icon missing piece
- [\#188](https://github.com/Manta-Network/manta-front-end/pull/188) Fixed sidebar menu disappearing on smaller screens
- [\#182](https://github.com/Manta-Network/manta-front-end/pull/182) Fixed autocomplete getting discolored under some conditions

## [3.0.0] - 2022-10-5
### Added
- [\#252](https://github.com/Manta-Network/manta-front-end/pull/252) Added Calamari staking page and support for multiple networks

## [3.0.1] - 2022-10-11
### Added
- [\#270](https://github.com/Manta-Network/manta-front-end/pull/270) Display previous round rewards and APY estimates adjusted for collator performance on the staking page

## [3.0.2] - 2022-10-12
### Fixed
- [\#272](https://github.com/Manta-Network/manta-front-end/pull/272) Prevent error when user is staked to a node that left the set of collator candidates

## [3.0.3] - 2022-10-19
### Fixed
- [\#275](https://github.com/Manta-Network/manta-front-end/pull/275) Fix display issue on widescreens; fix failure to connect to Talisman wallet

## [3.0.4] - 2022-10-21
### Fixed
- [\#281](https://github.com/Manta-Network/manta-front-end/pull/281) Prevent excess api calls when initializing wallet
