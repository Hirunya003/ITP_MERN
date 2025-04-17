import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '../components/home/Header';

const CashierDashboard = () => {
  const { user } = useContext(AuthContext);
  
  // Only allow cashier@example.com to access this page
  if (!user || user.email !== 'cashier@example.com') {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Header searchTerm="" setSearchTerm={() => {}} cartCount={0} />
      
      <div className="max-w-6xl mx-auto mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Cashier Dashboard</h2>
          
          {/* Cashier-specific content */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fas fa-info-circle text-blue-500"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Welcome to the Cashier Portal. Here you can manage customer transactions and payments.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick actions */}
            <div className="bg-white p-4 rounded-lg border shadow">
              <h3 className="font-semibold text-lg mb-2">New Transaction</h3>
              <p className="text-gray-600 mb-4">Start a new customer checkout process</p>
              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Start Checkout
              </button>
            </div>
            
            <div className="bg-white p-4 rounded-lg border shadow">
              <h3 className="font-semibold text-lg mb-2">Process Returns</h3>
              <p className="text-gray-600 mb-4">Handle customer returns and refunds</p>
              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Process Return
              </button>
            </div>
            
            <div className="bg-white p-4 rounded-lg border shadow">
              <h3 className="font-semibold text-lg mb-2">Daily Summary</h3>
              <p className="text-gray-600 mb-4">View your transaction history for today</p>
              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                View Summary
              </button>
            </div>
          </div>
          
          {/* Recent transactions section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Sample data - would be fetched from API in real application */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">TRX-12345</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">John Doe</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">$124.00</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date().toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Completed
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">TRX-12344</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">Jane Smith</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">$75.50</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date().toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Completed
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashierDashboard;
