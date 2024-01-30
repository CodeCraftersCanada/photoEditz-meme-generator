
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSmile,
  faThumbsUp,
  faSadCry,
  faLaugh,
  faBold,
  faItalic,
  faUnderline,
  faUpload
} from '@fortawesome/free-solid-svg-icons';
import { SketchPicker } from 'react-color';
import './MemeGenerator.css';

const MemeGenerator = () => {
  const [memes, setMemes] = useState([]);
  const [selectedMeme, setSelectedMeme] = useState(null);
  const [topText, setTopText] = useState('');
  const [topTextPosition, setTopTextPosition] = useState({ top: 50, left: 50 });
  const [isDraggingTop, setIsDraggingTop] = useState(false);
  const [topTextColor, setTopTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(48);
  const [fontStyle, setFontStyle] = useState('Impact');
  const dragStartPointTop = useRef({ x: 0, y: 0 });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const dragStartPointImage = useRef({ x: 0, y: 0 });
  const [uploadedImagePosition, setUploadedImagePosition] = useState({ top: 50, left: 50 });


  useEffect(() => {
    axios.get('https://api.imgflip.com/get_memes')
      .then(response => {
        setMemes(response.data.data.memes);
      })
      .catch(error => console.error(error));
  }, []);

  const getRandomMeme = () => {
    const randomIndex = Math.floor(Math.random() * memes.length);
    setSelectedMeme(memes[randomIndex]);
    setTopText('');
    setTopTextPosition({ top: 50, left: 50 });
    setTopTextColor('#ffffff');
    setFontSize(48);
    setFontStyle('Impact'); // Reset font style to default
  };

  const handleMouseDownTop = (e) => {
    setIsDraggingTop(true);
    dragStartPointTop.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMoveTop = (e) => {
    if (isDraggingTop) {
      const deltaX = e.clientX - dragStartPointTop.current.x;
      const deltaY = e.clientY - dragStartPointTop.current.y;

      setTopTextPosition((prevPosition) => ({
        top: prevPosition.top + deltaY,
        left: prevPosition.left + deltaX,
      }));

      dragStartPointTop.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUpTop = () => {
    setIsDraggingTop(false);
  };

  const handleInputChange = (e) => {
    const inputText = e.target.value;
    setTopText(inputText);

    if (inputText.trim() !== '') {
      setTopTextPosition({ top: 50, left: 50 });
    }
  };

  const increaseFontSize = () => {
    setFontSize((prevSize) => prevSize + 2);
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => Math.max(12, prevSize - 2));
  };

  const changeFontStyle = (selectedStyle) => {
    setFontStyle(selectedStyle);
  };

  const handleEmojiSelect = (emoji) => {
    // Get the native emoji character from the selected emoji
    const emojiCharacter = emoji?.native;

    if (emojiCharacter) {
      // Add the native emoji to the input text
      setTopText((prevText) => prevText + ' ' + emojiCharacter);
    } else {
      console.error('Selected emoji is undefined');
    }
  };

  const handleColorButtonClick = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleColorChange = (color) => {
    setTopTextColor(color.hex);
    setShowColorPicker(false); // Close the color picker after selection
  };

  const toggleBold = () => {
    setIsBold(!isBold);
  };

  const toggleItalic = () => {
    setIsItalic(!isItalic);
  };

  const toggleUnderline = () => {
    setIsUnderline(!isUnderline);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);

      // Create a new Image element
      const img = new Image();

      // Set the crossOrigin attribute to anonymous
      img.crossOrigin = "anonymous";

      img.onload = () => {
        setUploadedImage(img.src);
      };

      img.src = imageUrl;
    }
  };


  const handleMouseDownImage = (e) => {
    setIsDraggingImage(true);
    dragStartPointImage.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMoveImage = (e) => {
    if (isDraggingImage) {
      const deltaX = e.clientX - dragStartPointImage.current.x;
      const deltaY = e.clientY - dragStartPointImage.current.y;

      setUploadedImagePosition((prevPosition) => ({
        top: prevPosition.top + deltaY,
        left: prevPosition.left + deltaX,
      }));

      dragStartPointImage.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUpImage = () => {
    setIsDraggingImage(false);
  };

  const handleDownload = () => {
    // Create a canvas element to draw the edited meme
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Load the selected meme image
    const memeImage = new Image();
    memeImage.crossOrigin = 'anonymous'; // Enable cross-origin resource sharing
    memeImage.src = selectedMeme.url;

    memeImage.onload = () => {
      // Set canvas size to match the meme image size
      canvas.width = memeImage.width;
      canvas.height = memeImage.height;

      // Draw the meme image on the canvas
      context.drawImage(memeImage, 0, 0);

      // Load the uploaded image
      const uploadedImageElement = new Image();
      uploadedImageElement.crossOrigin = 'anonymous'; // Enable cross-origin resource sharing
      uploadedImageElement.src = uploadedImage;

      console.log(uploadedImagePosition.top);
      console.log(uploadedImagePosition.left);

      uploadedImageElement.onload = () => {
        // Calculate absolute pixel positions for uploaded image and text
        const uploadedImageX = (uploadedImagePosition.left / 100) * canvas.width - (uploadedImageElement.width / 2);
        const uploadedImageY = (uploadedImagePosition.top / 100) * canvas.height - (uploadedImageElement.height / 2);

        const textX = (topTextPosition.left / 100) * canvas.width;
        const textY = (topTextPosition.top / 100) * canvas.height;

        // Draw the uploaded image on the canvas
        context.drawImage(uploadedImageElement, uploadedImageX, uploadedImageY);

        // Draw the edited text on the canvas
        context.font = `${fontSize}px ${fontStyle}`;
        context.fillStyle = topTextColor;
        context.fontWeight = isBold ? 'bold' : 'normal';
        context.fontStyle = isItalic ? 'italic' : 'normal';
        context.textDecoration = isUnderline ? 'underline' : 'none';
        context.textAlign = 'center';
        context.fillText(topText, textX, textY);

        // Convert the canvas content to a data URL
        const dataUrl = canvas.toDataURL('image/png');

        // Create a link element and trigger a download
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'edited_meme.png';
        link.click();
      };
    };
  };

  return (
    <div
      className="meme-generator-container"
      onMouseMove={(e) => {
        handleMouseMoveTop(e);
        handleMouseMoveImage(e); // Handle movement for the uploaded image
      }}
      onMouseUp={() => {
        handleMouseUpTop();
        handleMouseUpImage(); // Handle release for the uploaded image
      }}
    >
      <h1>Meme Generator</h1>
      <button className="random-button" onClick={getRandomMeme}>Get Random Meme</button>
      {selectedMeme && (
        <div className="meme-display-container">
          <div className="meme-image-container">
            <img
              src={selectedMeme.url}
              alt={selectedMeme.name}
            />
            {uploadedImage && (
              <img
                src={uploadedImage}
                alt="Uploaded Image"
                style={{
                  position: 'absolute',
                  top: `${uploadedImagePosition.top}%`,
                  left: `${uploadedImagePosition.left}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onMouseDown={handleMouseDownImage}
              />
            )}
            <div
              className="top-text"
              style={{
                top: `${topTextPosition.top}%`,
                left: `${topTextPosition.left}%`,
                color: topTextColor,
                fontSize: `${fontSize}px`,
                fontFamily: fontStyle,
                fontWeight: isBold ? 'bold' : 'normal',
                fontStyle: isItalic ? 'italic' : 'normal',
                textDecoration: isUnderline ? 'underline' : 'none',
              }}
              onMouseDown={handleMouseDownTop}
            >
              {topText}
            </div>
          </div>
          <div className="text-input-container">
            <div className="text-format-buttons">
              <label htmlFor="upload-input" className="upload-label">
                <FontAwesomeIcon icon={faUpload} />
                Upload Picture
              </label>
              <input
                type="file"
                id="upload-input"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
            <div>
              <label className="label-text-color">TEXT:</label>
              <input
                type="text"
                value={topText}
                onChange={handleInputChange}
                style={{
                  fontWeight: isBold ? 'bold' : 'normal',
                  fontStyle: isItalic ? 'italic' : 'normal',
                  textDecoration: isUnderline ? 'underline' : 'none',
                }}
              />
              <div className="text-format-buttons">
                <button onClick={toggleBold}>
                  <FontAwesomeIcon icon={faBold} />
                </button>
                <button onClick={toggleItalic}>
                  <FontAwesomeIcon icon={faItalic} />
                </button>
                <button onClick={toggleUnderline}>
                  <FontAwesomeIcon icon={faUnderline} />
                </button>
              </div>
              <div className="emoji-buttons">
                <button onClick={() => handleEmojiSelect({ native: '😊' })}>
                  <FontAwesomeIcon icon={faSmile} />
                </button>
                <button onClick={() => handleEmojiSelect({ native: '😂' })}>
                  <FontAwesomeIcon icon={faLaugh} />
                </button>
                <button onClick={() => handleEmojiSelect({ native: '👍' })}>
                  <FontAwesomeIcon icon={faThumbsUp} />
                </button>
                <button onClick={() => handleEmojiSelect({ native: '😢' })}>
                  <FontAwesomeIcon icon={faSadCry} />
                </button>
              </div>
            </div>
            <div>
              <label className="label-text-color">Text Color:</label>
              <div className="color-picker-container">
                <button className="color-picker-button" onClick={handleColorButtonClick}>
                  <span className="color-preview" style={{ backgroundColor: topTextColor }}></span>
                </button>
                {showColorPicker && (
                  <SketchPicker color={topTextColor} onChange={handleColorChange} />
                )}
              </div>
            </div>
            <div>
              <label className="label-text-color">Font Size:</label>
              <button className="increase-font" onClick={increaseFontSize}><i className="fas fa-plus"></i></button>
              <button className="decrease-font" onClick={decreaseFontSize}><i className="fas fa-minus"></i></button>
            </div>
            <div>
              <label className="label-text-color">Font Style:</label>
              <select className="random-button" value={fontStyle} onChange={(e) => changeFontStyle(e.target.value)}>
                <option value="Arial">Arial</option>
                <option value="Calibri">Calibri</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Impact">Impact</option>
                <option value="Lucida Sans Unicode">Lucida Sans Unicode</option>
                <option value="Palatino Linotype">Palatino Linotype</option>
                <option value="Tahoma">Tahoma</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Verdana">Verdana</option>
              </select>
            </div>
            <div>
              <button className="download-button" onClick={handleDownload}>
                Download Meme
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemeGenerator;
