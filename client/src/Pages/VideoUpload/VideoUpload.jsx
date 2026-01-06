import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadVideo } from "../../actions/video";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./VideoUpload.css";

function VideoUpload({ setVidUploadPage }) {
  const CurrentUser = useSelector((state) => state.currentUserReducer);
  const videoState = useSelector((state) => state.videoReducer);
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [category, setCategory] = useState("entertainment");
  const [tags, setTags] = useState("");
  const [progress, setProgress] = useState(0);
  const [fileSizeError, setFileSizeError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE_MB = 100;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  // Available categories
  const categories = [
    { value: "entertainment", label: "🎬 Entertainment" },
    { value: "education", label: "📚 Education" },
    { value: "music", label: "🎵 Music" },
    { value: "gaming", label: "🎮 Gaming" },
    { value: "sports", label: "⚽ Sports" },
    { value: "technology", label: "💻 Technology" },
    { value: "comedy", label: "😂 Comedy" },
    { value: "lifestyle", label: "🌟 Lifestyle" },
    { value: "news", label: "📰 News" },
    { value: "howto", label: "🔧 How-to & DIY" },
    { value: "other", label: "📦 Other" }
  ];

  // Watch for upload completion
  useEffect(() => {
    if (videoState.error) {
      setUploadStatus("error");
      alert(`Upload failed: ${videoState.error}`);
      setIsUploading(false);
    } else if (videoState.lastUploadedVideo && isUploading) {
      setUploadStatus("success");
      setTimeout(() => {
        alert("✅ Video uploaded successfully!");
        setVidUploadPage(false);
      }, 1000);
    }
  }, [videoState, isUploading, setVidUploadPage]);

  const handleSetVideoFile = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);

    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const isAudio = file.type.startsWith('audio/');

    if (!isVideo && !isAudio) {
      alert(`Please select a video or audio file. Selected: ${file.name} (${file.type})`);
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setFileSizeError(`File size (${fileSizeMB}MB) exceeds ${MAX_FILE_SIZE_MB}MB limit`);
      e.target.value = "";
      setVideoFile(null);
      setFileName("");
    } else {
      setVideoFile(file);
      setFileName(file.name);
      setFileSizeError("");
      setUploadStatus("");
    }
  };

  const fileOptions = {
    onUploadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent;
      const percentage = total ? Math.round((loaded * 100) / total) : 0;
      setProgress(percentage);
      console.log(`Upload progress: ${percentage}%`);
    },
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const uploadVideoFile = async () => {
    console.log("Starting upload...");

    // Validation
    if (!title.trim()) {
      alert("Please enter a title for the video");
      return;
    }

    if (title.trim().length < 3) {
      alert("Title must be at least 3 characters long");
      return;
    }

    if (!videoFile) {
      alert("Please attach a video or audio file");
      return;
    }

    if (videoFile.size > MAX_FILE_SIZE_BYTES) {
      setFileSizeError(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit`);
      return;
    }

    if (!CurrentUser?.result?._id) {
      alert("Please sign in to upload files");
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setUploadStatus("");

    try {
      const fileData = new FormData();
      fileData.append("file", videoFile);
      fileData.append("title", title.trim());
      fileData.append("description", description.trim());
      fileData.append("category", category);
      fileData.append("tags", tags.trim());
      fileData.append("channel", CurrentUser.result._id);
      fileData.append("uploader", CurrentUser.result.name || "Anonymous");

      console.log("FormData contents:");
      for (let [key, value] of fileData.entries()) {
        console.log(`${key}:`, value instanceof File ? `${value.name} (${value.type})` : value);
      }

      // Dispatch upload action
      await dispatch(uploadVideo({ fileData, fileOptions }));

    } catch (error) {
      console.error("Upload error in component:", error);
      setUploadStatus("error");
      alert(`Upload failed: ${error.message || "Unknown error"}`);
      setIsUploading(false);
    }
  };

  // Handle ESC key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape" && !isUploading) {
        setVidUploadPage(false);
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setVidUploadPage, isUploading]);

  return (
    <div className="container_VidUpload" onClick={() => !isUploading && setVidUploadPage(false)}>
      <div className="container2_VidUpload" onClick={(e) => e.stopPropagation()}>
        <div className="vidupload_header">
          <h2>Upload Video</h2>
          <button
            className="ibtn_x"
            onClick={() => !isUploading && setVidUploadPage(false)}
            aria-label="Close upload modal"
            disabled={isUploading}
          >
            ×
          </button>
        </div>

        {uploadStatus === "error" && (
          <div className="upload-error-alert">
            <strong>Error:</strong> {videoState.error || "Upload failed"}
          </div>
        )}

        <div className="ibox_div_vidupload">
          <div className="form-group">
            <label htmlFor="title" className="form-label">Title *</label>
            <input
              id="title"
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              className="ibox_vidupload"
              maxLength={100}
              minLength={3}
              placeholder="Enter video title"
              value={title}
              disabled={isUploading}
              required
            />
            <div className="char-count">{title.length}/100</div>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              onChange={(e) => setDescription(e.target.value)}
              className="ibox_vidupload textarea_vidupload"
              maxLength={500}
              placeholder="Enter description (optional)"
              value={description}
              disabled={isUploading}
            />
            <div className="char-count">{description.length}/500</div>
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">Category *</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="ibox_vidupload"
              disabled={isUploading}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tags" className="form-label">
              Tags <small>(comma separated)</small>
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="ibox_vidupload"
              placeholder="funny, tutorial, music, gaming"
              disabled={isUploading}
            />
            <div className="hint-text">Separate tags with commas</div>
          </div>

          <div className="form-group">
            <label htmlFor="file" className="form-label">Video File *</label>
            <div className="file-upload-area">
              <input
                id="file"
                ref={fileInputRef}
                type="file"
                accept="video/*,audio/*"
                className="file-input"
                onChange={handleSetVideoFile}
                disabled={isUploading}
              />
              <div className="file-upload-preview">
                {fileName ? (
                  <>
                    <div className="file-info">
                      <div className="file-name">{fileName}</div>
                      <div className="file-size">{videoFile ? formatFileSize(videoFile.size) : ""}</div>
                      <div className="file-type">Type: {videoFile?.type || 'Unknown'}</div>
                    </div>
                    <button
                      type="button"
                      className="remove-file-btn"
                      onClick={() => {
                        setVideoFile(null);
                        setFileName("");
                        setFileSizeError("");
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      disabled={isUploading}
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon">📁</div>
                    <p>Click to select video file</p>
                    <p className="upload-hint">Max size: {MAX_FILE_SIZE_MB}MB</p>
                    <p className="upload-hint">Supports: MP4, AVI, MOV, MP3, etc.</p>
                  </div>
                )}
              </div>
              {fileSizeError && (
                <div className="error-message">{fileSizeError}</div>
              )}
            </div>
          </div>
        </div>

        <div className="ibox_div_vidupload">
          <button
            onClick={uploadVideoFile}
            className={`upload-btn ${isUploading ? 'uploading' : ''}`}
            disabled={isUploading || !title.trim() || title.length < 3 || !videoFile}
          >
            {isUploading ? `Uploading... ${progress}%` : "Upload Video"}
          </button>
        </div>

        {isUploading && (
          <div className="progress-section">
            <div className="loader">
              <CircularProgressbar
                value={progress}
                text={`${progress}%`}
                styles={buildStyles({
                  pathColor: progress === 100 ? '#4CAF50' : '#3ea6ff',
                  textColor: '#fff',
                  trailColor: '#e0e0e0',
                })}
              />
            </div>
            <div className="progress-info">
              <div className="progress-text">Uploading: {progress}%</div>
              {progress === 100 && (
                <div className="success-message">
                  {uploadStatus === "success"
                    ? "✅ Upload complete! Saving to database..."
                    : "Processing upload..."}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="upload-summary">
          <h4>Upload Summary:</h4>
          <ul>
            <li><strong>Title:</strong> {title || "Not set"}</li>
            <li><strong>Category:</strong> {categories.find(c => c.value === category)?.label || category}</li>
            <li><strong>Tags:</strong> {tags ? tags.split(',').map(t => `#${t.trim()}`).join(', ') : "No tags"}</li>
            <li><strong>File:</strong> {fileName || "No file selected"}</li>
            {videoFile && <li><strong>Size:</strong> {formatFileSize(videoFile.size)}</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default VideoUpload;