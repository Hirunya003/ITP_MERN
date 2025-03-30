import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '../components/home/Header';

const StorekeeperDashboard = () => {
  const { user } = useContext(AuthContext);
  
  // Only allow storekeeper@example.com to access this page
  if (!user || user.email !== 'storekeeper@example.com') {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Header searchTerm="" setSearchTerm={() => {}} cartCount={0} />
      
      <div className="max-w-6xl mx-auto mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Storekeeper Dashboard</h2>
          
          {/* Storekeeper-specific content */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fas fa-warehouse text-yellow-500"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Welcome to the Inventory Management Portal. Here you can manage product inventory and stock levels.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick actions */}
            <div className="bg-white p-4 rounded-lg border shadow">
              <h3 className="font-semibold text-lg mb-2">Add Inventory</h3>
              <p className="text-gray-600 mb-4">Add new products to inventory</p>
              <button className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700">
                Add Products
              </button>
            </div>
            
            <div className="bg-white p-4 rounded-lg border shadow">
              <h3 className="font-semibold text-lg mb-2">Update Stock</h3>
              <p className="text-gray-600 mb-4">Update existing inventory quantities</p>
              <button className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700">
                Update Stock
              </button>
            </div>
            
            <div className="bg-white p-4 rounded-lg border shadow">
              <h3 className="font-semibold text-lg mb-2">Generate Report</h3>
              <p className="text-gray-600 mb-4">Create inventory reports</p>
              <button className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700">
                Create Report
              </button>
            </div>
          </div>
          
          {/* Low stock alerts section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Low Stock Alerts</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Minimum Stock
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
                      <div className="text-sm font-medium text-gray-900">PRD-100</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">Fresh Apples</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">5</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      10
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Critical
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">PRD-102</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">Milk</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">8</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      12
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Warning
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

export default StorekeeperDashboard;
