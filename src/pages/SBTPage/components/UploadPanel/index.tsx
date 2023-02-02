import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import * as faceapi from 'face-api.js';

import Icon from 'components/Icon';
import { Step, UploadFile, useSBT } from 'pages/SBTPage/SBTContext';
import { Gender } from 'face-api.js';

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
const MIN_CONFIDENCE = 0.6;

type DetectionResult = faceapi.WithAge<
  faceapi.WithGender<{
    detection: faceapi.FaceDetection;
  }>
>;

const UploadItem = ({
  file,
  index,
  handleRemove,
  checkInValid
}: {
  file: File;
  index: number;
  handleRemove: (index: number) => void;
  checkInValid: (index: number) => boolean;
}) => {
  const inValid = checkInValid(index);
  const inValidStyle = inValid ? '' : 'hidden group-hover:block';
  return (
    <div className="relative w-max group" key={index}>
      <img src={URL.createObjectURL(file)} className="rounded-lg w-48 h-48" />
      <Icon
        onClick={() => handleRemove(index)}
        name="close"
        className={`absolute ${inValidStyle} -right-3 -top-3  cursor-pointer`}
      />
      {inValid && (
        <Icon
          name="invalid"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
      )}
    </div>
  );
};

const UploadPanel = () => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [detectionResults, setDectionResults] = useState(
    [] as Array<DetectionResult[]>
  );
  const [errorMsg, setErrorMsg] = useState('');

  const imgContainer = useRef<HTMLDivElement>(null);

  const { setCurrentStep, imgList, setImgList, setThemeGender } = useSBT();

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ageGenderNet.load(MODEL_URL)
      ]);
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (!imgList.length || !imgContainer?.current || !modelsLoaded) {
      return;
    }
    const detectFaces = async () => {
      const imgEls = [
        ...(imgContainer?.current?.querySelectorAll('img') ?? [])
      ];
      const options = new faceapi.SsdMobilenetv1Options({
        minConfidence: MIN_CONFIDENCE
      });

      const detectionPromises = [] as any[];
      imgEls.forEach((imgEl) => {
        detectionPromises.push(
          faceapi.detectAllFaces(imgEl, options).withAgeAndGender()
        );
      });
      const detectionResults: Array<DetectionResult[]> = await Promise.all(
        detectionPromises
      );

      setDectionResults(detectionResults);
    };
    detectFaces();
  }, [imgList, modelsLoaded]);

  const toThemePage = async () => {
    let femaleAmount = 0;
    detectionResults.forEach((delectionResult) => {
      const ret = delectionResult[0];
      if (ret.gender === Gender.FEMALE) {
        femaleAmount++;
      }
    });
    if (femaleAmount > detectionResults.length / 2) {
      setThemeGender(Gender.FEMALE);
    }

    setCurrentStep(Step.Theme);
  };

  const handleRemove = (index: number) => {
    const newArr = [...imgList];
    newArr.splice(index, 1);
    setImgList(newArr);

    const newDetectionResults = [...detectionResults];
    newDetectionResults.splice(index, 1);
    setDectionResults(newDetectionResults);
  };
  const btnDisabled = useMemo(() => {
    return (
      imgList.length < MIN_UPLOAD_LEN ||
      imgList.length > MAX_UPLOAD_LEN ||
      !!errorMsg
    );
  }, [imgList, errorMsg]);

  const checkInValid = useCallback(
    (index: number) => {
      if (!modelsLoaded || !detectionResults.length) {
        return false;
      }
      const detectionResult = detectionResults[index];

      return (
        !detectionResult ||
        !detectionResult.length ||
        detectionResult?.length > 1 ||
        detectionResult[0]?.detection?.score < MIN_CONFIDENCE
      );
    },
    [detectionResults, modelsLoaded]
  );

  useEffect(() => {
    for (let i = 0; i < detectionResults.length; i++) {
      const inValid = checkInValid(i);
      if (inValid) {
        setErrorMsg(
          'You have at least one invalid picture uploaded (we cannot detect a face). Please remove it in order to proceed.'
        );
        return;
      }
    }
    setErrorMsg('');
  }, [checkInValid, detectionResults, errorMsg]);

  const disabledStyle = btnDisabled ? 'brightness-50 cursor-not-allowed' : '';

  return (
    <div className="flex-1 flex flex-col mx-auto mb-32 bg-secondary rounded-xl p-6 w-75 relative">
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
      {errorMsg && (
        <p className="absolute flex top-48 text-error">
          <Icon name="information" className="mr-2" />
          {errorMsg}
        </p>
      )}
      <div
        className="grid w-full gap-6 grid-cols-5 pb-16 pt-4 mt-9 max-h-120 overflow-y-auto"
        ref={imgContainer}>
        {imgList?.map(({ file }, index) => {
          return (
            <UploadItem
              file={file}
              index={index}
              key={index}
              handleRemove={handleRemove}
              checkInValid={checkInValid}
            />
          );
        })}
        <Upload />
      </div>
      <button
        onClick={toThemePage}
        disabled={btnDisabled}
        className={`absolute px-36 py-2 unselectable-text text-center text-white rounded-lg gradient-button filter bottom-4 left-1/2 -translate-x-1/2 transform ${disabledStyle}`}>
        Confirm
      </button>
    </div>
  );
};

export default UploadPanel;
