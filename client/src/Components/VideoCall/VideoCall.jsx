import React, { useEffect, useState, useRef } from 'react';
import Peer from 'peerjs';
import './VideoCall.css';

const VideoCall = () => {
    const [peerId, setPeerId] = useState('');
    const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
    const [currentCall, setCurrentCall] = useState(null);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]);

    const myVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerInstance = useRef(null);

    useEffect(() => {
        const peer = new Peer();

        peer.on('open', (id) => {
            setPeerId(id);
        });

        peer.on('call', (call) => {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                myVideoRef.current.srcObject = stream;
                myVideoRef.current.play();
                call.answer(stream);
                call.on('stream', (remoteStream) => {
                    remoteVideoRef.current.srcObject = remoteStream;
                    remoteVideoRef.current.play();
                });
                setCurrentCall(call);
            });
        });

        peerInstance.current = peer;

        return () => {
            peer.destroy();
        }
    }, []);

    const callPeer = (remotePeerId) => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            myVideoRef.current.srcObject = stream;
            myVideoRef.current.play();

            const call = peerInstance.current.call(remotePeerId, stream);

            call.on('stream', (remoteStream) => {
                remoteVideoRef.current.srcObject = remoteStream;
                remoteVideoRef.current.play();
            });
            setCurrentCall(call);
        });
    };

    const shareScreen = () => {
        if (isScreenSharing) {
            // Stop sharing logic (would need to renegotiate or replace track - complex for basic peerjs)
            // For simplicity, we restart call or just warn.
            alert("To stop screen sharing, please end call and restart.");
            return;
        }
        navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
            const videoTrack = stream.getVideoTracks()[0];
            if (currentCall) {
                const sender = currentCall.peerConnection.getSenders().find((s) => s.track.kind === 'video');
                sender.replaceTrack(videoTrack);
                setIsScreenSharing(true);
                videoTrack.onended = () => {
                    // Handle stop sharing
                    setIsScreenSharing(false);
                    // Revert to camera? user needs to handle
                };
            }
        });
    }

    const startRecording = () => {
        const stream = myVideoRef.current.srcObject; // Record self for now, or mix streams (complex)
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => setRecordedChunks(prev => [...prev, e.data]);
        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
    }

    const stopRecording = () => {
        mediaRecorder.stop();
        setIsRecording(false);
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recording.webm';
        a.click();
        setRecordedChunks([]);
    }

    return (
        <div className="videocall_container">
            <h1>Video Call & VoIP</h1>
            <div className="peer_id_box">
                <p>My Peer ID: <span className="id_display">{peerId}</span></p>
            </div>

            <div className="call_form">
                <input
                    type="text"
                    placeholder="Enter Remote Peer ID"
                    value={remotePeerIdValue}
                    onChange={e => setRemotePeerIdValue(e.target.value)}
                />
                <button onClick={() => callPeer(remotePeerIdValue)}>Call</button>
            </div>

            <div className="video_grid">
                <div className="video_wrapper">
                    <h3>My Video</h3>
                    <video ref={myVideoRef} muted className="video_player" />
                </div>
                <div className="video_wrapper">
                    <h3>Remote Video</h3>
                    <video ref={remoteVideoRef} className="video_player" />
                </div>
            </div>

            <div className="controls">
                <button onClick={shareScreen} className="control_btn">Share Screen</button>
                {isRecording ? (
                    <button onClick={stopRecording} className="control_btn record_active">Stop Recording</button>
                ) : (
                    <button onClick={startRecording} className="control_btn">Start Recording</button>
                )}
            </div>
        </div>
    );
};

export default VideoCall;
