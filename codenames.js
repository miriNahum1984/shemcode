// משתנים גלובליים לשימוש עם סורק ה-QR
let videoStream = null;
let scannerActive = false;

// מאגר מילים בעברית מורחב
const hebrewWords = [
    // מקומות וגיאוגרפיה
    'ישראל', 'ירושלים', 'תל-אביב', 'חיפה', 'אילת', 'נגב', 'גליל', 'כרמל',
    'ים-המלח', 'כנרת', 'גולן', 'מצדה', 'ניו-יורק', 'פריז', 'לונדון', 'רומא',
    'מצרים', 'אמריקה', 'אירופה', 'אפריקה', 'אסיה', 'אוסטרליה', 'אנטארקטיקה',
    'מדבר', 'הר', 'עמק', 'נהר', 'אגם', 'אוקיינוס', 'יער', 'חוף', 'מפרץ',
    'אי', 'סיני', 'ערבה', 'יהודה', 'שומרון', 'באר-שבע', 'נצרת', 'עכו', 'טבריה',
    'ים-סוף', 'ים-התיכון', 'הר-הבית', 'כותל', 'מכתש', 'חרמון', 'דימונה', 'רמת-גן',

    // משפחה וחברה
    'אבא', 'אמא', 'הורים', 'אח', 'אחות', 'בן', 'בת', 'סבא', 'סבתא',
    'דוד', 'דודה', 'בן-דוד', 'בת-דודה', 'חתן', 'כלה', 'נישואין', 'משפחה',
    'חבר', 'חברה', 'ידיד', 'שכן', 'קהילה', 'חברות', 'אהבה', 'זוגיות',
    'תינוק', 'ילד', 'נער', 'מבוגר', 'זקן', 'גיל', 'דור', 'מסיבה', 'חתונה',

    // מקצועות ועיסוקים
    'מורה', 'רופא', 'מהנדס', 'עורך-דין', 'שופט', 'שוטר', 'חייל', 'טייס',
    'נהג', 'מלצר', 'טבח', 'זמר', 'שחקן', 'צייר', 'סופר', 'מדען', 'חקלאי',
    'אדריכל', 'חשמלאי', 'נגר', 'מתכנת', 'מנהל', 'פקיד', 'רואה-חשבון',
    'גנן', 'דייג', 'צלם', 'מעצב', 'אמן', 'מוזיקאי', 'פסיכולוג', 'מתרגם',

    // טבע וחיות
    'שמש', 'ירח', 'כוכב', 'שמיים', 'עננים', 'גשם', 'שלג', 'רוח', 'סערה',
    'ברק', 'רעם', 'קשת', 'עץ', 'פרח', 'דשא', 'שיח', 'יער', 'מדבר', 'הר',
    'עמק', 'נהר', 'ים', 'אוקיינוס', 'חוף', 'אי', 'מפל', 'גשר', 'מערה',
    'סלע', 'אדמה', 'חול', 'אבן', 'מעיין', 'באר', 'אגם', 'גבעה', 'גיא',
    'חתול', 'כלב', 'סוס', 'פרה', 'כבשה', 'עז', 'תרנגול', 'ציפור', 'דג',
    'נחש', 'צב', 'גירפה', 'פיל', 'אריה', 'נמר', 'זאב', 'דוב', 'קוף',
    'עכבר', 'ארנב', 'סנאי', 'נשר', 'ינשוף', 'עטלף', 'לטאה', 'עכביש', 'נמלה',
    'פרפר', 'דבורה', 'חיפושית', 'תולעת', 'ברווז', 'ברבור', 'יונה', 'תוכי',

    // מזון ואוכל
    'לחם', 'חלב', 'גבינה', 'ביצה', 'בשר', 'עוף', 'דג', 'אורז', 'פסטה',
    'פיצה', 'המבורגר', 'שניצל', 'פלאפל', 'חומוס', 'טחינה', 'סלט', 'מרק',
    'תפוח', 'בננה', 'תפוז', 'לימון', 'אבטיח', 'מלון', 'ענבים', 'אגס',
    'תות', 'אננס', 'מנגו', 'אפרסק', 'שזיף', 'דובדבן', 'אבוקדו', 'זית',
    'שוקולד', 'גלידה', 'עוגה', 'עוגיות', 'קינוח', 'סוכר', 'מלח', 'פלפל',
    'קפה', 'תה', 'מיץ', 'מים', 'יין', 'בירה', 'קולה', 'חלווה', 'דבש'
];

