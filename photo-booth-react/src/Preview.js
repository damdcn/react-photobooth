import cx from "classnames";
import {CountdownCircleTimer} from "react-countdown-circle-timer";
import Button from "./Button";
import {QRCodeSVG} from 'qrcode.react';
import config from "./config";

const Preview = (props) => {

    const {
        show,
        photo,
        timeout,
        closeFn,
        reload,
        filename
    } = props;

    return (
        <>
            <div className={cx('result ', {
                'hasPhoto': show
            })}>
                {/* IMAGE PREVIEW */}
                <canvas ref={photo}/>

                {/* COUNTDOWN TIMOUT */}
                <CountdownCircleTimer
                    isPlaying
                    key={reload}
                    size={120}
                    duration={timeout}
                    colors={'#ff3c3c'}
                />

                {/* CLOSE PREVIEW BTN */}
                <Button
                    onClick={closeFn}
                    className="close"
                    label="X"
                />

                {/* QR CODE */}
                <div className="qr-prev">
                    <QRCodeSVG value={`${config.API.dev}/image/${filename}`}/>
                    <span>Scanner pour télécharger</span>
                </div>
            </div>
        </>
    )
}

export default Preview;