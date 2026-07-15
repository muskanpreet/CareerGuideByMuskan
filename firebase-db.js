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
                firebase.initializeApp(firebaseConfig);
            } else {
            }
            
            const db = firebase.database();
            window.firebaseDatabase = db; // Ensure globally available
            isFirebaseInitialized = true;
            window.isFirebaseInitialized = true; // Make globally accessible
            
            // Sync local bookings to Firebase
            setTimeout(() => {
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
    
    const booking = saveBookingLocal(bookingData);
    
    if (isFirebaseInitialized && booking) {
        try {
            const db = getFirebaseDB();
            if (db) {
                db.ref('bookings/' + booking.id).set(booking);
            } else {
            }
        } catch (error) {
            console.error('❌ Error saving to Firebase:', error.message);
        }
    } else {
    }
    return booking;
}

function getAllBookingsFromFirebase(callback) {
    
    if (!isFirebaseInitialized) {
        callback(getAllBookingsLocal());
        return;
    }
    
    const db = getFirebaseDB();
    if (!db) {
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
            } else {
            }
            callback(bookings);
        })
        .catch((error) => {
            console.error('❌ getAllBookingsFromFirebase: Error reading from Firebase:', error);
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
        return;
    }
    
    const db = getFirebaseDB();
    if (!db) {
        return;
    }
    
    const localBookings = getAllBookingsLocal();
    
    db.ref('bookings').once('value').then((snapshot) => {
        if (!snapshot.exists() && localBookings.length > 0) {
            localBookings.forEach(booking => {
                try {
                    db.ref('bookings/' + booking.id).set(booking);
                } catch (error) {
                    console.error('  Error syncing booking:', booking.id, error);
                }
            });
        } else if (snapshot.exists()) {
            const firebaseBookings = [];
            snapshot.forEach((child) => {
                firebaseBookings.push(child.val());
            });
            
            if (firebaseBookings.length > 0) {
                localStorage.setItem(BOOKINGS_KEY, JSON.stringify(firebaseBookings));
            }
        } else {
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

/**
 * Firebase-first slot availability check. Prevents two people (or admin + a
 * customer) from writing the same slot when localStorage on one device hasn't
 * synced yet. Falls back to localStorage-only check if Firebase is unavailable.
 * Returns a Promise<boolean>.
 */
function isSlotAvailableFirebase(date, time) {
    return new Promise((resolve) => {
        if (!isFirebaseInitialized) {
            resolve(typeof isSlotAvailable === 'function' ? isSlotAvailable(date, time) : true);
            return;
        }
        const db = getFirebaseDB();
        if (!db) {
            resolve(typeof isSlotAvailable === 'function' ? isSlotAvailable(date, time) : true);
            return;
        }
        db.ref('bookings').orderByChild('date').equalTo(date).once('value')
            .then((snapshot) => {
                let available = true;
                if (snapshot.exists()) {
                    snapshot.forEach((child) => {
                        const b = child.val();
                        if (b && b.time === time) available = false;
                    });
                }
                // Also union with local check so unsynced local blocks aren't ignored
                const localOk = (typeof isSlotAvailable === 'function') ? isSlotAvailable(date, time) : true;
                resolve(available && localOk);
            })
            .catch((err) => {
                resolve(typeof isSlotAvailable === 'function' ? isSlotAvailable(date, time) : true);
            });
    });
}

if (typeof firebase !== 'undefined') {
    initFirebase();
}