// מצב המשחק
let gameState = {
    board: [],         // לוח המשחק הנוכחי
    spymasterView: false, // האם מציגים את כל הקלפים
    blueTeamTurn: true,   // איזו קבוצה בתור
    currentRole: '',   // התפקיד הנוכחי של השחקן
    revealedCards: {}, // קלפים שנחשפו
    boardCode: ''      // הקוד המייצג את לוח המשחק
};

// קידוד וזיהוי צבעים
const colorCodes = {
    'blue': 'B',
    'red': 'R',
    'neutral': 'N',
    'assassin': 'A'
};
const codeToColor = {
    'B': 'blue',
    'R': 'red',
    'N': 'neutral',
    'A': 'assassin'
};
// פונקציה ליצירת QR Code - שיטה מבוססת Google Chart API
function generateQRCode(text, elementId) {
    console.log(`יוצר קוד QR עבור: ${text}`);
    console.log(`אורך הקוד: ${text.length} תווים`);

    // נקה את האלמנט הקיים
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`האלמנט ${elementId} לא נמצא!`);
        return;
    }

    element.innerHTML = '';

    try {
        // ננסה קודם עם ספריית QRCode
        if (typeof QRCode !== 'undefined') {
            new QRCode(element, {
                text: text,
                width: 256,
                height: 256,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.L  // רמת תיקון נמוכה מאפשרת יותר מידע
            });
            console.log('קוד QR נוצר בהצלחה עם ספריית QRCode');
        } else {
            // אם הספרייה לא זמינה, השתמש בשיטה החלופית
            throw new Error('ספריית QRCode לא זמינה');
        }
    } catch (error) {
        console.warn('שימוש בשיטה חלופית ליצירת QR:', error);
        generateQRCodeAlternative(text, elementId);
    }
}

// פונקציה חלופית ליצירת QR באמצעות Google Chart API
function generateQRCodeAlternative(text, elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const url = `https://chart.googleapis.com/chart?cht=qr&chs=256x256&chld=L|0&chl=${encodeURIComponent(text)}`;

    const img = document.createElement('img');
    img.src = url;
    img.alt = 'QR Code';
    img.style.width = '256px';
    img.style.height = '256px';

    element.innerHTML = '';
    element.appendChild(img);

    // שומר את הקישור להורדה
    element.dataset.downloadUrl = url;
    console.log('קוד QR נוצר בהצלחה עם Google Chart API');
}

// פונקציה להורדת QR code כתמונה
function downloadQRCode() {
    console.log('מתחיל תהליך הורדת קוד QR');

    const qrContainer = document.getElementById('qrcode');
    if (!qrContainer) {
        console.error('מכל של קוד QR לא נמצא!');
        alert('לא נמצא קוד QR להורדה. נא ליצור קוד משחק תחילה.');
        return;
    }

    try {
        // בדיקה אם יש קנבס (QRCode.js) או תמונה (ספרייה חלופית)
        const qrCanvas = qrContainer.querySelector('canvas');
        const qrImage = qrContainer.querySelector('img');

        let imageURL;

        if (qrCanvas) {
            // המרת הקנבס לתמונה
            imageURL = qrCanvas.toDataURL('image/png');
        } else if (qrImage && qrImage.src) {
            // שימוש בקישור של התמונה
            imageURL = qrImage.src;
        } else {
            throw new Error('לא נמצאה תמונת QR תקינה');
        }

        console.log('נוצר URL של תמונת ה-QR');

        // יצירת קישור להורדה
        const downloadLink = document.createElement('a');
        downloadLink.href = imageURL;
        downloadLink.download = 'codenames-game-qr.png';
        document.body.appendChild(downloadLink);

        // הפעלת הקישור והסרתו
        downloadLink.click();
        setTimeout(() => {
            document.body.removeChild(downloadLink);
            console.log('הורדת קוד QR הושלמה');
        }, 100);
    } catch (error) {
        console.error('שגיאה בהורדת קוד QR:', error);
        alert('שגיאה בהורדת קוד QR: ' + error.message);
    }
}

