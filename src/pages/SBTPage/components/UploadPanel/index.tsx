import { Step, UploadFile, useSBT } from 'pages/SBTPage/SBTContext';
import MantaIcon from 'resources/images/manta.png';
import { ChangeEvent, useMemo } from 'react';

const Upload = () => {
  const { imgList, setImgList } = useSBT();
  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files?.length) {
      const addedImgList: UploadFile[] = [...e.target.files].map((file) => ({
        file,
        metadata: ''
      }));
      const newImgList = [...imgList, ...addedImgList].slice(0, MAX_UPLOAD_LEN);
      setImgList(newImgList);
    }
  };
  return (
    <div className="relative w-max">
      <div className="border border-dashed bg-primary rounded-lg w-48 h-48 flex justify-center items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.64824 0C6.87909 0 4.84224 0.0922961 3.45229 0.191571C1.68271 0.317958 0.317958 1.68271 0.191571 3.4523C0.0922961 4.84224 0 6.87909 0 9.64824C0 12.4174 0.0922961 14.4542 0.191571 15.8442C0.31464 17.5673 1.61185 18.9065 3.31366 19.0924C3.25671 17.8532 3.21608 16.3213 3.21608 14.4724C3.21608 11.6676 3.30956 9.59244 3.41174 8.16188C3.59511 5.59448 5.59448 3.59511 8.16188 3.41174C9.59244 3.30956 11.6676 3.21608 14.4724 3.21608C16.3213 3.21608 17.8532 3.25671 19.0924 3.31366C18.9065 1.61185 17.5673 0.31464 15.8442 0.191571C14.4542 0.0922961 12.4174 0 9.64824 0ZM14.4724 4.82412C11.7032 4.82412 9.66636 4.91642 8.27642 5.01569C6.50683 5.14208 5.14208 6.50683 5.01569 8.27642C4.91642 9.66636 4.82412 11.7032 4.82412 14.4724C4.82412 17.2415 4.91642 19.2784 5.01569 20.6683C5.14208 22.4379 6.50683 23.8026 8.27642 23.929C9.66636 24.0283 11.7032 24.1206 14.4724 24.1206C17.2415 24.1206 19.2784 24.0283 20.6683 23.929C22.4379 23.8026 23.8026 22.4379 23.929 20.6683C24.0283 19.2784 24.1206 17.2415 24.1206 14.4724C24.1206 11.7032 24.0283 9.66636 23.929 8.27642C23.8026 6.50683 22.4379 5.14208 20.6683 5.01569C19.2784 4.91642 17.2415 4.82412 14.4724 4.82412ZM16.6165 10.1843C16.6165 9.00015 17.5764 8.0402 18.7606 8.0402C19.9447 8.0402 20.9046 9.00015 20.9046 10.1843C20.9046 11.3684 19.9447 12.3283 18.7606 12.3283C17.5764 12.3283 16.6165 11.3684 16.6165 10.1843ZM22.468 17.6293C21.7312 16.9609 21.157 16.4694 20.7193 16.1114C19.9188 15.4567 18.8445 15.353 17.9661 15.9388C17.3959 16.3191 16.6301 16.8847 15.6459 17.7193C14.1496 16.2949 13.1053 15.3854 12.4079 14.815C11.6074 14.1602 10.533 14.0566 9.65467 14.6424C8.92661 15.128 7.87908 15.9161 6.46459 17.1811C6.49959 18.581 6.55861 19.698 6.61971 20.5538C6.68913 21.5255 7.41923 22.2557 8.39108 22.3251C9.74038 22.4214 11.739 22.5126 14.4725 22.5126C17.206 22.5126 19.2045 22.4214 20.5538 22.3251C21.5257 22.2557 22.2558 21.5255 22.3252 20.5538C22.3796 19.7913 22.4324 18.8217 22.468 17.6293Z"
            fill="white"
          />
        </svg>
      </div>
      <input
        className="opacity-0 absolute top-0 left-0 right-0 bottom-0 cursor-pointer"
        type="file"
        multiple
        accept="image/*"
        onChange={onImageChange}
      />
    </div>
  );
};
const MAX_UPLOAD_LEN = 20;
const MIN_UPLOAD_LEN = 5;
const UploadPanel = () => {
  const { setCurrentStep, imgList, setImgList } = useSBT();
  const toThemePage = () => {
    setCurrentStep(Step.Theme);
  };
  const handleRemove = (index: number) => {
    const newArr = [...imgList];
    newArr.splice(index, 1);
    setImgList(newArr);
  };
  const btnDisabled = useMemo(() => {
    return imgList.length < MIN_UPLOAD_LEN || imgList.length > MAX_UPLOAD_LEN;
  }, [imgList]);

  return (
    <div className="flex-1 flex flex-col mx-auto mb-32 bg-secondary rounded-xl p-6 w-75 relative mt-6">
      <div className="flex items-center">
        <img src={MantaIcon} className="w-8 h-8 mr-3" />
        <h2 className="text-2xl">zkSBT</h2>
      </div>
      <h1 className="text-3xl my-6">Upload Photos</h1>
      <p className="text-sm text-opacity-60 text-white">
        Please upload at least 5 selfies. Adding more photos will produce a
        better zkSBT. Please make sure the image clearly depicts your face.
        Avoid using any images that have other faces in them. Please also make
        sure the background is clean. This will ensure the best generation of
        your zkSBT.
      </p>
      <div className="grid w-full gap-6 grid-cols-5 pb-24 mt-6">
        {imgList?.map(({ file }, index) => {
          return (
            <div className="relative w-max group" key={index}>
              <img
                src={URL.createObjectURL(file)}
                className="rounded-lg w-48 h-48"
              />
              <svg
                onClick={() => handleRemove(index)}
                className="absolute hidden -right-3 -top-3 group-hover:block cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none">
                <circle cx="12.0504" cy="12.0494" r="10.4429" fill="#12193C" />
                <path
                  d="M12 0C5.38327 0 0 5.38327 0 12C0 18.6167 5.38327 24 12 24C18.6167 24 24 18.6167 24 12C24 5.38327 18.6167 0 12 0ZM16.3448 15.0398C16.4341 15.1247 16.5056 15.2266 16.5549 15.3395C16.6042 15.4524 16.6304 15.574 16.632 15.6972C16.6336 15.8204 16.6105 15.9427 16.5641 16.0568C16.5177 16.1709 16.4489 16.2746 16.3617 16.3617C16.2746 16.4489 16.1709 16.5177 16.0568 16.5641C15.9427 16.6105 15.8204 16.6336 15.6972 16.632C15.574 16.6304 15.4524 16.6042 15.3395 16.5549C15.2266 16.5056 15.1247 16.4341 15.0398 16.3448L12 13.3056L8.96019 16.3448C8.78567 16.5106 8.55329 16.6017 8.31259 16.5986C8.07188 16.5955 7.84191 16.4985 7.67169 16.3283C7.50147 16.1581 7.40448 15.9281 7.4014 15.6874C7.39832 15.4467 7.48939 15.2143 7.65519 15.0398L10.6944 12L7.65519 8.96019C7.48939 8.78567 7.39832 8.55329 7.4014 8.31259C7.40448 8.07188 7.50147 7.84191 7.67169 7.67169C7.84191 7.50147 8.07188 7.40448 8.31259 7.4014C8.55329 7.39832 8.78567 7.48939 8.96019 7.65519L12 10.6944L15.0398 7.65519C15.2143 7.48939 15.4467 7.39832 15.6874 7.4014C15.9281 7.40448 16.1581 7.50147 16.3283 7.67169C16.4985 7.84191 16.5955 8.07188 16.5986 8.31259C16.6017 8.55329 16.5106 8.78567 16.3448 8.96019L13.3056 12L16.3448 15.0398Z"
                  fill="#F9413E"
                />
              </svg>
            </div>
          );
        })}
        {imgList.length < MAX_UPLOAD_LEN ? <Upload /> : null}
      </div>
      <button
        disabled={btnDisabled}
        onClick={toThemePage}
        className={`absolute px-36 py-2 unselectable-text text-center text-white rounded-lg gradient-button filter bottom-16 left-1/2 -translate-x-1/2 transform ${
          btnDisabled ? 'brightness-50 cursor-not-allowed' : ''
        }`}>
        Confirm
      </button>
    </div>
  );
};

export default UploadPanel;
