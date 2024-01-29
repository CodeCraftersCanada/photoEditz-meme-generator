// src/components/MemeGenerator.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile, faThumbsUp, faSadCry, faLaugh } from '@fortawesome/free-solid-svg-icons';
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
  const [fontStyle, setFontStyle] = useState('Impact'); // Default font style is 'Impact'
  const dragStartPointTop = useRef({ x: 0, y: 0 });
  const [showColorPicker, setShowColorPicker] = useState(false);

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


  return (
    <div
      className="meme-generator-container"
      onMouseMove={(e) => handleMouseMoveTop(e)}
      onMouseUp={handleMouseUpTop}
    >
      <h1>Meme Generator</h1>
      <button className="random-button" onClick={getRandomMeme}>Get Random Meme</button>
      {selectedMeme && (
        <div className="meme-display-container">
          <div className="meme-image-container">
            <img src={selectedMeme.url} alt={selectedMeme.name} />
            <div
              className="top-text"
              style={{
                top: `${topTextPosition.top}%`,
                left: `${topTextPosition.left}%`,
                color: topTextColor,
                fontSize: `${fontSize}px`,
                fontFamily: fontStyle,
              }}
              onMouseDown={handleMouseDownTop}
            >
              {topText}
            </div>
          </div>
          <div className="text-input-container">
            <div>
              <label>Top Text:</label>
              <input type="text" value={topText} onChange={handleInputChange} />
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
              <label>Text Color:</label>
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
              <label>Font Size:</label>
              <button className="increase-font" onClick={increaseFontSize}><i className="fas fa-plus"></i></button>
              <button className="decrease-font" onClick={decreaseFontSize}><i className="fas fa-minus"></i></button>
            </div>
            <div>
              <label>Font Style:</label>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default MemeGenerator;
