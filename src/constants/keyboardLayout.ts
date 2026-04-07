export interface KeyData {
  key: string;
  shiftKey: string;
  code: string;
  size?: string;
  isFnKey?: boolean;
}

export const keyboardLayout: KeyData[][] = [
  // Top row with Warang Citi Numerals (no Backspace)
  [
    { key: '𑣿', shiftKey: '𑣿', code: 'Backquote' }, // OM
    { key: '𑣡', shiftKey: '𑣪', code: 'Digit1' }, // 1, 10
    { key: '𑣢', shiftKey: '𑣫', code: 'Digit2' }, // 2, 20
    { key: '𑣣', shiftKey: '𑣬', code: 'Digit3' }, // 3, 30
    { key: '𑣤', shiftKey: '𑣭', code: 'Digit4' }, // 4, 40
    { key: '𑣥', shiftKey: '𑣮', code: 'Digit5' }, // 5, 50
    { key: '𑣦', shiftKey: '𑣯', code: 'Digit6' }, // 6, 60
    { key: '𑣧', shiftKey: '𑣰', code: 'Digit7' }, // 7, 70
    { key: '𑣨', shiftKey: '𑣱', code: 'Digit8' }, // 8, 80
    { key: '𑣩', shiftKey: '𑣲', code: 'Digit9' }, // 9, 90
    { key: '𑣠', shiftKey: '𑣠', code: 'Digit0' }, // 0
  ],
  // As per image (no Tab)
  [
    { key: '𑢠', shiftKey: '𑣀', code: 'KeyQ' },    // NGAA
    { key: '𑢢', shiftKey: '𑣂', code: 'KeyW' },    // WI
    { key: '𑢨', shiftKey: '𑣈', code: 'KeyE' },    // E
    { key: '𑢼', shiftKey: '𑣜', code: 'KeyR' },    // HAR
    { key: '𑢵', shiftKey: '𑣕', code: 'KeyT' },    // AT
    { key: '𑢣', shiftKey: '𑣃', code: 'KeyY' },    // YU
    { key: '𑢧', shiftKey: '𑣇', code: 'KeyU' },    // UU
    { key: '𑢦', shiftKey: '𑣆', code: 'KeyI' },    // II
    { key: '𑢩', shiftKey: '𑣉', code: 'KeyO' },    // O
    { key: '𑢸', shiftKey: '𑣘', code: 'KeyP' },    // PU
    { key: '𑢤', shiftKey: '𑣄', code: 'BracketLeft' }, // YA
    { key: '𑢥', shiftKey: '𑣅', code: 'BracketRight' }, // YO
  ],
  // As per image (no Caps Lock)
  [
    { key: '𑢡', shiftKey: '𑣁', code: 'KeyA' },    // A
    { key: '𑢾', shiftKey: '𑣞', code: 'KeyS' },    // SII
    { key: '𑢴', shiftKey: '𑣔', code: 'KeyD' },    // DA
    { key: '𑢫', shiftKey: '𑣋', code: 'KeyF' },    // GA
    { key: '𑢰', shiftKey: '𑣐', code: 'KeyG' },    // ENN
    { key: '𑢳', shiftKey: '𑣓', code: 'KeyH' },    // NUNG
    { key: '𑢮', shiftKey: '𑣎', code: 'KeyJ' },    // YUJ
    { key: '𑢬', shiftKey: '𑣌', code: 'KeyK' },    // KO
    { key: '𑢺', shiftKey: '𑣚', code: 'KeyL' },    // HOLO
    { key: '𑢪', shiftKey: '𑣊', code: 'Semicolon' }, // ANG
    { key: '𑢲', shiftKey: '𑣒', code: 'Quote' },     // TTE
  ],
  // As per image (Caps Lock replaces ShiftLeft)
  [
    { key: '↑', shiftKey: '↑', code: 'CapsLock', size: 'caps-key', isFnKey: true },
    { key: '𑢽', shiftKey: '𑣝', code: 'KeyZ' },    // SSUU
    { key: '𑢭', shiftKey: '𑣍', code: 'KeyX' },    // ENY
    { key: '𑢯', shiftKey: '𑣏', code: 'KeyC' },    // UC
    { key: '𑢿', shiftKey: '𑣟', code: 'KeyV' },    // VIYO
    { key: '𑢷', shiftKey: '𑣗', code: 'KeyB' },    // BU
    { key: '𑢱', shiftKey: '𑣑', code: 'KeyN' },    // ODD
    { key: '𑢶', shiftKey: '𑣖', code: 'KeyM' },    // AM
    { key: '𑢹', shiftKey: '𑣙', code: 'Comma' }, // HIYO
    { key: '𑢻', shiftKey: '𑣛', code: 'Period' }, // HORR
    { key: '⌫', shiftKey: '⌫', code: 'Delete', size: 'shift-key', isFnKey: true },
  ],
  // As per image
  [
    { key: '?123', shiftKey: '?123', code: 'Symbols', size: 'flex-1-5', isFnKey: true },
    { key: '😀', shiftKey: '😀', code: 'Emoji', size: 'flex-1-5', isFnKey: true },
    { key: ' ', shiftKey: ' ', code: 'Space', size: 'space-key' },
    { key: '.', shiftKey: ',', code: 'VirtualPeriod', size: 'flex-1-2' },
    { key: '↵', shiftKey: '↵', code: 'Enter', size: 'enter-key', isFnKey: true },
  ],
];

