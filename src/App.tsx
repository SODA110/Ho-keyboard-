// This application is fully client-side and does not require any API key for its functionality.
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { keyboardLayout, englishKeyboardLayout, specialCharsLayout, KeyData, emojiMap, hoCharacters } from './constants/keyboardLayout';

const App: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [isShiftOn, setIsShiftOn] = useState<boolean>(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState<boolean>(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [keyboardView, setKeyboardView] = useState<'text' | 'emoji' | 'special'>('text');
  const [keyboardMode, setKeyboardMode] = useState<'warang' | 'english'>('warang');
  const [hoChar, setHoChar] = useState<string>(hoCharacters[0]);
  const [specialChar, setSpecialChar] = useState<string>(hoCharacters[0]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [preview, setPreview] = useState<{ char: string; top: number; left: number; isEmoji: boolean; } | null>(null);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spacebarLongPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ignoreClick = useRef(false);
  const ignoreSpacebarClick = useRef(false);

  const baseLayout = keyboardMode === 'warang' ? keyboardLayout : englishKeyboardLayout;
  const currentLayout = keyboardView === 'special' ? specialCharsLayout : baseLayout;

  const handleKeyPress = useCallback((key: KeyData) => {
    if (!key || !key.key) return;

    textAreaRef.current?.focus();

    switch (key.code) {
      case 'Backspace':
      case 'Delete':
        setText((prev) => {
          const charArray = Array.from(prev);
          charArray.pop();
          return charArray.join('');
        });
        break;
      case 'CapsLock':
        if (keyboardView === 'special') {
          setIsShiftOn(prev => !prev);
        } else {
          setIsCapsLockOn((prev) => !prev);
          setIsShiftOn(false);
        }
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        setIsShiftOn((prev) => !prev);
        break;
      case 'Space':
        setText((prev) => prev + ' ');
        break;
      case 'Enter':
        setText((prev) => prev + '\n');
        break;
      case 'Tab':
        setText((prev) => prev + '\t');
        break;
      case 'VirtualPeriod':
        setText((prev) => prev + (isCapsLockOn ? key.shiftKey : key.key));
        break;
      case 'Emoji':
        setKeyboardView(prev => {
          const newView = prev === 'emoji' ? 'text' : 'emoji';
          if (newView === 'emoji') {
            const randomIndex = Math.floor(Math.random() * hoCharacters.length);
            setHoChar(hoCharacters[randomIndex]);
          }
          return newView;
        });
        break;
      case 'Symbols':
        setKeyboardView(prev => {
          const newView = prev === 'special' ? 'text' : 'special';
          if (newView === 'special') {
            const randomIndex = Math.floor(Math.random() * hoCharacters.length);
            setSpecialChar(hoCharacters[randomIndex]);
          }
          // Reset shift state when switching to/from special chars
          setIsShiftOn(false);
          return newView;
        });
        break;
      default:
        if (key.key.trim() === '') break;

        let charToInsert;
        
        if (keyboardView === 'special') {
          charToInsert = isShiftOn ? key.shiftKey : key.key;
        } else {
          // Always output Ho characters when in text view, even in English mode
          const hoKey = keyboardLayout.flat().find(k => k.code === key.code);
          if (hoKey) {
            const showShifted = isShiftOn === isCapsLockOn;
            charToInsert = showShifted ? hoKey.shiftKey : hoKey.key;
          } else {
            charToInsert = isShiftOn ? key.shiftKey : key.key;
          }
        }
        
        setText((prev) => prev + charToInsert);

        const isPhysicalShiftHeld = pressedKeys.has('ShiftLeft') || pressedKeys.has('ShiftRight');
        if (isShiftOn && !isPhysicalShiftHeld && keyboardView !== 'special') {
          setIsShiftOn(false);
        }
        break;
    }
  }, [isShiftOn, isCapsLockOn, pressedKeys, keyboardView]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isTextInputFocused = document.activeElement === textAreaRef.current;
      
      if(e.code === 'Backspace'){ // Always allow backspace
            e.preventDefault();
            handleKeyPress({ key: '⌫', shiftKey: '⌫', code: 'Backspace' });
            return;
      }
       if(e.code === 'Enter' && isTextInputFocused) {
            return; // Allow native enter in textarea
       }
       if (e.code === 'Enter' && !isTextInputFocused) {
            e.preventDefault();
            handleKeyPress({ key: '↵', shiftKey: '↵', code: 'Enter' });
            return;
       }

      const keyData = currentLayout.flat().find((k) => k.code === e.code);
      if (!keyData || ['special', 'emoji'].includes(keyboardView)) {
        return;
      }

      e.preventDefault();
      setPressedKeys((prev) => new Set(prev).add(e.code));
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        if (!e.repeat) {
          setIsShiftOn(true);
        }
        return; 
      }
      handleKeyPress(keyData);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        setIsShiftOn(false);
      }
      setPressedKeys((prev) => {
        const newSet = new Set(prev);
        newSet.delete(e.code);
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyPress, currentLayout, keyboardView]);

  const handleEmojiPressStart = () => {
    ignoreClick.current = false;
    longPressTimer.current = setTimeout(() => {
        setDarkMode(prev => !prev);
        ignoreClick.current = true;
    }, 2000);
  };

  const handleEmojiPressEnd = () => {
    if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
    }
  };

  const handleSpacebarPressStart = () => {
    ignoreSpacebarClick.current = false;
    spacebarLongPressTimer.current = setTimeout(() => {
        setKeyboardMode(prev => {
            const newMode = prev === 'warang' ? 'english' : 'warang';
            setIsCapsLockOn(false); 
            return newMode;
        });
        ignoreSpacebarClick.current = true;
    }, 2000);
  };

  const handleSpacebarPressEnd = () => {
      if (spacebarLongPressTimer.current) {
          clearTimeout(spacebarLongPressTimer.current);
          spacebarLongPressTimer.current = null;
      }
  };


  const handleShowPreview = (key: KeyData, event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    if (key.isFnKey || key.code === 'Space') return;
    
    let char;

    if (key.code === 'VirtualPeriod') {
      char = isCapsLockOn ? key.shiftKey : key.key;
    } else if (keyboardView === 'special') {
        char = isShiftOn ? key.shiftKey : key.key;
    } else {
        // Always preview Ho characters when in text view
        const hoKey = keyboardLayout.flat().find(k => k.code === key.code);
        if (hoKey) {
          const showShifted = isShiftOn === isCapsLockOn;
          char = showShifted ? hoKey.shiftKey : hoKey.key;
        } else {
          char = isShiftOn ? key.shiftKey : key.key;
        }
    }

    const isEmojiModeActive = keyboardView === 'emoji' && !key.isFnKey;
    const unicodeEmoji = isEmojiModeActive ? emojiMap[char] : null;

    const previewChar = unicodeEmoji || char;
    if (!previewChar.trim()) return;

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    setPreview({
      char: previewChar,
      top: rect.top,
      left: rect.left + rect.width / 2,
      isEmoji: unicodeEmoji !== null,
    });
  };

  const handleHidePreview = () => {
    setPreview(null);
  };


  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-2 md:p-4 ${darkMode ? 'dark' : ''}`}>
       {preview && (
        <div
          className="key-preview visible"
          style={{ top: `${preview.top}px`, left: `${preview.left}px` }}
        >
          <span className={preview.isEmoji ? 'key-emoji-char' : (keyboardMode === 'warang' && keyboardView !== 'special' ? 'warang-citi-char' : 'english-char')}>
            {preview.char}
          </span>
        </div>
      )}
      <div className="w-full max-w-4xl mx-auto main-container">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">Warang Citi Virtual Keyboard</h1>
        <p className="text-center text-gray-600 mb-6 md:mb-8">Type using your physical keyboard or click the keys below.</p>
        
        <textarea
          id="text-input"
          ref={textAreaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-white rounded-lg shadow-inner mb-4 warang-citi-text"
          placeholder="Start typing in Ho..."
        />

        <div id="keyboard" className="pt-2 px-2 pb-4 md:pt-3 md:px-3 md:pb-6 space-y-1 md:space-y-2 flex flex-col">
          {currentLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="keyboard-row flex items-center">
              {row.map((key) => {
                if (!key.code) return null;
                
                let isCapsActive = key.code === 'CapsLock' && isCapsLockOn;
                if (keyboardView === 'special') {
                  isCapsActive = key.code === 'CapsLock' && isShiftOn;
                }
                const isActive = isCapsActive;
                const isKeyPressed = pressedKeys.has(key.code);
                const isCharKey = !key.isFnKey && key.key.trim().length > 0;
                const isEmojiKey = key.code === 'Emoji';
                const isSpaceKey = key.code === 'Space';
                const isSymbolsKey = key.code === 'Symbols';
                const isVirtualPeriodKey = key.code === 'VirtualPeriod';

                let displayChar;

                if (isVirtualPeriodKey) {
                  displayChar = isCapsLockOn ? key.shiftKey : key.key;
                } else if (keyboardView === 'special') {
                  displayChar = isShiftOn ? key.shiftKey : key.key;
                } else if (keyboardMode === 'warang') {
                  // Per user request, the display logic is inverted from the typing logic.
                  // When caps lock is off, display the "shifted" characters.
                  // When caps lock is on, display the "base" characters.
                  // The shift key inverts the current display.
                  const showShifted = isShiftOn === isCapsLockOn;
                  displayChar = (showShifted && !key.isFnKey) ? key.shiftKey : key.key;
                } else { // keyboardMode === 'english'
                  const isLetter = key.key.length === 1 && key.key.toLowerCase() !== key.key.toUpperCase();
                  let showUpperCase = isShiftOn; // Default for non-letter keys
                  if (isLetter) {
                    // Standard behavior: Caps Lock ON shows uppercase.
                    showUpperCase = isCapsLockOn !== isShiftOn;
                  }
                  displayChar = (showUpperCase && !key.isFnKey) ? key.shiftKey : key.key;
                }

                const isEmojiModeActive = keyboardView === 'emoji' && !key.isFnKey && key.code !== 'Space';
                const unicodeEmoji = isEmojiModeActive ? emojiMap[displayChar] : null;

                if (key.code !== 'Space' && !displayChar.trim() && !key.isFnKey) {
                    return <div key={key.code} className={`flex-1 ${key.size || ''}`}></div>
                }

                return (
                  <button
                    key={key.code}
                    onMouseDown={(e) => {
                      if (isEmojiKey) handleEmojiPressStart();
                      if (isSpaceKey) handleSpacebarPressStart();
                      handleShowPreview(key, e);
                    }}
                    onMouseUp={() => {
                      if (isEmojiKey) handleEmojiPressEnd();
                      if (isSpaceKey) handleSpacebarPressEnd();
                      handleHidePreview();
                    }}
                    onTouchStart={(e) => {
                      if (isEmojiKey) handleEmojiPressStart();
                      if (isSpaceKey) handleSpacebarPressStart();
                      handleShowPreview(key, e);
                    }}
                    onTouchEnd={() => {
                      if (isEmojiKey) handleEmojiPressEnd();
                      if (isSpaceKey) handleSpacebarPressEnd();
                      handleHidePreview();
                    }}
                    onMouseLeave={() => {
                      if(isSpaceKey) handleSpacebarPressEnd();
                      handleHidePreview();
                    }}
                    onClick={() => {
                      if (isEmojiKey && ignoreClick.current) return;
                      if (isSpaceKey && ignoreSpacebarClick.current) return;
                      
                      if (isEmojiModeActive && unicodeEmoji) {
                        setText(prev => prev + unicodeEmoji);
                      } else {
                        handleKeyPress(key);
                      }
                    }}
                    className={`key-button rounded-md font-medium text-center
                      ${key.size || 'flex-1'}
                      ${key.isFnKey ? 'fn-key' : ''}
                      ${keyboardMode === 'warang' && !key.isFnKey && keyboardView !== 'special' ? 'warang-citi-text' : ''}
                      ${isEmojiKey ? 'emoji-key' : ''}
                      ${isActive ? 'fn-active' : ''}
                      ${isKeyPressed ? 'key-pressed' : ''}
                    `}
                    aria-label={key.key}
                  >
                    {unicodeEmoji ? (
                      <span className="key-emoji-char">{unicodeEmoji}</span>
                    ) : isEmojiKey ? (
                        keyboardView === 'text' ? (
                          <span className="key-emoji-char">😀</span>
                        ) : (
                          <span className="warang-citi-char">{hoChar}</span>
                        )
                    ) : isSymbolsKey ? (
                        keyboardView !== 'special' ? (
                            <span className="english-char font-bold">?123</span>
                        ) : (
                            <span className={keyboardMode === 'warang' ? 'warang-citi-char' : 'english-char font-bold'}>
                                {keyboardMode === 'warang' ? specialChar : 'ABC'}
                            </span>
                        )
                    ) : (
                      <span className={isCharKey ? (keyboardMode === 'warang' && keyboardView !== 'special' ? 'warang-citi-char' : 'english-char') : ''}>
                        {isSpaceKey ? (keyboardMode === 'warang' ? 'Space' : 'EN | Space') : displayChar}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