// פתיחת סורק ה-QR
async function startQRScanner() {
    const scannerArea = document.getElementById('scannerArea');
    const videoElement = document.getElementById('scannerVideo');

    // בדיקה שהספרייה נטענה
    if (typeof jsQR === 'undefined') {
        console.error('ספריית jsQR לא נטענה');
        alert('ספריית סריקת QR לא נטענה כראוי. נסה לרענן את הדף או להשתמש בהזנה ידנית של קוד המשחק');
        return;
    }

    // הצגת אזור הסריקה
    scannerArea.style.display = 'block';

    // בדיקה אם המצלמה זמינה
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
        });

        videoElement.srcObject = videoStream;
        videoElement.play();

        scannerActive = true;

        // התחלת סריקה
        scanQRCode();

    } catch (error) {
        console.error('שגיאה בגישה למצלמה:', error);
        alert('שגיאה בגישה למצלמה: ' + error.message);
        scannerArea.style.display = 'none';
    }
}

// סגירת סורק ה-QR
function stopQRScanner() {
    scannerActive = false;

    // עצירת הסטרים של המצלמה
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }

    // הסתרת אזור הסריקה
    document.getElementById('scannerArea').style.display = 'none';
}
// סריקת קוד QR מתוך תמונת וידאו
function scanQRCode() {
    if (!scannerActive) return;

    const videoElement = document.getElementById('scannerVideo');
    const canvasElement = document.createElement('canvas');
    const context = canvasElement.getContext('2d');

    // ודא שהווידאו מוכן
    if (videoElement.readyState !== videoElement.HAVE_ENOUGH_DATA) {
        requestAnimationFrame(scanQRCode);
        return;
    }

    // הגדרת גודל הקנבס לפי גודל הווידאו
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    // ציור התמונה הנוכחית מהווידאו על הקנבס
    context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

    // קבלת נתוני התמונה
    const imageData = context.getImageData(0, 0, canvasElement.width, canvasElement.height);

    try {
        // ניסיון לפענח קוד QR
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
        });

        // אם נמצא קוד תקין
        if (code) {
            console.log('נמצא קוד QR:', code.data);
            // עצירת הסריקה
            stopQRScanner();

            try {
                // פענוח קוד המשחק והטענתו
                document.getElementById('gameCodeInput').value = code.data;
                joinGame();
            } catch (error) {
                console.error('שגיאה בפענוח קוד QR:', error);
                alert('הקוד שנסרק אינו תקין: ' + error.message);
            }

            return;
        }
    } catch (error) {
        console.error('שגיאה בסריקת QR:', error);
    }

    // המשך סריקה
    requestAnimationFrame(scanQRCode);
}

// פתיחת חלון השיתוף
function openShareModal() {
    // יצירת QR קוד למשחק הנוכחי
    generateQRCode(gameState.boardCode, 'shareQrCode');

    // הצגת החלון
    document.getElementById('shareModal').style.display = 'flex';
}

// סגירת חלון השיתוף
function closeShareModal() {
    document.getElementById('shareModal').style.display = 'none';
}

// יצירת לוח משחק חדש
function createNewBoard() {
    // בחירת 25 מילים אקראיות
    const selectedWords = [];

    // בחירת המילים באופן אקראי
    while (selectedWords.length < 25) {
        const randomIndex = Math.floor(Math.random() * hebrewWords.length);
        const word = hebrewWords[randomIndex];

        // בדיקה שהמילה לא נבחרה כבר
        if (!selectedWords.includes(word)) {
            selectedWords.push(word);
        }
    }

    // קביעת הקבוצה שמתחילה
    gameState.blueTeamTurn = Math.random() < 0.5;
    const firstTeam = gameState.blueTeamTurn ? 'blue' : 'red';
    const secondTeam = firstTeam === 'blue' ? 'red' : 'blue';

    // קביעת כמה קלפים לכל קבוצה
    const firstTeamCards = 9;
    const secondTeamCards = 8;

    // יצירת מערך של 25 אינדקסים וערבובו
    const indices = [...Array(25).keys()];
    shuffleArray(indices);

    // יצירת לוח המשחק
    const board = selectedWords.map((word, i) => ({
        word,
        type: 'neutral', // ברירת מחדל ניטרלי
        revealed: false
    }));

    // הקצאת קלפים לקבוצה הראשונה
    for (let i = 0; i < firstTeamCards; i++) {
        board[indices[i]].type = firstTeam;
    }

    // הקצאת קלפים לקבוצה השנייה
    for (let i = firstTeamCards; i < firstTeamCards + secondTeamCards; i++) {
        board[indices[i]].type = secondTeam;
    }

    // הקצאת קלף המתנקש
    board[indices[firstTeamCards + secondTeamCards]].type = 'assassin';

    return board;
}

