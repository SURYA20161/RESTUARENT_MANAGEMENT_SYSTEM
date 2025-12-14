import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Mail, Phone, User, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import Header from './home/Header';
import { useAuth } from '../Context/AuthProvider';

const UserTableBookings = () => {
  const authContext = useAuth();
  if (!authContext) return null;

  const [authUser] = authContext;
  const [bookings, setBookings] = useState([
    {
      _id: '507f1f77bcf86cd799439011',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      date: '2025-11-15',
      timeSlot: '7:00 PM',
      guests: 4,
      status: 'Confirmed',
      specialRequest: 'Window seat preferred, celebrating anniversary',
      createdAt: '2025-10-20T10:30:00Z',
      updatedAt: '2025-10-20T10:30:00Z'
    },
    {
      _id: '507f1f77bcf86cd799439012',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      date: '2025-11-01',
      timeSlot: '6:30 PM',
      guests: 2,
      status: 'Pending',
      specialRequest: '',
      createdAt: '2025-10-25T14:20:00Z',
      updatedAt: '2025-10-25T14:20:00Z'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    if (authUser) {
      fetchBookings();
    }
  }, [authUser]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/table-booking/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed': return '✓';
      case 'Pending': return '⏱';
      case 'Cancelled': return '✕';
      default: return '•';
    }
  };

  if (!authUser) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 pt-20 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Welcome Back!</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">Sign in to view and manage your table reservations</p>
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 pt-20">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                My Reservations
              </h1>
              <p className="text-gray-600">Manage your table bookings</p>
            </div>
            <button
              onClick={() => window.location.href = '/profile'}
              className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-orange-50 transition-all duration-200"
            >
              <span>←</span> Back to Profile
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse border border-gray-100">
                  <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg mb-2"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-1/2"></div>
                </div>
              ))}
            </div>
          ) : bookings.length > 0 ? (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div key={booking._id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-orange-200">
                  <div className="p-6 md:p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-sm">🍽️</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              Booking #{booking._id.slice(-8).toUpperCase()}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Created {new Date(booking.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(booking.status)} shadow-sm`}>
                          <span>{getStatusIcon(booking.status)}</span>
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-5 border border-gray-200">
                          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <User className="w-4 h-4 text-orange-600" />
                            Contact Information
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <User className="w-4 h-4 text-gray-400 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-xs text-gray-500 mb-0.5">Name</p>
                                <p className="text-sm font-medium text-gray-800">{booking.name}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-xs text-gray-500 mb-0.5">Email</p>
                                <p className="text-sm font-medium text-gray-800">{booking.email}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                                <p className="text-sm font-medium text-gray-800">{booking.phone}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-amber-50/50 rounded-xl p-5 border border-orange-100">
                          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-orange-600" />
                            Reservation Details
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <Calendar className="w-4 h-4 text-orange-400 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-xs text-gray-600 mb-0.5">Date</p>
                                <p className="text-sm font-bold text-gray-800">{booking.date}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Clock className="w-4 h-4 text-orange-400 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-xs text-gray-600 mb-0.5">Time</p>
                                <p className="text-sm font-bold text-gray-800">{booking.timeSlot}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Users className="w-4 h-4 text-orange-400 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-xs text-gray-600 mb-0.5">Party Size</p>
                                <p className="text-sm font-bold text-gray-800">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {booking.specialRequest && (
                        <div className="mb-6">
                          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-orange-600" />
                            Special Requests
                          </h4>
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100 p-4 rounded-xl">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {booking.specialRequest}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <button
                          onClick={() => setSelectedBooking(selectedBooking === booking._id ? null : booking._id)}
                          className="text-orange-600 hover:text-orange-700 font-semibold text-sm flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-orange-50 transition-all duration-200"
                        >
                          {selectedBooking === booking._id ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              Hide Details
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              Show More Details
                            </>
                          )}
                        </button>
                      </div>

                      {selectedBooking === booking._id && (
                        <div className="mt-4 p-5 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-200 animate-in fade-in duration-200">
                          <h5 className="font-bold text-gray-800 mb-4">Booking Timeline</h5>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                              <span className="text-sm text-gray-600 font-medium">Created</span>
                              <span className="text-sm text-gray-800 font-semibold">{new Date(booking.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                              <span className="text-sm text-gray-600 font-medium">Status</span>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>
                                {getStatusIcon(booking.status)} {booking.status}
                              </span>
                            </div>
                            {booking.updatedAt !== booking.createdAt && (
                              <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                                <span className="text-sm text-gray-600 font-medium">Last Updated</span>
                                <span className="text-sm text-gray-800 font-semibold">{new Date(booking.updatedAt).toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
              <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-7xl">🍽️</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">No Reservations Yet</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                Ready to enjoy an amazing dining experience? Book your table now and savor our delicious cuisine!
              </p>
              <button
                onClick={() => window.location.href = '/table-booking'}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Book a Table Now
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserTableBookings;