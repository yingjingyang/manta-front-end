// @ts-nocheck

const ADDRESS_TO_COLLATOR_NAME_MAP = {
  dmxa3MJczFGT92BUQjwsxguUC2t5qFaDdagfpBQWdGkNPJYQ5: 'Anonstake',
  dmup6erAb8iJHQ2UXyHkA1G6m1hnSLRM55PdSD7DDbN1Ww4ZN: 'Validatrium',
  dmzbaFDDoYwXrX7Fa5mT2SfLapMZD8dynXPH4JviFEmMQz9Fu: 'bwarelabs-collator-a',
  dmuuG83f3JeXBmMp7e3XssJzq7rUAuNgAT3z7HoUPWueqpD1V: 'lh',
  dmy6WPM2KfD7WBxJYS6UG17GHJVCv8kewiwTr6ciVeXLbBpvf: 'CrypTech',
  dmvFayQJ9S7BgbHE2kmnoVq9UfdbfwHpZ4d1revJfVA6X9dGR: 'SeaFoodShop',
  dmu7rmwTa35Ec5cnNMpn8EpnFPA727sDtpCQwu9uCo2sfnmg1: '🇭🇺',
  dmvuGKcNe4VEv1rBVcTFEavAsccciEXcWoEi5iQrdR1NNMD1w: 'orange skies',
  dmx4WhyUDhAjsMf1mRD55qApjxnqSXcSsmweHgcv8seGkrN4R: 'staker-space',
  dmyZopEVaerkgSWWTd4WScPkhQgHTeLfMcHVCkQUyL1gu29c3: 'mini rocket',
  dmzWDne3MxniVDcF4i2nGkfPZa4pfkWL1AXqgSvWgZmDoTcYw: 'StakeBaby Calamari WS',
  dmx7NaUig7rdhwTJcnj6VPFaeou4KsvTqkMTcvHz25LcZtNrT: 'Brightlystake',
  dmzEUqQGSWsFewzpomYcjhLYkeSAvHYwEoKzG2yXcF8YQoJkL: 'MARJA',
  dmwM2xeWD2BjmCVYddTjB8QyYsktPsx2gySEZYbpdKFNnSGKd: 'FULLSTACK',
  dmxbgDpKK6V3Sayr3jz8MpoUJyxiWese6FtL42RRfZXnWewTD: 'ACV|TEAM',
  dmxyqP33GNwS6mA8bsWHQjeyKJM2eUVeCueER44b254ZCMy23: 'TopShot',
  dmycXK86XZfJV8CuJWoufuY3wq5mnRwhzQmsfQjDvNypyrUDM: 'Ketchup',
  dmzh2ESTJAy1MJ8Ekg9zs1653HFBUqCQeErihJZSHfFXGgNUh: 'Insight Finance',
  dmuomPgt6hJzKpDcEbz2BNNo9uPFXDvzBk7vnLQx6TLBQG85L: 'nettle',
  dmyEgR9K8hsgqt47XYnDDJJMaXgHnPLVjTFW8nfRa2RKoj17U: 'TheMilkyWayGang',
  dmvPNCD8YaHusmrdtvpB6HG72BibVSpnbHugT893x4Hw9P186: 'STAKECRAFT',
  dmyhGCWjejSyze6Hcqx43f8PNR9RWwm4EEobo8HehtBb8W8aU: 'CJ Calamari',
  dmuPiPzqGwuKsik8XLLPPi2xHCEwADyrfxakgiQbjtYEh7bDy: 'kooltek68',
  dmvvqrfK5AUYH294zTCCiimJRV7CQDDQyC7RAkd5aZgUn9S6f: 'Youhane Momoka | 255 DAO',
  dmvoKqM8n2PVKyiYhm5VpMMnzMdk1z1WZAYDJEDmSLSqRgrbQ: 'Polkadotters',
  dmz1cxDw6nC5impJMZVfDwve5AG2s5AeaqSkZvQnEuqVwLYnL:
    'pithecus-calamari-john316',
  dmuazX1JVi1XSd3g7ifaQQnJpodUfmbJVgqP8LXvgXBnsPGtA: 'calamari-bitManna',
  dmuaG34aVnxirpMsHXu6Mg7RxNN3cxG74ZyjLVEgvzNqBXm2U: 'SunshineAutosKma',
  dmyxfU1bJM5UR5RWsypKm9KQDkVofm3ifp5gVjzs8uQHUmBZb: 'pathrocknetwork',
  dmvVY24KwgNwoYnHw5EbC8mTUF9CtZeJzCnSGBawWzaRkNHH4: 'lets_node',
  // test collators
  dmyjURuBeJwFo4Nvf2GZ8f5E2Asz98JY2d7UcaDykqYm1zpoi: 'Alice',
  dmxAK9q1WBDFtuNS9bLbBujK452yFfm8h8HLHWrr5mZqnEBi2: 'Bob',
  dmtwRyEeNyRW3KApnTxjHahWCjN5b9gDjdvxpizHt6E9zYkXj: 'test1',
  dmud2BmjLyMtbAX2FaVTUtvmutoCKvR3GbARLc4crzGvVMCwu: 'test2',
  dmvSXhJWeJEKTZT8CCUieJDaNjNFC4ZFqfUm4Lx1z7J7oFzBf: 'test3',
  dmx4vuA3PnQmraqJqeJaKRydUjP1AW4wMVTPLQWgZSpDyQUrp: 'test4',
  dmxvZaMQir24EPxvFiCzkhDZaiScPB7ZWpHXUv5x8uct2A3du: 'test5'
};

export default class Collator {
  constructor(
    address,
    balanceSelfBonded,
    balanceEffectiveBonded,
    delegationCount,
    minStake,
    isActive
  ) {
    this.address = address;
    this.name = this.mapAddressToName(address);
    this.delegationCount = delegationCount;
    this.balanceSelfBonded = balanceSelfBonded;
    this.balanceEffectiveBonded = balanceEffectiveBonded;
    this.isActive = isActive;
    this.minStake = minStake;
    this.apy = null;
  }

  setApy(apy) {
    this.apy = apy;
  }

  mapAddressToName(address) {
    return ADDRESS_TO_COLLATOR_NAME_MAP[address] || 'anonymous';
  }
}