// ערבוב מערך
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// יצירת קוד המשחק מלוח נתון - גרסה יעילה יותר
function generateBoardCode(board) {
    // קיצור קיצוני - שימוש בקידוד יעיל
    let code = '';

    // תחילה קובעים מי מתחיל - 0 לאדום, 1 לכחול
    const blueStarts = board.filter(card => card.type === 'blue').length === 9;
    code += blueStarts ? '1' : '0';

    // עבור כל קלף בלוח
    board.forEach(card => {
        // מוצאים את אינדקס המילה
        const wordIndex = hebrewWords.indexOf(card.word);
        if (wordIndex === -1) {
            console.error(`המילה ${card.word} לא נמצאה במאגר המילים!`);
            // אם המילה לא נמצאה, משתמשים באינדקס 0
            code += '000';
        } else {
            // המרת האינדקס לבסיס 36 (אותיות ומספרים)
            code += wordIndex.toString(36).padStart(3, '0');
        }

        // הוספת סוג הקלף
        code += colorCodes[card.type] || 'N';
    });

    return code;
}

// פענוח קוד משחק מהפורמט היעיל
function decodeBoardCode(code) {
    try {
        // בדיקת אורך מינימלי
        if (code.length < 101) { // 1 (לסימון התור) + 25 * 4 (לכל קלף)
            throw new Error('קוד משחק קצר מדי');
        }

        // קריאת מי מתחיל
        const blueStarts = code.charAt(0) === '1';

        // יצירת לוח חדש
        const board = [];

        // פענוח כל הקלפים
        for (let i = 1; i < code.length; i += 4) {
            if (i + 3 >= code.length) break;

            // פענוח אינדקס המילה
            const indexCode = code.substring(i, i + 3);
            const wordIndex = parseInt(indexCode, 36);

            if (wordIndex >= hebrewWords.length || isNaN(wordIndex)) {
                throw new Error(`אינדקס מילה לא תקין: ${indexCode}`);
            }

            const word = hebrewWords[wordIndex];

            // פענוח צבע הקלף
            const colorCode = code.charAt(i + 3);
            const type = codeToColor[colorCode] || 'neutral';

            // יצירת הקלף והוספתו ללוח
            board.push({
                word,
                type,
                revealed: false
            });
        }

        return board;
    } catch (error) {
        console.error('שגיאה בפענוח קוד המשחק:', error);
        throw new Error('קוד משחק לא תקין: ' + error.message);
    }
}
// אתחול משחק חדש
function initializeGame() {
    // יצירת לוח משחק חדש
    gameState.board = createNewBoard();

    // יצירת קוד המשחק
    gameState.boardCode = generateBoardCode(gameState.board);

    // איפוס קלפים חשופים
    gameState.revealedCards = {};

    updateTurnIndicator();
    renderBoard();
}

// עדכון סמן התור
function updateTurnIndicator() {
    const turnIndicator = document.getElementById('turnIndicator');
    turnIndicator.textContent = `תור הקבוצה ${gameState.blueTeamTurn ? 'הכחולה' : 'האדומה'}`;
    turnIndicator.className = 'turn-indicator';
    turnIndicator.classList.add(gameState.blueTeamTurn ? 'blue-turn' : 'red-turn');
}

// הצגת הלוח
function renderBoard() {
    const boardElement = document.getElementById('gameBoard');
    boardElement.innerHTML = '';

    const isSpymaster = gameState.currentRole === 'blueSpymaster' ||
        gameState.currentRole === 'redSpymaster' ||
        gameState.currentRole === 'gameManager';

    gameState.board.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';

        // בדיקה אם הקלף נחשף
        const isRevealed = gameState.revealedCards[index] === true;
        if (isRevealed) {
            cardElement.classList.add('revealed');
        }

        cardElement.textContent = card.word;

        // הוסף מחלקות CSS בהתאם למצב הקלף
        if (isRevealed || (isSpymaster && gameState.spymasterView)) {
            cardElement.classList.add(card.type);
        }

        // הוסף מאזין אירועים ללחיצה - רק למנהל משחק ושחקנים רגילים יכולים לחשוף קלפים
        if (!isRevealed && (gameState.currentRole === 'gameManager' || gameState.currentRole === 'player')) {
            cardElement.addEventListener('click', () => {
                revealCard(index);
            });
        }

        boardElement.appendChild(cardElement);
    });
}

