//@ts-nocheck
import Icon from 'components/Icon';
import { Carousel } from 'element-react';
import { useSBT } from 'pages/SBTPage/SBTContext';
import { MAX_MINT_SIZE } from '../Generated';

const GeneratedImgs = () => {
  const { imgList } = useSBT();
  const { mintSet, setMintSet } = useSBT();
  const toggleMint = (uploadFile) => {
    if (mintSet.has(uploadFile)) {
      mintSet.delete(uploadFile);
    } else {
      if (mintSet.size >= MAX_MINT_SIZE) {
        return;
      }
      mintSet.add(uploadFile);
    }
    setMintSet(new Set(mintSet));
  };
  return (
    <div className="w-128 mx-auto">
      <Carousel
        autoplay={false}
        type="card"
        height="256px"
        indicatorPosition="none">
        {imgList.map((uploadFile, index) => {
          return (
            <Carousel.Item key={index} className="relative">
              <img
                src={URL.createObjectURL(uploadFile?.file)}
                className={`rounded-xl ${
                  mintSet.has(uploadFile) ? 'border-4 border-check' : ''
                } ${
                  mintSet.size >= MAX_MINT_SIZE && !mintSet.has(uploadFile)
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer'
                }`}
                onClick={() => toggleMint(uploadFile)}
              />
              {mintSet.has(uploadFile) && (
                <Icon name="greenCheck" className="absolute bottom-4 left-4" />
              )}
            </Carousel.Item>
          );
        })}
      </Carousel>
    </div>
  );
};

export default GeneratedImgs;
