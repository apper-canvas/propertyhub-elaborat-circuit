import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import SearchResults from "@/components/pages/SearchResults";
import PropertyDetails from "@/components/pages/PropertyDetails";
import SavedProperties from "@/components/pages/SavedProperties";
import MapView from "@/components/pages/MapView";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<SearchResults />} />
            <Route path="property/:id" element={<PropertyDetails />} />
            <Route path="saved" element={<SavedProperties />} />
            <Route path="map" element={<MapView />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="toast-custom"
          bodyClassName="toast-body"
          progressClassName="toast-progress"
        />
      </div>
    </BrowserRouter>
  );
}