// חשיפת קלף
function revealCard(index) {
    // סימון הקלף כחשוף
    gameState.revealedCards[index] = true;

    const card = gameState.board[index];

    // בדיקה אם הקבוצה הנוכחית צריכה להחליף תור
    if (card.type !== (gameState.blueTeamTurn ? 'blue' : 'red')) {
        gameState.blueTeamTurn = !gameState.blueTeamTurn;
        updateTurnIndicator();
    }

    // שמירת מצב מעודכן של הקלפים החשופים
    localStorage.setItem(`revealed_${gameState.boardCode}`, JSON.stringify(gameState.revealedCards));
    localStorage.setItem(`turn_${gameState.boardCode}`, gameState.blueTeamTurn ? 'blue' : 'red');

    renderBoard();

    // בדיקת סיום משחק
    checkGameEnd();
}

// בדיקת סיום משחק
function checkGameEnd() {
    // ספירת כמה קלפים חשופים מכל צבע
    let revealedBlue = 0, totalBlue = 0;
    let revealedRed = 0, totalRed = 0;
    let assassinRevealed = false;

    gameState.board.forEach((card, index) => {
        if (card.type === 'blue') {
            totalBlue++;
            if (gameState.revealedCards[index]) revealedBlue++;
        } else if (card.type === 'red') {
            totalRed++;
            if (gameState.revealedCards[index]) revealedRed++;
        } else if (card.type === 'assassin' && gameState.revealedCards[index]) {
            assassinRevealed = true;
        }
    });

    if (revealedBlue === totalBlue) {
        alert('הקבוצה הכחולה ניצחה!');
    } else if (revealedRed === totalRed) {
        alert('הקבוצה האדומה ניצחה!');
    } else if (assassinRevealed) {
        alert(`הקבוצה ${gameState.blueTeamTurn ? 'האדומה' : 'הכחולה'} ניצחה! נבחר המתנקש.`);
    }
}

// הצגת מסך המשחק והסתרת מסך הכניסה
function showGameScreen() {
    document.getElementById('welcomeContainer').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    document.getElementById('currentRole').textContent = translateRole(gameState.currentRole);

    // הצג/הסתר כפתורי ראש מודיעין בהתאם לתפקיד
    if (gameState.currentRole === 'blueSpymaster' ||
        gameState.currentRole === 'redSpymaster' ||
        gameState.currentRole === 'gameManager') {
        document.getElementById('spymasterControls').style.display = 'inline-block';
    } else {
        document.getElementById('spymasterControls').style.display = 'none';
    }
}

// תרגום התפקיד לעברית
function translateRole(role) {
    switch (role) {
        case 'gameManager': return 'מנהל משחק';
        case 'blueSpymaster': return 'ראש מודיעין כחול';
        case 'redSpymaster': return 'ראש מודיעין אדום';
        case 'player': return 'שחקן';
        default: return role;
    }
}
// יצירת משחק חדש עם קוד
function createNewGame() {
    console.log('מתחיל יצירת משחק חדש');

    if (!gameState.currentRole) {
        alert('יש לבחור תפקיד לפני יצירת משחק');
        return;
    }

    // יצירת לוח משחק חדש
    gameState.board = createNewBoard();

    // יצירת קוד מהלוח
    gameState.boardCode = generateBoardCode(gameState.board);
    console.log('נוצר קוד משחק:', gameState.boardCode);
    console.log('אורך קוד:', gameState.boardCode.length);

    // הצגת הקוד למשתמש
    const codeElement = document.getElementById('generatedGameCode');
    codeElement.textContent = gameState.boardCode;
    document.getElementById('gameCodeCreator').style.display = 'block';

    // יצירת קוד QR למשחק עם עיכוב קטן
    setTimeout(() => {
        generateQRCode(gameState.boardCode, 'qrcode');
    }, 50);

    // איפוס קלפים חשופים
    gameState.revealedCards = {};
}