export const englishKeyboardLayout: KeyData[][] = [
  // Top row
  [
    { key: '`', shiftKey: '~', code: 'Backquote' },
    { key: '1', shiftKey: '!', code: 'Digit1' },
    { key: '2', shiftKey: '@', code: 'Digit2' },
    { key: '3', shiftKey: '#', code: 'Digit3' },
    { key: '4', shiftKey: '$', code: 'Digit4' },
    { key: '5', shiftKey: '%', code: 'Digit5' },
    { key: '6', shiftKey: '^', code: 'Digit6' },
    { key: '7', shiftKey: '&', code: 'Digit7' },
    { key: '8', shiftKey: '*', code: 'Digit8' },
    { key: '9', shiftKey: '(', code: 'Digit9' },
    { key: '0', shiftKey: ')', code: 'Digit0' },
  ],
  // QWERTY row
  [
    { key: 'q', shiftKey: 'Q', code: 'KeyQ' },
    { key: 'w', shiftKey: 'W', code: 'KeyW' },
    { key: 'e', shiftKey: 'E', code: 'KeyE' },
    { key: 'r', shiftKey: 'R', code: 'KeyR' },
    { key: 't', shiftKey: 'T', code: 'KeyT' },
    { key: 'y', shiftKey: 'Y', code: 'KeyY' },
    { key: 'u', shiftKey: 'U', code: 'KeyU' },
    { key: 'i', shiftKey: 'I', code: 'KeyI' },
    { key: 'o', shiftKey: 'O', code: 'KeyO' },
    { key: 'p', shiftKey: 'P', code: 'KeyP' },
    { key: '[', shiftKey: '{', code: 'BracketLeft' },
    { key: ']', shiftKey: '}', code: 'BracketRight' },
  ],
  // Home row
  [
    { key: 'a', shiftKey: 'A', code: 'KeyA' },
    { key: 's', shiftKey: 'S', code: 'KeyS' },
    { key: 'd', shiftKey: 'D', code: 'KeyD' },
    { key: 'f', shiftKey: 'F', code: 'KeyF' },
    { key: 'g', shiftKey: 'G', code: 'KeyG' },
    { key: 'h', shiftKey: 'H', code: 'KeyH' },
    { key: 'j', shiftKey: 'J', code: 'KeyJ' },
    { key: 'k', shiftKey: 'K', code: 'KeyK' },
    { key: 'l', shiftKey: 'L', code: 'KeyL' },
    { key: ';', shiftKey: ':', code: 'Semicolon' },
    { key: "'", shiftKey: '"', code: 'Quote' },
  ],
  // Bottom row
  [
    { key: 'Caps', shiftKey: 'Caps', code: 'CapsLock', size: 'caps-key', isFnKey: true },
    { key: 'z', shiftKey: 'Z', code: 'KeyZ' },
    { key: 'x', shiftKey: 'X', code: 'KeyX' },
    { key: 'c', shiftKey: 'C', code: 'KeyC' },
    { key: 'v', shiftKey: 'V', code: 'KeyV' },
    { key: 'b', shiftKey: 'B', code: 'KeyB' },
    { key: 'n', shiftKey: 'N', code: 'KeyN' },
    { key: 'm', shiftKey: 'M', code: 'KeyM' },
    { key: ',', shiftKey: '<', code: 'Comma' },
    { key: '.', shiftKey: '>', code: 'Period' },
    { key: '⌫', shiftKey: '⌫', code: 'Delete', size: 'shift-key', isFnKey: true },
  ],
  // Last row
  [
    { key: '?123', shiftKey: '?123', code: 'Symbols', size: 'flex-1-5', isFnKey: true },
    { key: '😀', shiftKey: '😀', code: 'Emoji', size: 'flex-1-5', isFnKey: true },
    { key: ' ', shiftKey: ' ', code: 'Space', size: 'space-key' },
    { key: '.', shiftKey: ',', code: 'VirtualPeriod', size: 'flex-1-2' },
    { key: '↵', shiftKey: '↵', code: 'Enter', size: 'enter-key', isFnKey: true },
  ],
];

