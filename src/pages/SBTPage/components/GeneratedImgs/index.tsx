//@ts-nocheck
import { Carousel } from 'element-react';
import { useSBT } from 'pages/SBTPage/SBTContext';

const GeneratedImgs = () => {
  const { imgList } = useSBT();
  const { mintSet, setMintSet } = useSBT();
  const toggleMint = (img) => {
    if (mintSet.has(img)) {
      mintSet.delete(img);
    } else {
      mintSet.add(img);
    }
    setMintSet(new Set(mintSet));
  };
  return (
    <div className="w-128 mx-auto">
      <Carousel
        interval={2000}
        type="card"
        height="256px"
        indicatorPosition="none">
        {imgList.map((img, index) => {
          return (
            <Carousel.Item key={index} className="relative">
              <img
                src={URL.createObjectURL(img)}
                className={`rounded-xl cursor-pointer ${
                  mintSet.has(img) ? 'border-4 border-check' : ''
                }`}
                onClick={() => toggleMint(img)}
              />
              {mintSet.has(img) && (
                <svg
                  className="absolute bottom-4 left-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none">
                  <path
                    d="M18.1465 10.6464L18.1465 10.6464C18.3417 10.4512 18.6583 10.4512 18.8535 10.6464C19.0488 10.8417 19.0488 11.1583 18.8535 11.3536C18.8535 11.3536 18.8535 11.3536 18.8535 11.3536L12.8536 17.3535C12.6583 17.5488 12.3417 17.5488 12.1464 17.3535L9.14645 14.3536C9.14645 14.3536 9.14644 14.3536 9.14644 14.3536C8.95119 14.1583 8.95119 13.8417 9.14643 13.6465C9.34171 13.4512 9.65829 13.4512 9.85357 13.6465L11.7929 15.5858L12.5 16.2929L13.2071 15.5858L18.1465 10.6464ZM14 27C21.1797 27 27 21.1797 27 14C27 6.8203 21.1797 1 14 1C6.82029 1 1 6.82029 1 14C1 21.1797 6.8203 27 14 27Z"
                    fill="#050D32"
                    stroke="#00AFA5"
                    strokeWidth="2"
                  />
                </svg>
              )}
            </Carousel.Item>
          );
        })}
      </Carousel>
    </div>
  );
};

export default GeneratedImgs;
