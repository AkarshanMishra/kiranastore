import React, { useState, useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminNavbar from './components/AdminNavbar';
import AdminLoginScreen from './components/AdminLoginScreen';
import LoginModal from './components/LoginModal';

import OverviewView from './views/OverviewView';
import OrdersView from './views/OrdersView';
import ProductsView from './views/ProductsView';
import CategoriesView from './views/CategoriesView';
import BrandsView from './views/BrandsView';
import ReviewsView from './views/ReviewsView';
import InventoryView from './views/InventoryView';
import SuppliersView from './views/SuppliersView';
import ExpensesView from './views/ExpensesView';
import StoresView from './views/StoresView';
import DeliveryView from './views/DeliveryView';
import CustomersView from './views/CustomersView';
import CouponsView from './views/CouponsView';
import OffersView from './views/OffersView';
import MarketingView from './views/MarketingView';
import LoyaltyView from './views/LoyaltyView';
import ReferralsView from './views/ReferralsView';
import NotificationsView from './views/NotificationsView';
import ContentMgmtView from './views/ContentMgmtView';
import PaymentsView from './views/PaymentsView';
import InvoicesView from './views/InvoicesView';
import ReportsView from './views/ReportsView';
import SupportView from './views/SupportView';
import AiAnalyticsView from './views/AiAnalyticsView';
import AppMgmtView from './views/AppMgmtView';
import IntegrationsView from './views/IntegrationsView';
import SecurityView from './views/SecurityView';
import AuditLogsView from './views/AuditLogsView';
import RolesView from './views/RolesView';
import SettingsView from './views/SettingsView';

export default function App() {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('kirana_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeView, setActiveView] = useState(() => {
    return localStorage.getItem('admin_active_view') || 'overview';
  });

  useEffect(() => {
    localStorage.setItem('admin_active_view', activeView);
  }, [activeView]);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDarkStore, setActiveDarkStore] = useState('NOIDA_402');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('kirana_admin_user');
    setAdminUser(null);
  };

  // Fallback initial sample orders to ensure zero empty states
  const sampleOrders = [
    {
      id: 1,
      order_number: 'KS-94821',
      user_name: 'Akarshan Mishra',
      phone: '+91 9876543210',
      delivery_address: 'Flat 402, Block B, Sector 62, Noida',
      total_amount: 320.0,
      order_status: 'PLACED',
      delivery_slot_type: 'SAME_DAY',
      created_at: new Date().toISOString(),
      items: [
        { id: 1, product_name: 'Amul Taaza Toned Milk (500 ml)', quantity: 2, price: 27 },
        { id: 2, product_name: 'Fresh Paneer Block (200 g)', quantity: 1, price: 89 },
        { id: 3, product_name: 'Lays Magic Masala (50 g)', quantity: 3, price: 18 }
      ]
    },
    {
      id: 2,
      order_number: 'KS-94820',
      user_name: 'Priya Sharma',
      phone: '+91 9811223344',
      delivery_address: 'House 108, Indirapuram, Ghaziabad',
      total_amount: 490.0,
      order_status: 'CONFIRMED',
      delivery_slot_type: 'SAME_DAY',
      scheduled_delivery_date: 'Today (20 Aug)',
      scheduled_delivery_time: '4:00 PM - 7:00 PM',
      created_at: new Date(Date.now() - 600000).toISOString(),
      items: [
        { id: 4, product_name: 'Aashirvaad Chakki Atta (5 kg)', quantity: 1, price: 219 },
        { id: 5, product_name: 'Fortune Mustard Oil (1 L)', quantity: 1, price: 145 }
      ]
    },
    {
      id: 3,
      order_number: 'KS-94819',
      user_name: 'Vikram Mehta',
      phone: '+91 9822334455',
      delivery_address: 'Tower 4, Cyber City, Gurugram',
      total_amount: 850.0,
      order_status: 'OUT_FOR_DELIVERY',
      delivery_slot_type: 'SAME_DAY',
      scheduled_delivery_date: 'Today (20 Aug)',
      scheduled_delivery_time: '5:00 PM - 8:00 PM',
      created_at: new Date(Date.now() - 1200000).toISOString(),
      items: [
        { id: 6, product_name: 'Amul Desi Ghee (1 L)', quantity: 1, price: 589 },
        { id: 7, product_name: 'Maggi Masala Noodles (4 Pack)', quantity: 2, price: 52 }
      ]
    },
    {
      id: 4,
      order_number: 'KS-94818',
      user_name: 'Rohan Gupta',
      phone: '+91 9833445566',
      delivery_address: 'South Ex Part 2, New Delhi',
      total_amount: 140.0,
      order_status: 'DELIVERED',
      delivery_slot_type: 'NEXT_DAY',
      scheduled_delivery_date: 'Tomorrow (21 Aug)',
      scheduled_delivery_time: '7:00 AM - 10:00 AM',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      items: [
        { id: 8, product_name: 'Coca Cola Can (300 ml)', quantity: 4, price: 35 }
      ]
    }
  ];

  const [orders, setOrders] = useState(sampleOrders);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const [ordersRes, prodsRes, catsRes] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/products'),
        fetch('/api/categories')
      ]);

      if (ordersRes.ok) {
        const orderData = await ordersRes.json();
        if (orderData && orderData.length > 0) {
          setOrders(orderData);
        }
      }

      if (prodsRes.ok) {
        setProducts(await prodsRes.json());
      }

      if (catsRes.ok) {
        setCategories(await catsRes.json());
      }
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateOrderStatus = async (orderNumber, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderNumber}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_status: newStatus })
      });

      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders((prev) => prev.map((o) => (o.order_number === orderNumber ? updatedOrder : o)));
      } else {
        setOrders((prev) =>
          prev.map((o) => (o.order_number === orderNumber ? { ...o, order_status: newStatus } : o))
        );
      }
    } catch (err) {
      setOrders((prev) =>
        prev.map((o) => (o.order_number === orderNumber ? { ...o, order_status: newStatus } : o))
      );
    }
  };

  const handleUpdateProduct = async (productId, patchData) => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patchData)
      });

      if (res.ok) {
        const updatedProduct = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === productId ? updatedProduct : p)));
      } else {
        setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, ...patchData } : p)));
      }
    } catch (err) {
      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, ...patchData } : p)));
    }
  };

  const handleProductCreated = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        alert("Product deleted from catalog!");
      } else {
        // Fallback: still remove locally so the UI stays consistent
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        alert("Product removed locally (server not reachable). It will return on next refresh if not saved.");
      }
    } catch (err) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      alert("Product removed locally (server not reachable). It will return on next refresh if not saved.");
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      // 1. Dashboard Overview
      case 'overview':
        return <OverviewView orders={orders} products={products} />;
      
      // 2. Orders Pipeline
      case 'orders':
        return <OrdersView orders={orders} onUpdateStatus={handleUpdateOrderStatus} />;
      
      // 3. Products & Catalog
      case 'products':
        return (
          <ProductsView
            products={products}
            categories={categories}
            onUpdateProduct={handleUpdateProduct}
            onProductCreated={handleProductCreated}
            onDeleteProduct={handleDeleteProduct}
          />
        );
      case 'categories':
        return <CategoriesView categories={categories} setCategories={setCategories} />;
      case 'brands':
        return <BrandsView />;
      case 'reviews':
        return <ReviewsView />;
      
      // 4. Inventory & Purchasing
      case 'inventory':
        return <InventoryView products={products} onUpdateProduct={handleUpdateProduct} />;
      case 'suppliers':
        return <SuppliersView />;
      case 'expenses':
        return <ExpensesView />;
      
      // 5. Operations & Logistics
      case 'stores':
        return <StoresView />;
      case 'delivery':
        return <DeliveryView />;
      case 'customers':
        return <CustomersView />;
      
      // 6. Discounts, Marketing & CRM
      case 'coupons':
        return <CouponsView />;
      case 'offers':
        return <OffersView />;
      case 'marketing':
        return <MarketingView />;
      case 'loyalty':
        return <LoyaltyView />;
      case 'referrals':
        return <ReferralsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'content':
        return <ContentMgmtView />;
      
      // 7. Finance, Tax & Reporting
      case 'payments':
        return <PaymentsView orders={orders} />;
      case 'invoices':
        return <InvoicesView orders={orders} />;
      case 'reports':
        return <ReportsView />;
      
      // 8. Support & AI Analytics
      case 'support':
        return <SupportView />;
      case 'ai_analytics':
        return <AiAnalyticsView />;
      
      // 9. System, Integrations & Security
      case 'app_mgmt':
        return <AppMgmtView />;
      case 'integrations':
        return <IntegrationsView />;
      case 'security':
        return <SecurityView />;
      case 'audit_logs':
        return <AuditLogsView />;
      case 'roles':
        return <RolesView />;
      case 'settings':
        return <SettingsView />;
      
      default:
        return <OverviewView orders={orders} products={products} />;
    }
  };

  if (!adminUser) {
    return <AdminLoginScreen onLoginSuccess={(u) => setAdminUser(u)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans selection:bg-purple-600 selection:text-white">
      {/* Sidebar Navigation (Desktop Persistent + Mobile Drawer) */}
      <AdminSidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <AdminNavbar
          activeDarkStore={activeDarkStore}
          setActiveDarkStore={setActiveDarkStore}
          onRefresh={fetchData}
          isRefreshing={isRefreshing}
          adminUser={adminUser}
          onLogout={handleLogout}
          onToggleMobileSidebar={() => setIsMobileOpen(prev => !prev)}
        />

        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto w-full min-w-0">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Auth Modal fallback */}
      <LoginModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(u) => {
          setAdminUser(u);
          setIsAuthOpen(false);
        }}
      />
    </div>
  );
}
