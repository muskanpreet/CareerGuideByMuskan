// ============================
// Local Storage Database
// ============================

const DB_NAME = 'careerGuideBookings';
const BOOKINGS_KEY = 'bookings';

function initDatabase() {
    if (!localStorage.getItem(BOOKINGS_KEY)) {
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify([]));
    }
}

// Get all bookings - from localStorage (synced with Firebase)
function getAllBookings() {
    try {
        const bookings = localStorage.getItem(BOOKINGS_KEY);
        return bookings ? JSON.parse(bookings) : [];
    } catch (error) {
        console.error('Error getting bookings:', error);
        return [];
    }
}

// Get all bookings from Firebase with callback (for admin dashboard)
function getAllBookingsFromFirebaseSync(callback) {
    if (typeof getAllBookingsFromFirebase === 'function') {
        getAllBookingsFromFirebase(callback);
    } else {
        callback(getAllBookings());
    }
}

function getBookingById(id) {
    const bookings = getAllBookings();
    return bookings.find(booking => booking.id === id);
}

function getBookingsByEmail(email) {
    const bookings = getAllBookings();
    return bookings.filter(booking => booking.email === email);
}

function getBookingsByDate(date) {
    const bookings = getAllBookings();
    return bookings.filter(booking => booking.date === date);
}

function updateBookingStatus(id, status) {
    try {
        const bookings = getAllBookings();
        const index = bookings.findIndex(booking => booking.id === id);
        
        if (index !== -1) {
            bookings[index].status = status;
            bookings[index].updatedAt = new Date().toISOString();
            localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

function blockTimeSlot(date, time, reason = 'Unavailable') {
    const blockData = {
        name: 'Admin Block',
        email: 'admin@block',
        phone: 'N/A',
        sessionType: 'blocked',
        date: date,
        time: time,
        message: reason,
        status: 'blocked'
    };
    return saveBooking(blockData);
}

function saveBooking(bookingData) {
    try {
        // Always use saveBookingHybrid for Firebase sync if available
        if (typeof saveBookingHybrid === 'function') {
            console.log('saveBooking: Using saveBookingHybrid for Firebase sync');
            return saveBookingHybrid(bookingData);
        }
        
        // Fallback: save to localStorage only
        console.warn('saveBooking: saveBookingHybrid not available, using localStorage only');
        const booking = {
            id: generateBookingId(),
            ...bookingData,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };
        
        const bookings = getAllBookings();
        bookings.push(booking);
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
        
        return booking;
    } catch (error) {
        console.error('Error saving booking:', error);
        return null;
    }
}

function unblockTimeSlot(date, time) {
    const bookings = getAllBookings();
    const blocked = bookings.find(b => 
        b.date === date && 
        b.time === time && 
        b.sessionType === 'blocked'
    );
    if (blocked) {
        return deleteBooking(blocked.id);
    }
    return false;
}

function isSlotBlocked(date, time) {
    return false;
}

function deleteBooking(id) {
    try {
        // Delete from localStorage
        const bookings = getAllBookings();
        const filtered = bookings.filter(booking => booking.id !== id);
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(filtered));
        console.log('deleteBooking: Deleted from localStorage:', id);
        
        // Delete from Firebase if available
        if (typeof deleteBookingFromFirebase === 'function') {
            deleteBookingFromFirebase(id);
            console.log('deleteBooking: Deleted from Firebase:', id);
        }
        
        return true;
    } catch (error) {
        console.error('Error deleting booking:', error);
        return false;
    }
}

function generateBookingId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `BKG-${timestamp}-${random}`;
}

function exportBookings() {
    const bookings = getAllBookings();
    const dataStr = JSON.stringify(bookings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `bookings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
}

function importBookings(jsonData) {
    try {
        const bookings = JSON.parse(jsonData);
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
        return true;
    } catch (error) {
        return false;
    }
}

function getBookingStats() {
    const bookings = getAllBookings();
    return {
        total: bookings.length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        quickSessions: bookings.filter(b => b.sessionType === '30min').length,
        detailedSessions: bookings.filter(b => b.sessionType === '60min').length,
        totalRevenue: bookings.reduce((sum, b) => {
            const amount = b.sessionType === '30min' ? 199 : 299;
            return sum + amount;
        }, 0)
    };
}

function isSlotAvailable(date, time) {
    const bookings = getBookingsByDate(date);
    const isAvailable = !bookings.some(booking => booking.time === time);
    console.log('isSlotAvailable:', { date, time, available: isAvailable, bookedCount: bookings.length });
    return isAvailable;
}

initDatabase();
