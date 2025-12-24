

// משתנה גלובלי שמסמן האם הצלחנו להתחבר ל-LMS דרך SCORM
let isScormConnected = false; // ברירת מחדל: אין חיבור


//תפריט מובייל
function toggleNav() {
    // מחליף את מצב התפריט - אם מוסתר יציג, אם מוצג יסתיר
    document.getElementById("main-nav").classList.toggle("hide-mobile");
    // מחליף את מצב השכבה השחורה מאחורי התפריט
    document.getElementById("nav-overlay").classList.toggle("hide-mobile");
}


// המתנה לטעינת כל ה-HTML לפני הרצת הקוד 
document.addEventListener('DOMContentLoaded', function () {


   
    // חיפוש פעילויות
    // שדה החיפוש
    const searchInput = document.getElementById('searchInput'); // שליפת שדה הקלט של החיפוש
    

    // חיפוש בזמן הקלדה
    if (searchInput) { // בדיקה שהאלמנט קיים
        searchInput.addEventListener('input', searchActivities); // הוספת מאזין לאירוע הקלדה
    }
    
    //  חיבור הטופס לפונקציית הולידציה 
    const surveyForm = document.getElementById('surveyForm'); // שליפת טופס הסקר
    if (surveyForm) { // בדיקה שהטופס קיים
        surveyForm.addEventListener('submit', validateFormAndSendToLMS); // חיבור לפונקציית הולידציה ושליחה
    }


    // שליפת כל הכפתורים (פריטים) בתפריט הנפתח של סיבת הביקור
    const dropdownItems = document.querySelectorAll('.visitPurposeDropdown .dropdown-item');
// שליפת הכפתור הראשי של הדרופדאון (הכפתור שמציג את הבחירה הנוכחית)
    const visitPurposeBtn = document.getElementById('visitPurposeBtn');
// שליפת השדה הנסתר שמכיל את הערך שנבחר (לצורך שליחת הטופס)
    const visitPurposeInput = document.getElementById('visitPurpose');

// מעבר על כל פריט בדרופדאון (לולאה)
    dropdownItems.forEach(item => {
        // הוספת מאזין לאירוע לחיצה על כל פריט
        item.addEventListener('click', (e) => {
            // מניעת התנהגות ברירת המחדל של הדפדפן (למנוע רענון דף או פעולות לא רצויות)
            e.preventDefault();
            // שליפת הערך של הפריט שנלחץ מהאטריביוט data-value
            const value = item.getAttribute('data-value');
            // עדכון הטקסט בכפתור הדרופדאון להצגת הבחירה למשתמש
            visitPurposeBtn.textContent = value;
            // עדכון הערך בשדה הנסתר (לשליחה לטופס)
            visitPurposeInput.value = value;

            // הסרת שגיאה (אם יש validation)
            // שליפת אלמנט הודעת השגיאה של שדה סיבת הביקור
            const errorEl = document.getElementById('visitPurpose-error');
            // בדיקה: האם אלמנט הודעת השגיאה קיים
            if (errorEl) {
                // הסרת מחלקת 'show' שמציגה את הודעת השגיאה
                errorEl.classList.remove('show');
                // ניקוי תוכן הודעת השגיאה (מחרוזת ריקה)
                errorEl.textContent = '';
            }
        });
    });
   
    
    
    
    // פונקציית החיפוש עצמה
    function searchActivities() {

        // הטקסט שהוקלד (ללא רווחים מיותרים)
        const searchTerm = searchInput.value.trim(); // שמירת ערך החיפוש אחרי הסרת רווחים

        const errorMessage = document.getElementById('search-container-empty'); // שליפת אלמנט הודעת השגיאה

        // דגל שמסמן אם מצאנו לפחות כרטיס אחד שמתאים
        let foundMatch = false; // ברירת מחדל: לא מצאנו התאמה

        // שליפת כל עמודות הפעילויות (ולא רק הכרטיס עצמו)
        const activityCards = document.querySelectorAll('#activitiesGrid > div'); // בחירת כל העמודות ישירות תחת הגריד

        // מעבר על כל עמודה בנפרד
        activityCards.forEach(col => { // לולאה על כל עמודה
            const card = col.querySelector('.card'); // שליפת הכרטיס שבתוך העמודה
            // שם הפעילות מתוך data-title
            const title = card.getAttribute('data-title'); // שליפת שם הפעילות מהאטריביוט

            /* תנאי הצגה:
           - אם שדה החיפוש ריק , מציגים את כל העמודות
           - אם שם הפעילות מכיל את הטקסט שהוקלד , מציגים את הכרטיסייה שלו
           - אחרת , מסתירים את כל העמודה
        */
            if (searchTerm === '' || title.includes(searchTerm)) { // בדיקה: האם שדה החיפוש ריק או שהכותרת מכילה את טקסט החיפוש
                col.classList.remove('hidden'); // הסרת מחלקת ההסתרה - העמודה תופיע למשתמש
                
                // אם יש טקסט חיפוש והוא נמצא בכותרת - נסמן שמצאנו התאמה
                if (searchTerm !== '' && title.includes(searchTerm)) { // בדיקה: שדה החיפוש לא ריק וגם הכותרת מכילה את הטקסט
                    foundMatch = true; // שינוי הדגל ל-true - כן מצאנו התאמה
                }
            } else { // אחרת - אין התאמה
                col.classList.add('hidden'); // הוספת מחלקת הסתרה - מסתיר את העמודה
                errorMessage.innerHTML = " "; // ניקוי הודעת השגיאה
            }
        });


        // עכשיו מחליטים על הודעת שגיאה פעם אחת (לא בתוך הלולאה)
        if (searchTerm === '') { // אם שדה החיפוש ריק
            errorMessage.innerHTML = ""; // אין הודעת שגיאה
        } else { // אם יש טקסט חיפוש
            if (foundMatch === false) { // ולא מצאנו התאמות
                errorMessage.innerHTML = "לא נמצא התוכן המתבקש"; // הצגת הודעת שגיאה
            } else { // מצאנו התאמה
                errorMessage.innerHTML = ""; // ניקוי הודעת השגיאה
            }
        }


    }

   
    // אתחול SCORM
    // בדיקה שהספרייה pipwerks קיימת (שה-wrapper נטען)
    if (!window.pipwerks || !pipwerks.SCORM) { // בדיקה שהאובייקט קיים
        console.warn('[SCORM] Wrapper not found. ודאי שהקובץ SCORM_API_wrapper.js נטען לפני javascript.js'); // אזהרה לקונסול
        return; // יציאה מהפונקציה - לא ממשיכים
    }

    // ניסיון לפתוח קשר מול ה-LMS
    isScormConnected = pipwerks.SCORM.init(); // קריאה לפונקציית האתחול ושמירת התוצאה

    // אם החיבור נכשל - נדפיס שגיאה אבל עדיין נמשיך להריץ את האתר
    if (!isScormConnected) { // אם האתחול נכשל
        console.error('[SCORM] init() failed. ייתכן שאת לא מריצה בתוך LMS או שה-API לא זמין.'); // שגיאה לקונסול
    }

});