export const specialCharsLayout: KeyData[][] = [
  // Top row
  [
    { key: '1', shiftKey: '~', code: 'Digit1' }, { key: '2', shiftKey: '`', code: 'Digit2' }, { key: '3', shiftKey: '|', code: 'Digit3' }, { key: '4', shiftKey: '•', code: 'Digit4' }, { key: '5', shiftKey: '√', code: 'Digit5' }, { key: '6', shiftKey: 'π', code: 'Digit6' }, { key: '7', shiftKey: '÷', code: 'Digit7' }, { key: '8', shiftKey: '×', code: 'Digit8' }, { key: '9', shiftKey: '{', code: 'Digit9' }, { key: '0', shiftKey: '}', code: 'Digit0' },
  ],
  // Second row
  [
    { key: '@', shiftKey: '£', code: 'KeyQ' }, { key: '#', shiftKey: '¢', code: 'KeyW' }, { key: '$', shiftKey: '€', code: 'KeyE' }, { key: '_', shiftKey: '°', code: 'KeyR' }, { key: '&', shiftKey: '%', code: 'KeyT' }, { key: '-', shiftKey: '^', code: 'KeyY' }, { key: '+', shiftKey: '*', code: 'KeyU' }, { key: '(', shiftKey: '=', code: 'KeyI' }, { key: ')', shiftKey: '(', code: 'KeyO' }, { key: '/', shiftKey: ')', code: 'KeyP' }, { key: '[', shiftKey: '[', code: 'BracketLeft' }, { key: ']', shiftKey: ']', code: 'BracketRight' },
  ],
  // Third row
  [
    { key: '*', shiftKey: '™', code: 'KeyA' }, { key: '"', shiftKey: '®', code: 'KeyS' }, { key: "'", shiftKey: '©', code: 'KeyD' }, { key: ':', shiftKey: '¶', code: 'KeyF' }, { key: ';', shiftKey: '…', code: 'KeyG' }, { key: '!', shiftKey: '¡', code: 'KeyH' }, { key: '?', shiftKey: '¿', code: 'KeyJ' }, { key: '`', shiftKey: '`', code: 'KeyK' }, { key: '~', shiftKey: '~', code: 'KeyL' }, { key: '\\', shiftKey: '\\', code: 'Backslash' }, { key: '=', shiftKey: '≠', code: 'Quote' },
  ],
  // Fourth row
  [
    { key: '↑', shiftKey: '↑', code: 'CapsLock', size: 'caps-key', isFnKey: true },
    { key: '%', shiftKey: '‰', code: 'KeyZ' }, { key: '^', shiftKey: '§', code: 'KeyX' }, { key: '{', shiftKey: '<', code: 'KeyC' }, { key: '}', shiftKey: '>', code: 'KeyV' }, { key: '<', shiftKey: '≤', code: 'KeyB' }, { key: '>', shiftKey: '≥', code: 'KeyN' }, { key: ',', shiftKey: ',', code: 'Comma' }, { key: '.', shiftKey: '.', code: 'Period' }, { key: '€', shiftKey: '¥', code: 'Euro' }, { key: '⌫', shiftKey: '⌫', code: 'Delete', size: 'shift-key', isFnKey: true },
  ],
  // Bottom Row
  [
    { key: 'ABC', shiftKey: 'ABC', code: 'Symbols', size: 'flex-1-5', isFnKey: true },
    { key: ' ', shiftKey: ' ', code: 'Space', size: 'space-key' },
    { key: '↵', shiftKey: '↵', code: 'Enter', size: 'enter-key', isFnKey: true },
  ],
];

export const hoCharacters = ['𑢠', '𑢡', '𑢢', '𑢣', '𑢤', '𑢥', '𑢦', '𑢧', '𑢨', '𑢩'];

const characters = keyboardLayout.flat().filter(k => !k.isFnKey && k.code !== 'Space');
const allChars = new Set<string>();
characters.forEach(c => {
  allChars.add(c.key);
  allChars.add(c.shiftKey);
});

const charArray = Array.from(allChars);

const unicodeEmojis = [
  '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '🥲', '🤔', '🤩',
  '🤗', '🙂', '😚', '🫡', '🤨', '😐', '😑', '😶', '🫥', '😮', '😥', '😣', '😏', '🙄', '😬', '😮‍💨', '🤥', '😌', '😔', '😪',
  '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '😵‍💫', '🤯', '🤠', '🥳', '🥸', '🥺', '🥹', '🧐',
  '😕', '😟', '🙁', '😮', '😲', '😳', '😭', '😦', '😧', '😨', '😰', '😢', '😂', '😭', '😱', '😖', '😩', '🥱', '😤', '😡',
  '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖'
];

export const emojiMap: { [char: string]: string } = {};
charArray.forEach((char, i) => {
  emojiMap[char] = unicodeEmojis[i % unicodeEmojis.length];
});