// הצטרפות למשחק קיים
function joinGame() {
    if (!gameState.currentRole) {
        alert('יש לבחור תפקיד לפני הצטרפות למשחק');
        return;
    }

    const gameCode = document.getElementById('gameCodeInput').value.trim();

    if (!gameCode) {
        alert('יש להזין קוד משחק');
        return;
    }

    try {
        // פענוח קוד המשחק
        const board = decodeBoardCode(gameCode);

        // בדיקה שהלוח תקין
        if (board.length !== 25) {
            throw new Error('קוד משחק לא תקין - נדרשים 25 קלפים');
        }

        // שמירת הקוד והלוח
        gameState.boardCode = gameCode;
        gameState.board = board;

        // טעינת מצב קלפים חשופים (אם קיים)
        const savedCards = localStorage.getItem(`revealed_${gameCode}`);
        const savedTurn = localStorage.getItem(`turn_${gameCode}`);

        if (savedCards) {
            gameState.revealedCards = JSON.parse(savedCards);
        } else {
            gameState.revealedCards = {};
        }

        if (savedTurn) {
            gameState.blueTeamTurn = savedTurn === 'blue';
        } else {
            // קביעת התור לפי האות הראשונה בקוד
            gameState.blueTeamTurn = gameCode.charAt(0) === '1';
        }

        showGameScreen();
        updateTurnIndicator();
        renderBoard();

    } catch (error) {
        console.error('שגיאה בפענוח קוד המשחק:', error);
        alert('שגיאה בפענוח קוד המשחק: ' + error.message);
    }
}

// בדיקה אם הספריות נטענו ויצירת פונקציות חלופיות אם צריך
function checkLibrariesLoaded() {
    // בדיקת ספריית QRCode
    if (typeof QRCode === 'undefined') {
        console.warn('ספריית QRCode לא נטענה! משתמש בפתרון חלופי.');

        // הגדרת פונקציה חלופית
        window.QRCode = function (element, options) {
            generateQRCodeAlternative(options.text, element.id);
        };

        // הוספת רמות תיקון חסרות
        window.QRCode.CorrectLevel = {
            L: 1,
            M: 0,
            Q: 3,
            H: 2
        };
    }

    // בדיקת ספריית jsQR
    if (typeof jsQR === 'undefined') {
        console.warn('ספריית jsQR לא נטענה! סריקת QR לא תהיה זמינה.');
    }
}

// הוספת מאזיני אירועים לכפתורים
document.addEventListener('DOMContentLoaded', () => {
    console.log('דף נטען, מוסיף מאזינים לאירועים');

    // בדיקת ספריות
    setTimeout(checkLibrariesLoaded, 500);

    // בחירת תפקיד
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach(card => {
        card.addEventListener('click', () => {
            // הסר סימון מכל הכרטיסים
            roleCards.forEach(c => c.classList.remove('selected'));
            // סמן את הכרטיס הנבחר
            card.classList.add('selected');
            // שמור את התפקיד הנבחר
            gameState.currentRole = card.dataset.role;
        });
    });

    // כפתורי מסך הכניסה
    document.getElementById('createGameBtn').addEventListener('click', createNewGame);
    document.getElementById('joinGameBtn').addEventListener('click', joinGame);
    document.getElementById('scanQrBtn').addEventListener('click', startQRScanner);
    document.getElementById('downloadQR').addEventListener('click', downloadQRCode);

    document.getElementById('startGameBtn').addEventListener('click', () => {
        showGameScreen();
        renderBoard();
    });

    // כפתורי מסך המשחק
    document.getElementById('newGameBtn').addEventListener('click', () => {
        if (confirm('האם אתה בטוח שברצונך לחזור למסך הכניסה ולייצר משחק חדש?')) {
            document.getElementById('welcomeContainer').style.display = 'block';
            document.getElementById('gameContainer').style.display = 'none';
        }
    });

    document.getElementById('spymasterViewBtn').addEventListener('click', () => {
        gameState.spymasterView = !gameState.spymasterView;
        renderBoard();
    });

    document.getElementById('backToLobbyBtn').addEventListener('click', () => {
        document.getElementById('welcomeContainer').style.display = 'block';
        document.getElementById('gameContainer').style.display = 'none';
        document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
        gameState.currentRole = '';
    });

    // כפתורי שיתוף QR
    document.getElementById('shareGameBtn').addEventListener('click', openShareModal);
    document.getElementById('closeShareModal').addEventListener('click', closeShareModal);
});