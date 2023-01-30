import Icon from 'components/Icon';
import { Step, UploadFile, useSBT } from 'pages/SBTPage/SBTContext';
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
        <Icon name="defaultImg" />
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
        <Icon name="manta" className="w-8 h-8 mr-3" />
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
              <Icon
                onClick={() => handleRemove(index)}
                name="close"
                className="absolute hidden -right-3 -top-3 group-hover:block cursor-pointer"
              />
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
