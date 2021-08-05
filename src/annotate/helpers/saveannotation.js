import { useState } from 'react';
import { v4 } from 'uuid';

function SaveAnnotation(props) {

    const [trainFileUrl, setTrainFileUrl] = useState("");
    const [trainFileName, setTrainFileName] = useState("");

    const getAnnotationLength = () => {
        let i = 0;
        for (const a of props.annot) {
            i += 1;
        }
        return i;
    }

    

    const downloadAnnotations = async () => {
        const annotations = [...props.annot];
        let j = 0;

        let frame = {};
        let pred = {};

        for (const annot of annotations) {
            for (let i = annot.startFPS; i < annot.endFPS; i++) {
                frame[j.toString()] = i;
                pred[j.toString()] = annot.displayName;
                j += 1;
              }
        }
        
        const finalAnnotation = {frame,pred}


        const trainOutput = JSON.stringify(finalAnnotation)

        const trainBlob = new Blob([trainOutput]);
        const trainFileDownloadUrl = URL.createObjectURL(trainBlob);
        setTrainFileName(`${props.videoID}_training_annotations.json`)
        await setTrainFileUrl(trainFileDownloadUrl)
        document.getElementById("train-download").click();
        URL.revokeObjectURL(trainFileDownloadUrl);
        localStorage.removeItem('annot');
        setTrainFileUrl("");
        setTrainFileName("");

        
        
    }

    return (
        <>
        {getAnnotationLength() >= 0 &&
            <div className="save-button" key={v4()}>

                <button onClick={downloadAnnotations}>Download Annotations</button>
                {props.saveAnnotate && <p>{props.saveAnnotate}</p>}
                <a id="train-download" style={{display: "none"}}
                download={trainFileName}
                href={trainFileUrl}
                >download it</a>
            </div>

        }
        </>
    )
}

export default SaveAnnotation