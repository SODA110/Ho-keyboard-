// This application is fully client-side and does not require any API key for its functionality.
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
  const [inputMode, setInputMode] = useState<'text' | 'none'>('text');

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spacebarLongPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ignoreClick = useRef(false);
  const ignoreSpacebarClick = useRef(false);

  const baseLayout = keyboardMode === 'warang' ? keyboardLayout : englishKeyboardLayout;
  const currentLayout = keyboardView === 'special' ? specialCharsLayout : baseLayout;

  // Comprehensive English -> Ho map for absolute reliability
  const charMap = useMemo(() => {
    const map: Record<string, string> = {
      'q': '𑢠', 'w': '𑢢', 'e': '𑢨', 'r': '𑢼', 't': '𑢵', 'y': '𑢣', 'u': '𑢧', 'i': '𑢦', 'o': '𑢩', 'p': '𑢸',
      'a': '𑢡', 's': '𑢾', 'd': '𑢴', 'f': '𑢫', 'g': '𑢰', 'h': '𑢳', 'j': '𑢮', 'k': '𑢬', 'l': '𑢺',
      'z': '𑢽', 'x': '𑢭', 'c': '𑢯', 'v': '𑢿', 'b': '𑢷', 'n': '𑢱', 'm': '𑢶',
      'Q': '𑣀', 'W': '𑣂', 'E': '𑣈', 'R': '𑣜', 'T': '𑣕', 'Y': '𑣃', 'U': '𑣇', 'I': '𑣆', 'O': '𑣉', 'P': '𑣘',
      'A': '𑣁', 'S': '𑣞', 'D': '𑣔', 'F': '𑣋', 'G': '𑣐', 'H': '𑣓', 'J': '𑣎', 'K': '𑣌', 'L': '𑣚',
      'Z': '𑣝', 'X': '𑣍', 'C': '𑣏', 'V': '𑣟', 'B': '𑣗', 'N': '𑣑', 'M': '𑣖',
      '[': '𑢤', ']': '𑢥', '{': '𑣄', '}': '𑣅', ';': '𑢪', ':': '𑣊', "'": '𑢲', '"': '𑣒',
      ',': '𑢹', '<': '𑢹', '.': '𑢻', '>': '𑢻', '/': '𑣛', '?': '𑣛',
      '1': '𑣡', '2': '𑣢', '3': '𑣣', '4': '𑣤', '5': '𑣥', '6': '𑣦', '7': '𑣧', '8': '𑣨', '9': '𑣩', '0': '𑣠',
      '!': '𑣪', '@': '𑣫', '#': '𑣬', '$': '𑣭', '%': '𑣮', '^': '𑣯', '&': '𑣰', '*': '𑣱', '(': '𑣲', ')': '𑣠',
      '`': '𑣿', '~': '𑣿'
    };
    return map;
  }, []);

  const transformToHo = useCallback((input: string) => {
    if (keyboardMode !== 'warang' || keyboardView !== 'text') return input;
    let result = '';
    // Use Array.from to correctly iterate over surrogate pairs if they exist
    for (const char of Array.from(input)) {
      result += charMap[char] || char;
    }
    return result;
  }, [keyboardMode, keyboardView, charMap]);

  const updateText = useCallback((operation: 'insert' | 'delete', value: string = '') => {
    const textarea = textAreaRef.current;
    if (!textarea) {
      if (operation === 'insert') setText(prev => prev + transformToHo(value));
      return;
    }

    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const currentText = textarea.value;

    let newText = '';
    let newCursorPos = start;

    if (operation === 'insert') {
      const transformedValue = transformToHo(value);
      newText = currentText.substring(0, start) + transformedValue + currentText.substring(end);
      newCursorPos = start + transformedValue.length;
    } else if (operation === 'delete') {
      if (start !== end) {
        newText = currentText.substring(0, start) + currentText.substring(end);
        newCursorPos = start;
      } else {
        if (start === 0) return;
        const charBefore = currentText.charCodeAt(start - 1);
        const isLowSurrogate = charBefore >= 0xDC00 && charBefore <= 0xDFFF;
        const deleteCount = isLowSurrogate ? 2 : 1;
        newText = currentText.substring(0, start - deleteCount) + currentText.substring(end);
        newCursorPos = start - deleteCount;
      }
    }

    setText(newText);
    
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  }, [transformToHo]);

  const handleKeyPress = useCallback((key: KeyData) => {
    if (!key || !key.key) return;
    textAreaRef.current?.focus();

    switch (key.code) {
      case 'Backspace':
      case 'Delete':
        updateText('delete');
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
        updateText('insert', ' ');
        break;
      case 'Enter':
        updateText('insert', '\n');
        break;
      case 'Tab':
        updateText('insert', '\t');
        break;
      case 'VirtualPeriod':
        updateText('insert', isCapsLockOn ? key.shiftKey : key.key);
        break;
      case 'Emoji':
        setKeyboardView(prev => (prev === 'emoji' ? 'text' : 'emoji'));
        break;
      case 'Symbols':
        setKeyboardView(prev => (prev === 'special' ? 'text' : 'special'));
        setIsShiftOn(false);
        break;
      default:
        if (key.key.trim() === '') break;
        let charToInsert;
        if (keyboardView === 'special') {
          charToInsert = isShiftOn ? key.shiftKey : key.key;
        } else {
          const hoKey = keyboardLayout.flat().find(k => k.code === key.code);
          const showShifted = isShiftOn === isCapsLockOn;
          charToInsert = hoKey ? (showShifted ? hoKey.shiftKey : hoKey.key) : (isShiftOn ? key.shiftKey : key.key);
        }
        updateText('insert', charToInsert);
        if (isShiftOn && !pressedKeys.has('ShiftLeft') && !pressedKeys.has('ShiftRight') && keyboardView !== 'special') {
          setIsShiftOn(false);
        }
        break;
    }
  }, [isShiftOn, isCapsLockOn, pressedKeys, keyboardView, updateText]);

  // Aggressive sanitization for the text state
  useEffect(() => {
    if (keyboardMode === 'warang' && keyboardView === 'text') {
      const transformed = transformToHo(text);
      if (transformed !== text) {
        // We need to preserve cursor position if this was triggered by an input change
        const textarea = textAreaRef.current;
        if (textarea) {
          const start = textarea.selectionStart || 0;
          const end = textarea.selectionEnd || 0;
          // Estimate new position (this is tricky with surrogate pairs)
          // For simplicity, we'll just set the text and let the onChange handle the cursor if possible
          setText(transformed);
        } else {
          setText(transformed);
        }
      }
    }
  }, [text, keyboardMode, keyboardView, transformToHo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (keyboardMode === 'warang' && keyboardView === 'text') {
      const transformed = transformToHo(val);
      if (transformed !== val) {
        const start = e.target.selectionStart || 0;
        const end = e.target.selectionEnd || 0;
        // Calculate the difference in length to adjust cursor
        const diff = transformed.length - val.length;
        const newStart = start + diff;
        const newEnd = end + diff;
        
        setText(transformed);
        setTimeout(() => {
          if (textAreaRef.current) {
            textAreaRef.current.setSelectionRange(newStart, newEnd);
          }
        }, 0);
        return;
      }
    }
    setText(val);
  };

  const handleBeforeInput = useCallback((e: React.FormEvent<HTMLTextAreaElement>) => {
    const inputEvent = e.nativeEvent as InputEvent;
    if (keyboardMode !== 'warang' || keyboardView !== 'text') return;

    // Intercept almost all text insertion types
    if (inputEvent.data && (inputEvent.inputType === 'insertText' || inputEvent.inputType === 'insertCompositionText')) {
      e.preventDefault();
      updateText('insert', inputEvent.data);
    }
  }, [keyboardMode, keyboardView, updateText]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isTextInputFocused = document.activeElement === textAreaRef.current;
      if (e.ctrlKey || e.metaKey) return; 

      if(e.code === 'Backspace'){
        e.preventDefault();
        handleKeyPress({ key: '⌫', shiftKey: '⌫', code: 'Backspace' });
        return;
      }

      const keyData = currentLayout.flat().find((k) => k.code === e.code);
      
      if (e.code === 'CapsLock') {
        e.preventDefault();
        handleKeyPress(keyData);
        return;
      }

      if (isTextInputFocused && e.code && !['ShiftLeft', 'ShiftRight', 'CapsLock', 'Tab', 'Space', 'Enter'].includes(e.code)) {
        if (keyboardMode === 'warang' && keyboardView === 'text') {
          e.preventDefault();
          if (keyData) handleKeyPress(keyData);
        }
      }

      if (!keyData) return;
      setPressedKeys((prev) => new Set(prev).add(e.code));
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        setIsShiftOn(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') setIsShiftOn(false);
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
  }, [handleKeyPress, currentLayout, keyboardMode, keyboardView]);

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
        setKeyboardMode(prev => (prev === 'warang' ? 'english' : 'warang'));
        ignoreSpacebarClick.current = true;
    }, 2000);
  };

  const handleSpacebarPressEnd = () => {
      if (spacebarLongPressTimer.current) {
          clearTimeout(spacebarLongPressTimer.current);
          spacebarLongPressTimer.current = null;
      }
  };

  const handleShowPreview = (key: KeyData, event: any) => {
    if (key.isFnKey || key.code === 'Space') return;
    let char;
    if (key.code === 'VirtualPeriod') {
      char = isCapsLockOn ? key.shiftKey : key.key;
    } else if (keyboardView === 'special') {
      char = isShiftOn ? key.shiftKey : key.key;
    } else {
      const hoKey = keyboardLayout.flat().find(k => k.code === key.code);
      const showShifted = isShiftOn === isCapsLockOn;
      char = hoKey ? (showShifted ? hoKey.shiftKey : hoKey.key) : (isShiftOn ? key.shiftKey : key.key);
    }
    const unicodeEmoji = (keyboardView === 'emoji' && !key.isFnKey) ? emojiMap[char] : null;
    const previewChar = unicodeEmoji || char;
    if (!previewChar.trim()) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setPreview({ char: previewChar, top: rect.top, left: rect.left + rect.width / 2, isEmoji: unicodeEmoji !== null });
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-2 md:p-4 ${darkMode ? 'dark' : ''}`}>
       {preview && (
        <div className="key-preview visible" style={{ top: `${preview.top}px`, left: `${preview.left}px` }}>
          <span className={preview.isEmoji ? 'key-emoji-char' : (keyboardMode === 'warang' && keyboardView !== 'special' ? 'warang-citi-char' : 'english-char')}>
            {preview.char}
          </span>
        </div>
      )}
      <div className="w-full max-w-4xl mx-auto main-container">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">Warang Citi Virtual Keyboard</h1>
        <div className="flex justify-between items-center mb-4 px-1">
          <p className="text-gray-600 text-sm md:text-base">Type using your keyboard or click the keys below.</p>
          <button 
            onClick={() => setInputMode(prev => prev === 'text' ? 'none' : 'text')}
            className={`p-2 rounded-lg transition-all shadow-sm flex items-center justify-center ${inputMode === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
            style={{ width: '44px', height: '44px' }}
          >
            <span className="text-2xl">⌨️</span>
          </button>
        </div>
        
        <textarea
          id="text-input"
          ref={textAreaRef}
          value={text}
          onChange={handleInputChange}
          onBeforeInput={handleBeforeInput}
          inputMode={inputMode as any}
          autoCorrect="off" autoCapitalize="off" spellCheck="false"
          className="w-full bg-white rounded-lg shadow-inner mb-4 warang-citi-text"
          placeholder="Start typing in Ho..."
        />

        <div id="keyboard" className="pt-2 px-2 pb-4 md:pt-3 md:px-3 md:pb-6 space-y-1 md:space-y-2 flex flex-col">
          {currentLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="keyboard-row flex items-center">
              {row.map((key) => {
                if (!key.code) return null;
                const isCapsActive = (key.code === 'CapsLock' && (keyboardView === 'special' ? isShiftOn : isCapsLockOn));
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
                  const showShifted = isShiftOn === isCapsLockOn;
                  displayChar = (showShifted && !key.isFnKey) ? key.shiftKey : key.key;
                } else {
                  const isLetter = key.key.length === 1 && key.key.toLowerCase() !== key.key.toUpperCase();
                  const showUpperCase = isLetter ? (isCapsLockOn !== isShiftOn) : isShiftOn;
                  displayChar = (showUpperCase && !key.isFnKey) ? key.shiftKey : key.key;
                }

                const unicodeEmoji = (keyboardView === 'emoji' && !key.isFnKey && key.code !== 'Space') ? emojiMap[displayChar] : null;
                if (key.code !== 'Space' && !displayChar.trim() && !key.isFnKey) return <div key={key.code} className={`flex-1 ${key.size || ''}`}></div>

                return (
                  <button
                    key={key.code}
                    onMouseDown={(e) => { if (isEmojiKey) handleEmojiPressStart(); if (isSpaceKey) handleSpacebarPressStart(); handleShowPreview(key, e); }}
                    onMouseUp={() => { if (isEmojiKey) handleEmojiPressEnd(); if (isSpaceKey) handleSpacebarPressEnd(); setPreview(null); }}
                    onTouchStart={(e) => { if (isEmojiKey) handleEmojiPressStart(); if (isSpaceKey) handleSpacebarPressStart(); handleShowPreview(key, e); }}
                    onTouchEnd={() => { if (isEmojiKey) handleEmojiPressEnd(); if (isSpaceKey) handleSpacebarPressEnd(); setPreview(null); }}
                    onClick={() => {
                      if (isEmojiKey && ignoreClick.current) return;
                      if (isSpaceKey && ignoreSpacebarClick.current) return;
                      if (unicodeEmoji) updateText('insert', unicodeEmoji);
                      else handleKeyPress(key);
                    }}
                    className={`key-button rounded-md font-medium text-center ${key.size || 'flex-1'} ${key.isFnKey ? 'fn-key' : ''} ${keyboardMode === 'warang' && !key.isFnKey && keyboardView !== 'special' ? 'warang-citi-text' : ''} ${isEmojiKey ? 'emoji-key' : ''} ${isCapsActive ? 'fn-active' : ''} ${isKeyPressed ? 'key-pressed' : ''}`}
                  >
                    {unicodeEmoji ? <span className="key-emoji-char">{unicodeEmoji}</span> : isEmojiKey ? (keyboardView === 'text' ? <span className="key-emoji-char">😀</span> : <span className="warang-citi-char">{hoChar}</span>) : isSymbolsKey ? (keyboardView !== 'special' ? <span className="english-char font-bold">?123</span> : <span className={keyboardMode === 'warang' ? 'warang-citi-char' : 'english-char font-bold'}>{keyboardMode === 'warang' ? specialChar : 'ABC'}</span>) : <span className={isCharKey ? (keyboardMode === 'warang' && keyboardView !== 'special' ? 'warang-citi-char' : 'english-char') : ''}>{isSpaceKey ? (keyboardMode === 'warang' ? 'Space' : 'EN | Space') : displayChar}</span>}
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
