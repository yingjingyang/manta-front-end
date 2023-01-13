// @ts-nocheck
import { Carousel } from 'element-react';
import { ThemeItem, useSBT } from 'pages/SBTPage/SBTContext';
import themeMap from 'resources/images/sbt/theme';

const Item = ({ item }: { item: ThemeItem }) => {
  return (
    <div className="relative">
      <img src={item.img} className="w-96 h-96" />
      <span className="absolute top-4 right-4 bg-gradient rounded-lg text-sm px-2">
        {item.name}
      </span>
      <div className="absolute bottom-4 left-4">
        <h2 className="text-xl">Pico.zk</h2>
        <p className="text-sm">Product Manager @ Manta</p>
      </div>
    </div>
  );
};
const ThemeChecked = () => {
  const { checkedThemeItems } = useSBT();
  if (checkedThemeItems.size === 0) {
    return <Item item={{ name: 'Anime', img: themeMap.Anime }}></Item>;
  }
  return (
    <Carousel
      height="24rem"
      className="w-96"
      autoplay={false}
      indicatorPosition={'none'}>
      {[...checkedThemeItems.values()].map((item) => {
        return (
          <Carousel.Item key={item.name}>
            <Item item={item} />
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
};
export default ThemeChecked;
