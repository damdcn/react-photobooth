import React, {useRef, useEffect, useCallback, useState} from 'react';
import Jimp from "jimp";
import Flash from "./Flash";
import Button from "./Button";
import Preview from "./Preview";
import config from "./config";
import axios from "axios";
const cx = require('classnames');

function App() {

    const videoRef = useRef(null);
    const photoRef = useRef(null);

    const [hasPhoto, setHasPhoto] = useState(false);
    const [photoName, setPhotoName] = useState('');
    const [counter, setCounter] = useState(0);
    const [updateCounter, setUpdateCounter] = useState(0);
    const [flash, setFlash] = useState(false);
    const [loading, setLoading] = useState(false);
    const [delay,] = useState(config.time.delay);
    const [timeout,] = useState(config.time.timeout);
    let sTimeout;

    /* LOAD CAMERA STREAM INTO CANVAS */
    const getVideo = useCallback(() => {
        navigator.mediaDevices
            .getUserMedia({
                video: {width: 1920, height: 1080}
            })
            .then((stream) => {
                let video = videoRef.current;
                video.srcObject = stream;
                video.play();
            })
            .catch((err) => {
                console.log(err);
            })
    }, [videoRef]);

    /* SEND IMAGE TO SERVER */
    const uploadImage = useCallback((image) => {
        const formData = new FormData();
        formData.append('imageb', image);
        axios({
            method: "post",
            url: `${config.API.dev}/upload_base64`,
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(function (response) {
                setPhotoName(response.data.filename || null)
            })
            .catch(function (response) {
                console.log(response);
            });
    }, [])

    /* CLOSE PREVIEW */
    const closePhoto = useCallback(() => {
        let photo = photoRef.current;
        let ctx = photo.getContext('2d');

        clearTimeout(sTimeout);
        setHasPhoto(false);
        setTimeout(() => {
            ctx.clearRect(0, 0, photo.width, photo.height);
        }, 2000)
    }, [sTimeout]);

    /* TAKE PHOTO AND OPEN PREVIEW */
    const takeLayoutPhoto = async () => {
        const layout = await Jimp.read(process.env.PUBLIC_URL + '/images/photobooth-layout.png');

        // final image size
        const width = 1600;
        const height = 1080;

        let video = videoRef.current;
        let photo = photoRef.current;

        photo.width = width;
        photo.height = height;

        // set current frame in canvas (no process)
        let ctx = photo.getContext('2d');
        //UtilsTools.flash();
        ctx.drawImage(video, 0, 0, width, height);

        // get image from canvas
        const imageUrl = photo.toDataURL("image/png");
        // open image with Jimp
        const image = await Jimp.read(imageUrl);
        image.resize(1525, 841);

        // append image to layout
        layout.composite(image, 39, 39)

        let finalImageBase64 = await layout.getBase64Async(Jimp.MIME_PNG);

        // insert final image into canvas
        let imgTmp = new Image();
        imgTmp.onload = function () {
            ctx.drawImage(imgTmp, 0, 0, width, height);
            uploadImage(photo.toDataURL('image/jpeg'));
        }
        imgTmp.src = finalImageBase64;

        setHasPhoto(true);
    }

    /* HANDLE TAKE PHOTO CLICK */
    const handleTakePhoto = useCallback(() => {
        setLoading(true);
        setCounter(delay)
        setFlash(true)
        setTimeout(() => {
            takeLayoutPhoto().then(r => {
                setUpdateCounter((i) => i + 1)
                setFlash(false)
                setLoading(false);
                setCounter(-1)
            });
        }, delay * 1000)

        sTimeout = setTimeout(() => {
            closePhoto();
        }, delay * 1000 + timeout * 1000)


    }, [delay])

    /* UPDATE COUNTER DELAY */
    useEffect(() => {

        counter > 0 && setTimeout(() => {
            setCounter(counter - 1)
        }, 1000);
    }, [counter]);

    /* INIT CAM STREAM */
    useEffect(() => {
        getVideo();
    }, [getVideo, videoRef]);

    return (
        <div className="App">
            {/* FLASH */}
            <Flash
                show={flash}
                delay={delay * 1000}
                duration={500}
            />

            {/* CAMERA PREVIEW */}
            <div className={cx('camera', {
                'hidden': hasPhoto
            })}>
                {/* COUNTER DELAY */}
                <span className={cx('timer', {
                        'hidden': counter === -1 || counter === 0,
                        'zoom': [...Array(10).keys()].includes(counter)
                    }
                )}>
                    {counter?.toString()}
                </span>

                {/* CAMERA STREAM PREVIEW */}
                <video ref={videoRef}/>

                {/* IMAGE PREVIEW */}
                <Button
                    onClick={handleTakePhoto}
                    loading={loading}
                    className="capture"
                    label="Prendre une photo"
                />
            </div>

            {/* FINAL IMAGE PREVIEW */}
            <Preview
                show={hasPhoto}
                photo={photoRef}
                timeout={timeout}
                closeFn={closePhoto}
                reload={updateCounter}
                filename={photoName}
            />
        </div>
    );
}

export default App;
