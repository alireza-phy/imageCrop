import React, { useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import demoImage from "./example.jpg";

function ImageCropper(props) {
  const { imageToCrop, onImageCropped } = props;

  const [cropConfig, setCropConfig] = useState(
    // default crop config
    {
      unit: "%",
      width: 30,
      aspect: 16 / 9,
    }
  );

  const [imageRef, setImageRef] = useState();

  async function cropImage(crop) {
    if (imageRef && crop.width && crop.height) {
      const croppedImage = await getCroppedImage(
        imageRef,
        crop,
        "croppedImage.jpeg" // destination filename
      );

      // calling the props function to expose
      // croppedImage to the parent component
      onImageCropped(croppedImage);
    }
  }

  function getCroppedImage(sourceImage, cropConfig, fileName) {
    // creating the cropped image from the source image
    const canvas = document.createElement("canvas");
    const scaleX =
      sourceImage?.target?.naturalWidth / sourceImage?.target?.width;
    const scaleY =
      sourceImage?.target?.naturalHeight / sourceImage?.target?.height;
    canvas.width = cropConfig?.width;
    canvas.height = cropConfig?.height;
    const ctx = canvas.getContext("2d");
    var image = new Image();
    image.src = sourceImage?.target?.currentSrc;

    ctx.drawImage(
      image,
      cropConfig.x * scaleX,
      cropConfig.y * scaleY,
      cropConfig.width * scaleX,
      cropConfig.height * scaleY,
      0,
      0,
      cropConfig.width,
      cropConfig.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        // returning an error
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }

        blob.name = fileName;
        // creating a Object URL representing the Blob object given
        const croppedImageUrl = window.URL.createObjectURL(blob);

        resolve(croppedImageUrl);
      }, "image/jpeg");
    });
  }

  return (
    <ReactCrop
      crop={cropConfig}
      ruleOfThirds
      onComplete={(cropConfig) => cropImage(cropConfig)}
      onChange={(cropConfig) => setCropConfig(cropConfig)}
      crossorigin="anonymous" // to avoid CORS-related problems
    >
      <img
        alt=""
        src={imageToCrop || demoImage}
        onLoad={(imageRef) => setImageRef(imageRef)}
      />
    </ReactCrop>
  );
}

ImageCropper.defaultProps = {
  onImageCropped: () => {},
};

export default ImageCropper;
