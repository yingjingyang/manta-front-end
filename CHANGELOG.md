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