// סגירת חיבור SCORM בעת עזיבת הדף

// כשעוזבים את העמוד/סוגרים – נשמור וננתק 
window.addEventListener('beforeunload', saveAndCloseSession); // מאזין לאירוע עזיבת הדף וחיבור לפונקציה ששומרת נתונים ומנתקת את החיבור

// פונקציה ששומרת נתונים ומנתקת את החיבור ל-SCORM
function saveAndCloseSession() {
    if (!isScormConnected || !window.pipwerks || !pipwerks.SCORM) return; // בדיקה שיש חיבור פעיל
    pipwerks.SCORM.save(); // Commit - שמירת כל הנתונים ל-LMS
    pipwerks.SCORM.quit(); // Close session - סגירת החיבור
}





// ולידציה ושליחת טופס הסקר

// הפונקציה הראשית: ולידציה לכל שדות חובה למילוי + איסוף נתונים + שליחה ל-LMS
function validateFormAndSendToLMS(e) {
    e.preventDefault(); // מונע רענון דף ושליחה "רגילה" של טופס

    // איפוס כל הודעות השגיאה לפני בדיקה חדשה
    clearAllErrors(); // קריאה לפונקציה שמנקה שגיאות קודמות

    let valid = true; // דגל תקינות - ברירת מחדל: הכל תקין

    // איסוף שדות לפי ה-IDs 
    const userNameEl = document.getElementById('userName'); // שליפת שדה השם
    const userEmailEl = document.getElementById('userEmail'); // שליפת שדה האימייל
    const visitPurposeEl = document.getElementById('visitPurpose'); // שליפת שדה הסיבה לביקור


    // בדיקה אם שדה שם מלא ריק
    if (userNameEl.value.trim() === "") { // בדיקה: האם השדה ריק (אחרי הסרת רווחים)
        showFieldError('userName', 'נא להזין שם מלא.'); // הצגת הודעת שגיאה ליד השדה
        valid = false; // שינוי הדגל ל-false - הטופס לא תקין
    }
    else { // אם השדה מכיל טקסט
        const nameParts = userNameEl.value.trim().split(' ').filter(function (p) { return p !== ''; }); // פיצול הטקסט לפי רווחים והסרת רווחים ריקים
        // בדיקה שיש לפחות שני חלקים: שם פרטי ושם משפחה
        if (nameParts.length < 2) { // בדיקה: האם יש פחות משני חלקים
            showFieldError('userName', 'נא להזין גם שם פרטי וגם שם משפחה.'); // הודעת שגיאה
            valid = false; // שינוי הדגל ל-false - הטופס לא תקין
        }
    }

    // בדיקה אם שדה אימייל ריק
    if (userEmailEl.value.trim() === "") { // בדיקה: האם השדה ריק (אחרי הסרת רווחים)
        showFieldError('userEmail', 'נא להזין דואר אלקטרוני.'); // הצגת הודעת שגיאה ליד השדה
        valid = false; // שינוי הדגל ל-false - הטופס לא תקין
    }
    else { // אם השדה מכיל טקסט
        if(!isValidEmail(userEmailEl.value)) { // בדיקה: האם כתובת האימייל בפורמט תקין
            showFieldError('userEmail', 'כתובת הדואר האלקטרוני אינה תקינה.'); // הודעת שגיאה על פורמט לא תקין
            valid = false; // שינוי הדגל ל-false - הטופס לא תקין
        }
    }

    // בדיקה אם נבחרה סיבה לביקור באתר
    if (!visitPurposeEl || visitPurposeEl.value.trim() === "") { // בדיקה: האם השדה לא קיים או ריק
        showFieldError('visitPurpose', 'נא לבחור סיבה לביקור באתר.'); // הצגת הודעת שגיאה ליד השדה
        valid = false; // שינוי הדגל ל-false - הטופס לא תקין
    }

    // בדיקה אם נבחר דירוג
    const selectedRatingEl = document.querySelector('input[name="rating"]:checked'); // חיפוש כפתור רדיו מסומן מתוך קבוצת "rating"
    if (!selectedRatingEl) { // בדיקה: האם לא נמצא כפתור מסומן (לא נבחר דירוג)
        showFieldError('rating', 'נא לבחור דירוג.'); // הצגת הודעת שגיאה
        valid = false; // שינוי הדגל ל-false - הטופס לא תקין
    }

    // בדיקה אם יש שגיאות - אם כן לא ממשיכים
    if (!valid) { // בדיקה: האם הדגל מסמן שהטופס לא תקין
        return; // יציאה מהפונקציה - לא ממשיכים לשליחה
    }

    // אם הגענו לכאן - הכל תקין
    // פתיחת המודל לפני שליחה
    openSurveyModal(); // קריאה לפונקציה שפותחת את חלון ההודעות

    // שליחה ל-LMS
    sendSurveyToLMS(); // קריאה לפונקציה ששולחת את הנתונים
}



