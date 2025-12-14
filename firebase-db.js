// ============================
// Firebase Configuration
// ============================
// Note: firebaseConfig is already defined in index.html

let db;
let isFirebaseInitialized = false;

// Make isFirebaseInitialized globally accessible
window.isFirebaseInitialized = isFirebaseInitialized;

function initFirebase() {
    try {
        if (typeof firebase !== 'undefined') {
            // Check if already initialized
            if (firebase.apps.length === 0) {
                firebase.initializeApp(firebaseConfig);
            }
            
            db = firebase.database();
            isFirebaseInitialized = true;
            window.isFirebaseInitialized = true; // Make globally accessible
            console.log('Firebase Database initialized');
            syncLocalToFirebase();
        }
    } catch (error) {
        console.error('Firebase initialization error:', error);
        isFirebaseInitialized = false;
        window.isFirebaseInitialized = false;
    }
}

function saveBookingHybrid(bookingData) {
    const booking = saveBookingLocal(bookingData);
    if (isFirebaseInitialized && booking) {
        try {
            db.ref('bookings/' + booking.id).set(booking);
        } catch (error) {}
    }
    return booking;
}

function getAllBookingsFromFirebase(callback) {
    if (!isFirebaseInitialized) {
        callback(getAllBookingsLocal());
        return;
    }
    
    db.ref('bookings').once('value')
        .then((snapshot) => {
            const bookings = [];
            snapshot.forEach((child) => {
                bookings.push(child.val());
            });
            callback(bookings);
        })
        .catch(() => {
            callback(getAllBookingsLocal());
        });
}

function deleteBookingFromFirebase(id) {
    if (!isFirebaseInitialized) return;
    try {
        db.ref('bookings/' + id).remove();
    } catch (error) {}
}

function syncLocalToFirebase() {
    if (!isFirebaseInitialized) return;
    
    const localBookings = getAllBookingsLocal();
    
    db.ref('bookings').once('value').then((snapshot) => {
        if (!snapshot.exists() && localBookings.length > 0) {
            localBookings.forEach(booking => {
                try {
                    db.ref('bookings/' + booking.id).set(booking);
                } catch (error) {}
            });
        } else if (snapshot.exists()) {
            const firebaseBookings = [];
            snapshot.forEach((child) => {
                firebaseBookings.push(child.val());
            });
            
            if (firebaseBookings.length > 0) {
                localStorage.setItem(BOOKINGS_KEY, JSON.stringify(firebaseBookings));
            }
        }
    });
}

function generateBookingId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `BKG-${timestamp}-${random}`;
}

function saveBookingLocal(bookingData) {
    try {
        const bookings = getAllBookingsLocal();
        
        const booking = {
            id: generateBookingId(),
            ...bookingData,
            createdAt: new Date().toISOString(),
            status: 'confirmed'
        };
        
        bookings.push(booking);
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
        return booking;
    } catch (error) {
        return null;
    }
}

function getAllBookingsLocal() {
    try {
        const bookings = localStorage.getItem(BOOKINGS_KEY);
        return bookings ? JSON.parse(bookings) : [];
    } catch (error) {
        return [];
    }
}

function deleteBookingLocal(id) {
    try {
        const bookings = getAllBookingsLocal();
        const filtered = bookings.filter(booking => booking.id !== id);
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(filtered));
        return true;
    } catch (error) {
        return false;
    }
}

function saveBooking(bookingData) {
    return saveBookingHybrid(bookingData);
}

function getAllBookings() {
    return getAllBookingsLocal();
}

function deleteBooking(id) {
    deleteBookingFromFirebase(id);
    return deleteBookingLocal(id);
}

if (typeof firebase !== 'undefined') {
    initFirebase();
}
