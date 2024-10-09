import {useEffect, useState} from "react";
import { useZxing } from "react-zxing";

export const BarcodeScanner = ({onSelectedCode}) => {
    const [result, setResult] = useState("");
    const [deviceId, setDeviceId] = useState("");

    useEffect(() => {
        // Enumerar las cámaras disponibles
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            const videoDevices = devices.filter((device) => device.kind === 'videoinput');

            const backCamera = videoDevices.find((device) => device.label.toLowerCase().includes('camera2 0')) || videoDevices[0];

            if (backCamera) {
                setDeviceId(backCamera.deviceId);
            }
        });
    }, []);

    const { ref } = useZxing({
        paused: !deviceId,
        deviceId: deviceId,
        onDecodeResult(result) {
            setResult(result.getText());
        },
    });

    return (
        <>
            {/*<p>{JSON.stringify(videoDevices, null, 4)}</p>*/}
            {deviceId ? (
                // <video ref={ref} style={{ width: '100%' }} />
                <video ref={ref} height={400}  className={'form-control'} />
            ) : (
                <p>Cargando cámara...</p>
            )}
            <p>
                <span>Detected code:</span>
                <span>{result}</span>
                <br/>
                <button className={'btn btn-sm btn-info'} type={'button'} onClick={() => onSelectedCode(result)}>Use
                    code
                </button>
            </p>
        </>
    );
};