// ========================================
// פונקציות עזר לולידציה
// ========================================

// פונקציה לבדיקת אימייל 
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // ביטוי רגולרי לבדיקת פורמט אימייל
    return re.test(email); // החזרת תוצאת הבדיקה (true/false)
}

// פונקציה להצגת הודעת שגיאה ליד שדה ספציפי מקבלת את השדה שבו יהיה צריך להזריק את הודעת השגיאה ומקבלת את תוכן הודעת השגיאה
function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + '-error'); // שליפת אלמנט הודעת השגיאה לפי ID (שם השדה + '-error')

    if (errorElement) { // בדיקה: האם אלמנט הודעת השגיאה קיים 
        errorElement.textContent = message; // הצבת טקסט ההודעה לתוך האלמנט
        errorElement.classList.add('show'); // הוספת מחלקת 'show' שמציגה את ההודעה (CSS: display: block)
    }
}

// פונקציה לאיפוס כל הודעות השגיאה בטופס
function clearAllErrors() {
    // איפוס הודעות שגיאה
    const errorMessages = document.querySelectorAll('.error-message'); // שליפת כל האלמנטים עם מחלקת 'error-message'
    errorMessages.forEach(function(error) { // מעבר על כל אלמנט בלולאה
        error.textContent = ''; // מחיקת התוכן של ההודעה (מחרוזת ריקה)
        error.classList.remove('show'); // הסרת מחלקת 'show' - ההודעה תיעלם
    });
}


// ========================================
// ניהול חלון הודעות (Modal)
// ========================================

//  פונקציה לפתיחת המודל 
function openSurveyModal() {
    const modal = document.getElementById('modal-submit'); // שליפת אלמנט המודל  לפי ID
    if (!modal) return; // בדיקה: האם המודל קיים - אם לא, יוצאים מהפונקציה

    // הצגת המודל על המסך
    modal.classList.remove('d-none'); // הסרת מחלקת 'd-none' (display: none) - המודל יופיע

    // איפוס מצב המודל להצגת טעינה
    modal.querySelector('#state-loading').classList.remove('d-none'); // הצגת מסך "שולח נתונים..."
    modal.querySelector('#state-success').classList.add('d-none'); // הסתרת מסך "הסקר נשלח בהצלחה"
    modal.querySelector('#state-error').classList.add('d-none'); // הסתרת מסך "שגיאה בשליחה"
}

//  פונקציה לסגירת המודל 
function closeSurveyModal() {
    const modal = document.getElementById('modal-submit'); // שליפת אלמנט המודל  לפי ID
    if (!modal) return; // בדיקה: האם המודל קיים - אם לא, יוצאים מהפונקציה
    modal.classList.add('d-none'); // הוספת מחלקת 'd-none' (display: none) - המודל ייעלם
}

function showSurveySuccessMessage() {
    const modal = document.getElementById('modal-submit'); // שליפת אלמנט המודל  לפי ID
    if (!modal) return; // בדיקה: האם המודל קיים - אם לא, יוצאים מהפונקציה

    modal.querySelector('#state-loading').classList.add('d-none'); // הסתרת מסך "שולח נתונים..."
    modal.querySelector('#state-success').classList.remove('d-none'); // הצגת מסך "הסקר נשלח בהצלחה"

    // הגדרת סגירה אוטומטית של המודל
    setTimeout(() => { // הגדרת טיימר שירוץ אחרי 3000 מילישניות (3 שניות)
        closeSurveyModal(); // סגירת המודל
        // איפוס הטופס אחרי שליחה מוצלחת
        document.getElementById('surveyForm').reset(); // איפוס כל שדות הטופס לערכי ברירת המחדל
        document.getElementById('visitPurposeBtn').textContent = ''; //איפוס שדה דרופדאון
        clearAllErrors(); // ניקוי כל הודעות השגיאה שמוצגות
    }, 3000); // זמן המתנה: 3000 מילישניות = 3 שניות
}

