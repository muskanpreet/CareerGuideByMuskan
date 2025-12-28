// ============================
// Firebase Configuration
// ============================
// Note: firebaseConfig is already defined in index.html

let isFirebaseInitialized = false;

// Get database reference from global window object or initialize
function getFirebaseDB() {
    if (window.firebaseDatabase) {
        return window.firebaseDatabase;
    }
    
    if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
        return firebase.database();
    }
    
    return null;
}

function initFirebase() {
    try {
        if (typeof firebase !== 'undefined') {
            // Check if already initialized
            if (firebase.apps.length === 0) {
                console.log('initFirebase: Initializing Firebase app...');
                firebase.initializeApp(firebaseConfig);
            } else {
                console.log('initFirebase: Firebase already initialized');
            }
            
            const db = firebase.database();
            window.firebaseDatabase = db; // Ensure globally available
            isFirebaseInitialized = true;
            window.isFirebaseInitialized = true; // Make globally accessible
            console.log('✅ Firebase Database initialized and ready');
            
            // Sync local bookings to Firebase
            setTimeout(() => {
                console.log('initFirebase: Starting sync after 100ms...');
                syncLocalToFirebase();
            }, 100);
        } else {
            console.error('initFirebase: Firebase SDK not loaded');
        }
    } catch (error) {
        console.error('initFirebase: Error during initialization:', error);
        isFirebaseInitialized = false;
        window.isFirebaseInitialized = false;
    }
}

function saveBookingHybrid(bookingData) {
    console.log('=== saveBookingHybrid START ===');
    console.log('Input data:', bookingData);
    
    const booking = saveBookingLocal(bookingData);
    console.log('After saveBookingLocal:', booking);
    console.log('Firebase initialized:', isFirebaseInitialized);
    
    if (isFirebaseInitialized && booking) {
        try {
            const db = getFirebaseDB();
            if (db) {
                console.log('Firebase DB available, saving with ID:', booking.id);
                db.ref('bookings/' + booking.id).set(booking);
                console.log('✅ Successfully saved to Firebase:', booking.id);
            } else {
                console.warn('❌ Firebase DB object not available');
            }
        } catch (error) {
            console.error('❌ Error saving to Firebase:', error.message);
        }
    } else {
        console.warn('❌ Firebase not initialized or booking is null');
        console.warn('   Firebase initialized:', isFirebaseInitialized);
        console.warn('   Booking:', booking);
    }
    console.log('=== saveBookingHybrid END ===');
    return booking;
}

function getAllBookingsFromFirebase(callback) {
    console.log('getAllBookingsFromFirebase: called, Firebase initialized:', isFirebaseInitialized);
    
    if (!isFirebaseInitialized) {
        console.log('getAllBookingsFromFirebase: Firebase not initialized, using localStorage');
        callback(getAllBookingsLocal());
        return;
    }
    
    const db = getFirebaseDB();
    if (!db) {
        console.warn('getAllBookingsFromFirebase: Firebase DB not available, using localStorage');
        callback(getAllBookingsLocal());
        return;
    }
    
    db.ref('bookings').once('value')
        .then((snapshot) => {
            const bookings = [];
            if (snapshot.exists()) {
                snapshot.forEach((child) => {
                    bookings.push(child.val());
                });
                console.log('✅ getAllBookingsFromFirebase: Retrieved', bookings.length, 'bookings from Firebase');
            } else {
                console.log('getAllBookingsFromFirebase: No bookings in Firebase');
            }
            callback(bookings);
        })
        .catch((error) => {
            console.error('❌ getAllBookingsFromFirebase: Error reading from Firebase:', error);
            console.log('getAllBookingsFromFirebase: Falling back to localStorage');
            callback(getAllBookingsLocal());
        });
}

function deleteBookingFromFirebase(id) {
    if (!isFirebaseInitialized) return;
    try {
        const db = getFirebaseDB();
        if (db) {
            db.ref('bookings/' + id).remove();
        }
    } catch (error) {
        console.error('Error deleting from Firebase:', error);
    }
}

function syncLocalToFirebase() {
    if (!isFirebaseInitialized) {
        console.log('syncLocalToFirebase: Firebase not initialized, skipping sync');
        return;
    }
    
    const db = getFirebaseDB();
    if (!db) {
        console.warn('syncLocalToFirebase: Firebase DB object not available');
        return;
    }
    
    const localBookings = getAllBookingsLocal();
    console.log('syncLocalToFirebase: Found', localBookings.length, 'local bookings to check');
    
    db.ref('bookings').once('value').then((snapshot) => {
        if (!snapshot.exists() && localBookings.length > 0) {
            console.log('syncLocalToFirebase: Firebase empty, syncing all', localBookings.length, 'local bookings');
            localBookings.forEach(booking => {
                try {
                    db.ref('bookings/' + booking.id).set(booking);
                    console.log('  Synced booking:', booking.id);
                } catch (error) {
                    console.error('  Error syncing booking:', booking.id, error);
                }
            });
        } else if (snapshot.exists()) {
            const firebaseBookings = [];
            snapshot.forEach((child) => {
                firebaseBookings.push(child.val());
            });
            
            console.log('syncLocalToFirebase: Firebase has', firebaseBookings.length, 'bookings, updating localStorage');
            if (firebaseBookings.length > 0) {
                localStorage.setItem(BOOKINGS_KEY, JSON.stringify(firebaseBookings));
                console.log('✅ localStorage synced from Firebase');
            }
        } else {
            console.log('syncLocalToFirebase: No bookings in Firebase or localStorage');
        }
    }).catch((error) => {
        console.error('syncLocalToFirebase: Error syncing to Firebase:', error);
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
            timestamp: new Date().toISOString(),
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
