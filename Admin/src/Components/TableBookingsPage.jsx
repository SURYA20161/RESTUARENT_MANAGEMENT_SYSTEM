import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Users,
  Filter,
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpDown,
  Download
} from "lucide-react";
import AdminNavbar from "./AdminNavbar";

const TableBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [showMoreActions, setShowMoreActions] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [loading, setLoading] = useState(true);

  const statusOptions = ["Pending", "Confirmed", "Cancelled"];
  const statusIcons = {
    Pending: <AlertCircle className="w-4 h-4 text-yellow-500" />,
    Confirmed: <CheckCircle className="w-4 h-4 text-green-500" />,
    Cancelled: <XCircle className="w-4 h-4 text-red-500" />
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/table-booking/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBookings(response.data.bookings);
      toast.success("Table bookings loaded successfully");
    } catch (error) {
      console.error("Error fetching table bookings:", error);
      toast.error("Error fetching table bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/table-booking/${bookingId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setBookings(
        bookings.map((booking) =>
          booking._id === bookingId ? { ...booking, status: response.data.booking.status } : booking
        )
      );
      toast.success(`Booking status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("Error updating booking status");
    }
  };

  const toggleMoreActions = (bookingId) => {
    setShowMoreActions(showMoreActions === bookingId ? null : bookingId);
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const filterBookings = (bookings) => {
    let filteredBookings = [...bookings];

    if (statusFilter !== "all") {
      filteredBookings = filteredBookings.filter((booking) => booking.status === statusFilter);
    }

    if (timeFilter !== "all") {
      const currentTime = new Date();
      let timeLimit;

      switch(timeFilter) {
        case "last24":
          timeLimit = new Date(currentTime.setHours(currentTime.getHours() - 24));
          break;
        case "last7":
          timeLimit = new Date(currentTime.setDate(currentTime.getDate() - 7));
          break;
        case "last30":
          timeLimit = new Date(currentTime.setDate(currentTime.getDate() - 30));
          break;
        default:
          break;
      }

      filteredBookings = filteredBookings.filter((booking) => new Date(booking.createdAt) > timeLimit);
    }

    if (searchTerm) {
      filteredBookings = filteredBookings.filter((booking) =>
        booking._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig.key) {
      filteredBookings.sort((a, b) => {
        if (sortConfig.key === 'customer') {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          return sortConfig.direction === 'asc' ?
            nameA.localeCompare(nameB) :
            nameB.localeCompare(nameA);
        }
        return sortConfig.direction === 'asc' ?
          a[sortConfig.key] > b[sortConfig.key] ? 1 : -1 :
          a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
      });
    }

    return filteredBookings;
  };

  const exportToCSV = () => {
    const filteredBookings = filterBookings(bookings);
    const csvContent = [
      ["Booking ID", "Customer Name", "Email", "Phone", "Date", "Time", "Guests", "Status", "Created At"],
      ...filteredBookings.map(booking => [
        booking._id,
        booking.name,
        booking.email,
        booking.phone,
        booking.date,
        booking.timeSlot,
        booking.guests,
        booking.status,
        new Date(booking.createdAt).toLocaleString()
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `table-bookings-${new Date().toISOString()}.csv`;
    a.click();
  };

  const getStatusBadgeClasses = (status) => {
    const baseClasses = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200";
    switch(status) {
      case "Pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`;
      case "Confirmed":
        return `${baseClasses} bg-green-100 text-green-800 border border-green-200`;
      case "Cancelled":
        return `${baseClasses} bg-red-100 text-red-800 border border-red-200`;
      default:
        return baseClasses;
    }
  };

  return (
    <>
      <AdminNavbar/>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Table Bookings Management
                </h1>
                <p className="text-sm text-gray-500 mt-1">Manage and track all restaurant reservations</p>
              </div>
            </div>
            <button
              onClick={exportToCSV}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 mb-6 animate-slide-up">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[250px]">
                <div className="relative group">
                  <Search className="w-5 h-5 absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200" />
                  <input
                    type="text"
                    placeholder="Search by ID, name, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-colors duration-200">
                  <Filter className="w-4 h-4 text-gray-600" />
                  <select
                    className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm font-medium text-gray-700 cursor-pointer"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-colors duration-200">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <select
                    className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm font-medium text-gray-700 cursor-pointer"
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                  >
                    <option value="all">All Time</option>
                    <option value="last24">Last 24 Hours</option>
                    <option value="last7">Last 7 Days</option>
                    <option value="last30">Last 30 Days</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-slide-up">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <th className="px-6 py-4 text-left cursor-pointer hover:bg-blue-700 transition-colors duration-200" onClick={() => handleSort('_id')}>
                      <div className="flex items-center gap-2 font-semibold">
                        <span>Booking ID</span>
                        <ArrowUpDown className="w-4 h-4 opacity-70" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left cursor-pointer hover:bg-blue-700 transition-colors duration-200" onClick={() => handleSort('customer')}>
                      <div className="flex items-center gap-2 font-semibold">
                        <User className="w-4 h-4" />
                        <span>Customer</span>
                        <ArrowUpDown className="w-4 h-4 opacity-70" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 font-semibold">
                        <Calendar className="w-4 h-4" />
                        <span>Date & Time</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 font-semibold">
                        <Users className="w-4 h-4" />
                        <span>Guests</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                    <th className="px-6 py-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filterBookings(bookings).map((booking, index) => (
                    <tr 
                      key={booking._id} 
                      className="hover:bg-blue-50/50 transition-all duration-200 animate-fade-in"
                      style={{animationDelay: `${index * 50}ms`}}
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
                          #{booking._id.slice(-8)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-md">
                            {booking.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-800">{booking.name}</span>
                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                              <Mail className="w-3 h-3" />
                              <span>{booking.email}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Phone className="w-3 h-3" />
                              <span>{booking.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-gray-800 font-medium">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span>{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span>{booking.timeSlot}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-lg w-fit">
                          <Users className="w-4 h-4 text-indigo-600" />
                          <span className="text-gray-800 font-semibold">{booking.guests}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={getStatusBadgeClasses(booking.status)}>
                          {statusIcons[booking.status]}
                          <span className="capitalize">{booking.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <button
                            className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:shadow-md group"
                            onClick={() => toggleMoreActions(booking._id)}
                          >
                            <MoreHorizontal className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
                          </button>

                          {showMoreActions === booking._id && (
                            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-200 z-10 animate-scale-in overflow-hidden">
                              {statusOptions.map((status) => (
                                <button
                                  key={status}
                                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors duration-150 border-b last:border-b-0 border-gray-100"
                                  onClick={() => {
                                    handleStatusChange(booking._id, status);
                                    setShowMoreActions(null);
                                  }}
                                >
                                  {statusIcons[status]}
                                  <span className="capitalize font-medium text-gray-700">Mark as {status}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filterBookings(bookings).length === 0 && (
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg mt-6">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No bookings found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default TableBookingsPage;