function showSurveyErrorMessage() {
    const modal = document.getElementById('modal-submit'); // שליפת אלמנט המודל  לפי ID
    if (!modal) return; // בדיקה: האם המודל קיים - אם לא, יוצאים מהפונקציה

    modal.querySelector('#state-loading').classList.add('d-none'); // הסתרת מסך "שולח נתונים..."
    modal.querySelector('#state-error').classList.remove('d-none'); // הצגת מסך "שגיאה - לא ניתן לשלוח"

    // הגדרת סגירה אוטומטית של המודל
    setTimeout(() => { // הגדרת טיימר שירוץ אחרי 5000 מילישניות (5 שניות)
        closeSurveyModal(); // סגירת המודל
    }, 5000); // זמן המתנה: 5000 מילישניות = 5 שניות
}


// ========================================
// שליחת נתוני הסקר ל-LMS
// ========================================

function sendSurveyToLMS() {

    // בדיקה שיש חיבור פעיל ל-SCORM
    if (!isScormConnected) { // בדיקה: האם המשתנה מסמן שאין חיבור
        console.error('[SCORM] No connection to LMS'); // הדפסת שגיאה לקונסול הדפדפן
        showSurveyErrorMessage(); // הצגת הודעת שגיאה למשתמש במודל
        return; // יציאה מהפונקציה - לא ממשיכים עם השליחה
    }

    const scorm = pipwerks.SCORM; // שמירת הפניה לאובייקט SCORM (קיצור דרך לשימוש נוח)

    const name = document.getElementById('userName').value.trim(); // שליפת ערך שדה השם והסרת רווחים מיותרים
    const email = document.getElementById('userEmail').value.trim(); // שליפת ערך שדה האימייל והסרת רווחים מיותרים
    const visitPurpose = document.getElementById('visitPurpose').value; // שליפת ערך שדה סיבת הביקור (האופציה שנבחרה)
    const rating = document.querySelector('input[name="rating"]:checked').value; // שליפת ערך הדירוג מהכפתור המסומן
    const comments = document.getElementById('comments').value.trim(); // שליפת ערך שדה ההערות והסרת רווחים מיותרים

    const dataSet = "Name:" + name + ", Email:" + email + ", Visit purpose:" + visitPurpose + ", Rating:" + rating + ", Comment:" + comments; // איחוד כל הנתונים למחרוזת טקסט אחת מופרדת בפסיקים
    let i = parseInt(scorm.get('cmi.interactions._count') || '0', 10); // שליפת מספר ה-interactions הקיימים מה-LMS (אם אין - ערך ברירת מחדל '0'), המרה למספר שלם בבסיס 10
    if (!Number.isFinite(i)) i = 0; // בדיקה: האם המספר תקין (finite) - אם לא, איפוס ל-0

    const base = `cmi.interactions.${i}`; // בניית המסלול ב-SCORM למיקום ה-interaction החדש 

    scorm.set(`${base}.id`, 'survey_ux_feedback'); // שמירת מזהה ייחודי ל-interaction
    scorm.set(`${base}.type`, 'other'); // הגדרת סוג ה-interaction כ-'other' (לא שאלה/תשובה רגילה)
    scorm.set(`${base}.student_response`,  dataSet); // שמירת תשובת הסטודנט (כל הנתונים שאספנו)  
    scorm.set(`${base}.result`, 'neutral'); // הגדרת תוצאה כ-'neutral' (ללא ציון חיובי/שלילי)

    scorm.save(); // שמירת כל הנתונים שהוגדרו ל-LMS (Commit למסד הנתונים)

    // הצגת הודעת הצלחה למשתמש
    showSurveySuccessMessage(); // קריאה לפונקציה שמציגה הודעת "הסקר נשלח בהצלחה"


}